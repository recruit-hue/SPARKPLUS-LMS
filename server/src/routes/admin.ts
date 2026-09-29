import { Router } from "express";
import { z } from "zod";
import type { DatabasePool } from "../database/pool.js";
import { requireRole, requireUser } from "../auth/middleware.js";
import { buildOrganizationTree } from "../auth/policy.js";
import type { OrganizationRecord } from "../types.js";
import type { AppConfig } from "../config.js";
import { syncGoogleArchive } from "../google/archive.js";
import { ensureLearningSchema } from "../database/learning-schema.js";
import { awardReward } from "./rewards.js";

const companyEmail = z.string().trim().toLowerCase().email().refine((value) => value.endsWith("@sparkplus.co"));
const userInput = z.object({
  employeeNumber: z.string().trim().min(1).max(50), name: z.string().trim().min(1).max(100), email: companyEmail,
  organizationId: z.string().uuid().nullable().optional(), position: z.string().trim().max(100).nullable().optional(),
  role: z.enum(["ADMIN", "LEARNER"]).default("LEARNER"), status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});
const userPatch = userInput.partial().refine((value) => Object.keys(value).length > 0);
const organizationInput = z.object({
  name: z.string().trim().min(1).max(120), parentId: z.string().uuid().nullable().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});
const organizationPatch = organizationInput.partial().refine((value) => Object.keys(value).length > 0);
const importInput = z.object({ rows: z.array(z.object({
  employeeNumber: z.string().trim().min(1).max(50), name: z.string().trim().min(1).max(100), email: companyEmail,
  organizationPath: z.string().trim().min(1), position: z.string().trim().max(100).optional().default(""),
  role: z.enum(["ADMIN", "LEARNER"]).optional().default("LEARNER"), status: z.enum(["ACTIVE", "INACTIVE"]).optional().default("ACTIVE"),
})).min(1).max(500) });

const invalid = (response: any, error: z.ZodError) => response.status(400).json({ data: null, error: { code: "VALIDATION_ERROR", details: error.issues } });
async function audit(pool: DatabasePool, actor: string, action: string, type: string, id: string | null, before: unknown, after: unknown, ip?: string) {
  await pool.query(`INSERT INTO audit_logs (actor_user_id, action, target_type, target_id, before_data, after_data, ip_address)
    VALUES ($1,$2,$3,$4,$5,$6,$7)`, [actor, action, type, id, before ? JSON.stringify(before) : null, after ? JSON.stringify(after) : null, ip || null]);
}
let organizationOrderReady: Promise<void> | null = null;
let corporateOrganizationReady: Promise<void> | null = null;
function ensureCorporateOrganizationSchema(pool: DatabasePool) {
  if (!corporateOrganizationReady) corporateOrganizationReady = (async () => {
    await pool.query(`ALTER TABLE organizations DROP CONSTRAINT IF EXISTS organizations_depth_check`);
    await pool.query(`ALTER TABLE organizations ADD CONSTRAINT organizations_depth_check CHECK (depth >= 0 AND depth <= 3)`);
  })().catch((error) => { corporateOrganizationReady = null; throw error; });
  return corporateOrganizationReady;
}
function ensureOrganizationOrderSchema(pool: DatabasePool) {
  if (!organizationOrderReady) organizationOrderReady = (async () => {
    await pool.query(`ALTER TABLE organizations ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0`);
    await pool.query(`WITH ranked AS (
      SELECT id,row_number() OVER (PARTITION BY parent_id ORDER BY CASE WHEN name='스파크플러스' THEN 0 ELSE 1 END,name,id)::integer AS position
      FROM organizations
    ) UPDATE organizations AS organization SET sort_order=ranked.position FROM ranked
      WHERE organization.id=ranked.id AND NOT EXISTS (SELECT 1 FROM organizations WHERE sort_order<>0)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS organizations_parent_sort_idx ON organizations(parent_id,sort_order)`);
  })().catch((error) => { organizationOrderReady = null; throw error; });
  return organizationOrderReady;
}

export function createAdminRouter(pool: DatabasePool, config?: AppConfig) {
  const router = Router();
  router.use(requireUser(pool), requireRole("ADMIN"));

  router.get("/management", async (request, response, next) => {
    try {
      await ensureOrganizationOrderSchema(pool);
      await ensureCorporateOrganizationSchema(pool);
      const [users, organizations, latestArchive] = await Promise.all([
        pool.query(`SELECT u.id, u.employee_number AS "employeeNumber", u.name, u.email,
          u.organization_id AS "organizationId", o.name AS "organizationName", u.position, u.role, u.status,
          u.last_login_at AS "lastLoginAt" FROM users u LEFT JOIN organizations o ON o.id=u.organization_id
          WHERE u.status<>'DELETED' ORDER BY u.name`),
        pool.query<{ id: string; name: string; parentId: string | null; depth: number; sortOrder: number; status: OrganizationRecord["status"] }>(
          `SELECT id,name,parent_id AS "parentId",depth,sort_order AS "sortOrder",status FROM organizations ORDER BY parent_id NULLS FIRST,sort_order,name`),
        pool.query(`SELECT action,after_data AS "afterData",created_at AS "createdAt" FROM audit_logs
          WHERE action IN ('GOOGLE_ARCHIVE_SYNCED','GOOGLE_ARCHIVE_FAILED') ORDER BY created_at DESC LIMIT 1`),
      ]);
      console.info("[admin/management] loaded", {
        actor: request.currentUser!.id,
        users: users.rowCount,
        organizations: organizations.rowCount,
      });
      response.json({ data: {
        users: users.rows,
        organizationTree: buildOrganizationTree(organizations.rows),
        archiveStatus: {
          configured: Boolean(config?.GOOGLE_SERVICE_ACCOUNT_JSON && config.GOOGLE_SHEET_ID && config.GOOGLE_DRIVE_ROOT_FOLDER_ID),
          latest: latestArchive.rows[0] || null,
        },
      }, error: null });
    } catch (error) {
      console.error("[admin/management] failed", { actor: request.currentUser?.id, error });
      next(error);
    }
  });

  router.get("/dashboard", async (request, response, next) => {
    const parsed = z.object({
      start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    }).refine(({ start, end }) => start <= end, { message: "start must not be after end" }).safeParse(request.query);
    if (!parsed.success) return invalid(response, parsed.error);
    try {
      const { start, end } = parsed.data;
      const results = await Promise.allSettled([
        pool.query(`SELECT
          (SELECT COUNT(*) FROM courses c WHERE c.deleted_at IS NULL AND c.status='OPEN'
            AND (c.start_date IS NULL OR c.start_date < ($2::date + interval '1 day'))
            AND (c.end_date IS NULL OR c.end_date >= $1::date))::int AS courses,
          (SELECT COUNT(DISTINCT e.user_id) FROM enrollments e WHERE e.status<>'CANCELLED'
            AND e.enrolled_at >= $1::date AND e.enrolled_at < ($2::date + interval '1 day'))::int AS learners,
          (SELECT COUNT(DISTINCT e.user_id) FROM enrollments e WHERE e.status<>'CANCELLED'
            AND e.completed_at >= $1::date AND e.completed_at < ($2::date + interval '1 day'))::int AS completed,
          COALESCE((SELECT ROUND(AVG(e.progress)) FROM enrollments e WHERE e.status<>'CANCELLED'
            AND e.enrolled_at < ($2::date + interval '1 day')),0)::int AS progress,
          COALESCE((SELECT ROUND(100.0 * COUNT(*) FILTER(WHERE e.completed_at >= $1::date AND e.completed_at < ($2::date + interval '1 day'))
            / NULLIF(COUNT(*) FILTER(WHERE e.enrolled_at >= $1::date AND e.enrolled_at < ($2::date + interval '1 day')),0))
            FROM enrollments e WHERE e.status<>'CANCELLED'),0)::int AS "completionRate",
          (SELECT COUNT(*) FROM enrollments e WHERE e.required AND e.status NOT IN ('COMPLETED','CANCELLED'))::int AS "requiredIncomplete",
          (SELECT COUNT(*) FROM enrollments e WHERE e.status='IN_PROGRESS' AND NOT EXISTS
            (SELECT 1 FROM lesson_progress lp WHERE lp.enrollment_id=e.id AND lp.updated_at>=now()-interval '14 days'))::int AS delayed`, [start, end]),
        pool.query(`WITH months AS (
          SELECT generate_series(date_trunc('month',$1::date),date_trunc('month',$2::date),interval '1 month') AS month_start
        ) SELECT to_char(m.month_start,'YYYY-MM') AS key,to_char(m.month_start,'FMMM월') AS month,
          COUNT(e.id) FILTER(WHERE e.completed_at>=m.month_start AND e.completed_at<m.month_start+interval '1 month')::int AS completed,
          COUNT(e.id) FILTER(WHERE e.enrolled_at<m.month_start+interval '1 month' AND e.status<>'CANCELLED')::int AS active,
          COUNT(DISTINCT e.course_id) FILTER(WHERE e.completed_at>=m.month_start AND e.completed_at<m.month_start+interval '1 month')::int AS courses,
          COUNT(DISTINCT e.user_id) FILTER(WHERE e.enrolled_at>=m.month_start AND e.enrolled_at<m.month_start+interval '1 month')::int AS "newLearners",
          COALESCE(ROUND(AVG(e.progress) FILTER(WHERE e.enrolled_at<m.month_start+interval '1 month')),0)::int AS progress,
          COALESCE(ROUND(100.0*COUNT(e.id) FILTER(WHERE e.completed_at>=m.month_start AND e.completed_at<m.month_start+interval '1 month')
            /NULLIF(COUNT(e.id) FILTER(WHERE e.enrolled_at>=m.month_start AND e.enrolled_at<m.month_start+interval '1 month' AND e.status<>'CANCELLED'),0)),0)::int AS "completionRate"
          FROM months m LEFT JOIN enrollments e ON e.enrolled_at<m.month_start+interval '1 month'
          GROUP BY m.month_start ORDER BY m.month_start`, [start, end]),
      ]);
      const fallbackTotals = { courses:0, learners:0, completed:0, progress:0, completionRate:0, requiredIncomplete:0, delayed:0 };
      const totals = results[0].status === "fulfilled" ? results[0].value.rows[0] : fallbackTotals;
      const monthly = results[1].status === "fulfilled" ? results[1].value.rows : [];
      results.forEach((result, index) => {
        if (result.status === "rejected") console.error("[admin/dashboard] partial query failed", { index, start, end, error: result.reason });
      });
      if (results.every((result) => result.status === "rejected")) throw results[0].status === "rejected" ? results[0].reason : new Error("Dashboard queries failed");
      response.json({data:{totals,monthly},error:null});
    } catch(error){next(error);}
  });

  router.get("/learning-activity", async (request, response, next) => {
    const parsed = z.object({
      start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      type: z.enum(["ENROLLED", "COMPLETED"]).default("ENROLLED"), query: z.string().trim().max(100).optional().default(""),
    }).safeParse(request.query);
    if (!parsed.success) return invalid(response, parsed.error);
    try {
      await ensureLearningSchema(pool);
      const { start, end, type, query } = parsed.data;
      const eventColumn = type === "COMPLETED" ? "e.completed_at" : "e.enrolled_at";
      const baseWhere = `e.status<>'CANCELLED' AND ${eventColumn} >= $1::date AND ${eventColumn} < ($2::date + interval '1 day')`;
      const [summary, rows] = await Promise.all([
        pool.query(`SELECT
          COUNT(DISTINCT e.id) FILTER(WHERE e.enrolled_at >= $1::date AND e.enrolled_at < ($2::date + interval '1 day') AND e.status<>'CANCELLED')::int AS "enrollmentCount",
          COUNT(DISTINCT e.user_id) FILTER(WHERE e.enrolled_at >= $1::date AND e.enrolled_at < ($2::date + interval '1 day') AND e.status<>'CANCELLED')::int AS "enrolledPeople",
          COUNT(DISTINCT e.id) FILTER(WHERE e.completed_at >= $1::date AND e.completed_at < ($2::date + interval '1 day') AND e.status<>'CANCELLED')::int AS "completionCount",
          COUNT(DISTINCT e.user_id) FILTER(WHERE e.completed_at >= $1::date AND e.completed_at < ($2::date + interval '1 day') AND e.status<>'CANCELLED')::int AS "completedPeople",
          COUNT(DISTINCT e.course_id) FILTER(WHERE ((e.enrolled_at >= $1::date AND e.enrolled_at < ($2::date + interval '1 day')) OR (e.completed_at >= $1::date AND e.completed_at < ($2::date + interval '1 day'))) AND e.status<>'CANCELLED')::int AS "courseCount",
          COALESCE(SUM(rt.points) FILTER(WHERE rt.created_at >= $1::date AND rt.created_at < ($2::date + interval '1 day')),0)::int AS "rewardPoints"
          FROM enrollments e LEFT JOIN reward_transactions rt ON rt.enrollment_id=e.id`, [start, end]),
        pool.query(`SELECT e.id AS "enrollmentId",u.id AS "userId",u.employee_number AS "employeeNumber",u.name,u.email,
          COALESCE(o.name,'소속 미지정') AS organization,c.id AS "courseId",c.title AS course,c.category,e.required,e.status,e.progress,
          e.enrolled_at AS "enrolledAt",e.completed_at AS "completedAt",COUNT(DISTINCT lp.lesson_id) FILTER(WHERE lp.completed)::int AS "completedLessons",
          COUNT(DISTINCT l.id)::int AS "totalLessons",COALESCE((SELECT SUM(reward.points) FROM reward_transactions reward WHERE reward.enrollment_id=e.id),0)::int AS "rewardPoints"
          FROM enrollments e JOIN users u ON u.id=e.user_id JOIN courses c ON c.id=e.course_id
          LEFT JOIN organizations o ON o.id=u.organization_id LEFT JOIN lessons l ON l.course_id=c.id
          LEFT JOIN lesson_progress lp ON lp.enrollment_id=e.id AND lp.lesson_id=l.id
          WHERE ${baseWhere} AND ($3='' OR u.name ILIKE '%'||$3||'%' OR u.employee_number ILIKE '%'||$3||'%' OR c.title ILIKE '%'||$3||'%')
          GROUP BY e.id,u.id,o.name,c.id ORDER BY ${eventColumn} DESC LIMIT 500`, [start, end, query]),
      ]);
      response.json({ data: { summary: summary.rows[0], rows: rows.rows }, error: null });
    } catch (error) { next(error); }
  });

  router.post("/enrollments/:id/manual-complete", async (request, response, next) => {
    const parsed = z.object({ reason: z.string().trim().max(1000).optional().default("") }).safeParse(request.body);
    if (!parsed.success) return invalid(response, parsed.error);
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const current = await client.query(`SELECT e.id,e.user_id AS "userId",e.status,e.progress,e.completed_at AS "completedAt",
        u.name AS "userName",c.title AS "courseTitle" FROM enrollments e JOIN users u ON u.id=e.user_id
        JOIN courses c ON c.id=e.course_id WHERE e.id=$1 AND e.status<>'CANCELLED' FOR UPDATE`, [request.params.id]);
      if (!current.rowCount) { await client.query("ROLLBACK"); return response.status(404).json({ data:null,error:{code:"ENROLLMENT_NOT_FOUND"} }); }
      if (current.rows[0].status === "COMPLETED") { await client.query("ROLLBACK"); return response.status(409).json({ data:null,error:{code:"ALREADY_COMPLETED"} }); }
      const completed = await client.query(`UPDATE enrollments SET status='COMPLETED',progress=100,completed_at=now()
        WHERE id=$1 RETURNING id,status,progress,completed_at AS "completedAt"`, [request.params.id]);
      const certificateNumber = `SPARKPLUS-${new Date().getFullYear()}-${request.params.id.slice(0,8).toUpperCase()}`;
      await client.query(`INSERT INTO certificates(enrollment_id,certificate_number) VALUES($1,$2) ON CONFLICT(enrollment_id) DO NOTHING`, [request.params.id, certificateNumber]);
      await client.query(`INSERT INTO audit_logs(actor_user_id,action,target_type,target_id,before_data,after_data,ip_address)
        VALUES($1,'ENROLLMENT_MANUALLY_COMPLETED','ENROLLMENT',$2,$3,$4,$5)`, [request.currentUser!.id, request.params.id,
        JSON.stringify(current.rows[0]), JSON.stringify({ ...completed.rows[0], reason:parsed.data.reason || "관리자 판단에 따른 수동 수료", userName:current.rows[0].userName, courseTitle:current.rows[0].courseTitle }), request.ip || null]);
      await client.query("COMMIT");
      try { await awardReward(pool,{userId:current.rows[0].userId,enrollmentId:request.params.id,activityType:"COURSE_COMPLETE",sourceKey:`course:${request.params.id}`,description:`관리자 수동 수료: ${current.rows[0].courseTitle}`}); }
      catch (rewardError) { console.error("[admin/manual-complete] reward failed", { enrollmentId:request.params.id,rewardError }); }
      response.json({ data:{...completed.rows[0],certificateNumber,manual:true,reason:parsed.data.reason || null},error:null });
    } catch (error) {
      await client.query("ROLLBACK").catch(()=>undefined);
      next(error);
    } finally { client.release(); }
  });

  router.get("/users", async (_request, response, next) => {
    try {
      const result = await pool.query(`SELECT u.id, u.employee_number AS "employeeNumber", u.name, u.email,
        u.organization_id AS "organizationId", o.name AS "organizationName", u.position, u.role, u.status,
        u.last_login_at AS "lastLoginAt" FROM users u LEFT JOIN organizations o ON o.id=u.organization_id
        WHERE u.status<>'DELETED' ORDER BY u.name`);
      response.json({ data: result.rows, error: null });
    } catch (error) { next(error); }
  });

  router.get("/users/:id/learning-summary", async (request, response, next) => {
    try {
      await ensureLearningSchema(pool);
      const userResult = await pool.query(`SELECT u.id,u.employee_number AS "employeeNumber",u.name,u.email,
        u.organization_id AS "organizationId",COALESCE(o.name,'소속 미지정') AS "organizationName",u.position,u.role,u.status
        FROM users u LEFT JOIN organizations o ON o.id=u.organization_id WHERE u.id=$1 AND u.status<>'DELETED'`, [request.params.id]);
      if (!userResult.rowCount) return response.status(404).json({ data: null, error: { code: "USER_NOT_FOUND" } });
      const [courses,badges,rewards] = await Promise.all([
        pool.query(`SELECT e.id AS "enrollmentId",c.id,c.title,c.category,c.level,c.start_date AS "startDate",c.end_date AS "endDate",
          e.required,e.status,e.progress,e.completed_at AS "completedAt",(e.survey_submitted_at IS NOT NULL) AS "surveySubmitted",
          c.survey_enabled AS "surveyRequired",COUNT(DISTINCT l.id)::int AS "totalLessons",
          COUNT(DISTINCT lp.lesson_id) FILTER(WHERE lp.completed)::int AS "completedLessons",cert.certificate_number AS "certificateNumber"
          FROM enrollments e JOIN courses c ON c.id=e.course_id LEFT JOIN lessons l ON l.course_id=c.id
          LEFT JOIN lesson_progress lp ON lp.lesson_id=l.id AND lp.enrollment_id=e.id LEFT JOIN certificates cert ON cert.enrollment_id=e.id
          WHERE e.user_id=$1 AND e.status<>'CANCELLED' GROUP BY e.id,c.id,cert.certificate_number ORDER BY e.enrolled_at DESC`, [request.params.id]),
        pool.query(`SELECT br.id,br.name,br.description,br.tone,br.icon,ub.awarded_at AS "awardedAt"
          FROM user_badges ub JOIN badge_rules br ON br.id=ub.badge_rule_id WHERE ub.user_id=$1 ORDER BY ub.awarded_at DESC`, [request.params.id]),
        pool.query(`SELECT COALESCE(SUM(points),0)::int AS points FROM reward_transactions WHERE user_id=$1`, [request.params.id]),
      ]);
      const rows = courses.rows.map((course) => ({ ...course, progress:Number(course.progress || 0) }));
      const completed = rows.filter((course) => course.status === "COMPLETED").length;
      const requiredRows = rows.filter((course) => course.required);
      response.json({ data: {
        user:userResult.rows[0], courses:rows, badges:badges.rows,
        summary:{ courses:rows.length, completed, averageProgress:rows.length ? Math.round(rows.reduce((sum,course)=>sum+course.progress,0)/rows.length) : 0,
          badgeCount:badges.rowCount || 0, points:rewards.rows[0].points, requiredTotal:requiredRows.length,
          requiredCompleted:requiredRows.filter((course)=>course.status === "COMPLETED").length },
      }, error:null });
    } catch (error) { next(error); }
  });

  router.post("/users", async (request, response, next) => {
    const parsed = userInput.safeParse(request.body); if (!parsed.success) return invalid(response, parsed.error);
    try {
      const value = parsed.data;
      const result = await pool.query(`INSERT INTO users (employee_number,name,email,organization_id,position,role,status)
        VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, employee_number AS "employeeNumber", name, email,
        organization_id AS "organizationId", position, role, status`,
        [value.employeeNumber.toUpperCase(), value.name, value.email, value.organizationId || null, value.position || null, value.role, value.status]);
      await audit(pool, request.currentUser!.id, "USER_CREATED", "USER", result.rows[0].id, null, result.rows[0], request.ip);
      response.status(201).json({ data: result.rows[0], error: null });
    } catch (error: any) {
      if (error?.code === "23505") return response.status(409).json({ data: null, error: { code: "USER_ALREADY_EXISTS" } });
      if (error?.code === "23503") return response.status(400).json({ data: null, error: { code: "ORGANIZATION_NOT_FOUND" } });
      next(error);
    }
  });

  router.patch("/users/:id", async (request, response, next) => {
    const parsed = userPatch.safeParse(request.body); if (!parsed.success) return invalid(response, parsed.error);
    try {
      const before = await pool.query(`SELECT * FROM users WHERE id=$1 AND status<>'DELETED'`, [request.params.id]);
      if (!before.rowCount) return response.status(404).json({ data: null, error: { code: "USER_NOT_FOUND" } });
      const value = parsed.data;
      const protectedAdmin = before.rows[0].email.toLowerCase() === config?.INITIAL_ADMIN_EMAIL.toLowerCase();
      if (protectedAdmin && (value.role === "LEARNER" || value.status === "INACTIVE")) {
        return response.status(400).json({ data: null, error: { code: "INITIAL_ADMIN_PROTECTED" } });
      }
      const result = await pool.query(`UPDATE users SET employee_number=COALESCE($2,employee_number), name=COALESCE($3,name),
        email=COALESCE($4,email), organization_id=CASE WHEN $5::boolean THEN $6::uuid ELSE organization_id END,
        position=CASE WHEN $7::boolean THEN $8 ELSE position END, role=COALESCE($9,role), status=COALESCE($10,status),
        updated_at=now() WHERE id=$1 AND status<>'DELETED' RETURNING id, employee_number AS "employeeNumber", name,
        email, organization_id AS "organizationId", position, role, status`,
        [request.params.id, value.employeeNumber?.toUpperCase() || null, value.name || null, value.email || null,
          "organizationId" in value, value.organizationId || null, "position" in value, value.position || null, value.role || null, value.status || null]);
      await audit(pool, request.currentUser!.id, "USER_UPDATED", "USER", request.params.id, before.rows[0], result.rows[0], request.ip);
      response.json({ data: result.rows[0], error: null });
    } catch (error: any) {
      if (error?.code === "23505") return response.status(409).json({ data: null, error: { code: "USER_ALREADY_EXISTS" } });
      if (error?.code === "23503") return response.status(400).json({ data: null, error: { code: "ORGANIZATION_NOT_FOUND" } });
      next(error);
    }
  });

  router.delete("/users/:id", async (request, response, next) => {
    try {
      if (request.params.id === request.currentUser!.id) return response.status(400).json({ data: null, error: { code: "CANNOT_DELETE_SELF" } });
      const target = await pool.query(`SELECT email FROM users WHERE id=$1 AND status<>'DELETED'`, [request.params.id]);
      if (target.rows[0]?.email.toLowerCase() === config?.INITIAL_ADMIN_EMAIL.toLowerCase()) {
        return response.status(400).json({ data: null, error: { code: "INITIAL_ADMIN_PROTECTED" } });
      }
      const result = await pool.query(`UPDATE users SET status='DELETED', deleted_at=now(), google_subject=NULL, updated_at=now()
        WHERE id=$1 AND status<>'DELETED' RETURNING id, employee_number AS "employeeNumber", name, email`, [request.params.id]);
      if (!result.rowCount) return response.status(404).json({ data: null, error: { code: "USER_NOT_FOUND" } });
      await audit(pool, request.currentUser!.id, "USER_DELETED", "USER", request.params.id, result.rows[0], null, request.ip);
      response.status(204).end();
    } catch (error) { next(error); }
  });

  router.post("/users/import", async (request, response, next) => {
    const parsed = importInput.safeParse(request.body); if (!parsed.success) return invalid(response, parsed.error);
    const client = await pool.connect();
    try {
      const organizations = await client.query(`SELECT id,name,parent_id AS "parentId" FROM organizations WHERE status='ACTIVE'`);
      const byId = new Map(organizations.rows.map((item) => [item.id, item]));
      const pathFor = (item: any): string => item.parentId ? `${pathFor(byId.get(item.parentId))} > ${item.name}` : item.name;
      const byPath = new Map(organizations.rows.map((item) => [pathFor(item), item.id]));
      const numbers = new Set<string>(), emails = new Set<string>();
      const errors: Array<{ row: number; code: string }> = [];
      parsed.data.rows.forEach((row, index) => {
        const number = row.employeeNumber.toUpperCase();
        if (numbers.has(number)) errors.push({ row: index + 2, code: "DUPLICATE_EMPLOYEE_NUMBER_IN_FILE" });
        if (emails.has(row.email)) errors.push({ row: index + 2, code: "DUPLICATE_EMAIL_IN_FILE" });
        if (!byPath.has(row.organizationPath)) errors.push({ row: index + 2, code: "ORGANIZATION_PATH_NOT_FOUND" });
        numbers.add(number); emails.add(row.email);
      });
      if (errors.length) return response.status(400).json({ data: null, error: { code: "IMPORT_VALIDATION_FAILED", details: errors } });
      await client.query("BEGIN");
      for (const row of parsed.data.rows) await client.query(`INSERT INTO users
        (employee_number,name,email,organization_id,position,role,status) VALUES ($1,$2,$3,$4,$5,$6,$7)
        ON CONFLICT (employee_number) DO UPDATE SET name=EXCLUDED.name,email=EXCLUDED.email,organization_id=EXCLUDED.organization_id,
        position=EXCLUDED.position,role=EXCLUDED.role,status=EXCLUDED.status,updated_at=now()`,
        [row.employeeNumber.toUpperCase(), row.name, row.email, byPath.get(row.organizationPath), row.position || null, row.role, row.status]);
      await client.query("COMMIT");
      await audit(pool, request.currentUser!.id, "USERS_IMPORTED", "USER_IMPORT", null, null, { count: parsed.data.rows.length }, request.ip);
      response.json({ data: { imported: parsed.data.rows.length }, error: null });
    } catch (error: any) {
      await client.query("ROLLBACK").catch(() => undefined);
      if (error?.code === "23505") return response.status(409).json({ data: null, error: { code: "IMPORT_CONFLICT" } });
      next(error);
    } finally { client.release(); }
  });

  router.get("/organizations/tree", async (_request, response, next) => {
    try {
      await ensureOrganizationOrderSchema(pool);
      const result = await pool.query<{ id: string; name: string; parentId: string | null; depth: number; sortOrder: number; status: OrganizationRecord["status"] }>(
        `SELECT id,name,parent_id AS "parentId",depth,sort_order AS "sortOrder",status FROM organizations ORDER BY parent_id NULLS FIRST,sort_order,name`);
      response.json({ data: buildOrganizationTree(result.rows), error: null });
    } catch (error) { next(error); }
  });

  router.post("/organizations", async (request, response, next) => {
    const parsed = organizationInput.safeParse(request.body); if (!parsed.success) return invalid(response, parsed.error);
    const client = await pool.connect();
    try {
      await ensureOrganizationOrderSchema(pool);
      await ensureCorporateOrganizationSchema(pool);
      await client.query("BEGIN");
      const parent = parsed.data.parentId ? await client.query(`SELECT id,depth,path FROM organizations WHERE id=$1 AND status='ACTIVE' FOR UPDATE`, [parsed.data.parentId]) : null;
      if (parsed.data.parentId && !parent?.rowCount) { await client.query("ROLLBACK"); return response.status(400).json({ data: null, error: { code: "PARENT_ORGANIZATION_NOT_FOUND" } }); }
      const depth = parent?.rowCount ? Number(parent.rows[0].depth) + 1 : 0;
      if (depth > 3) { await client.query("ROLLBACK"); return response.status(400).json({ data: null, error: { code: "ORGANIZATION_DEPTH_EXCEEDED" } }); }
      const id = (await client.query(`SELECT gen_random_uuid() AS id`)).rows[0].id;
      const path = parent?.rows[0].path ? `${parent.rows[0].path}${id}/` : `/${id}/`;
      const nextOrder = (await client.query(`SELECT COALESCE(MAX(sort_order),0)+1 AS value FROM organizations WHERE parent_id IS NOT DISTINCT FROM $1::uuid`, [parsed.data.parentId || null])).rows[0].value;
      const result = await client.query(`INSERT INTO organizations (id,name,parent_id,depth,path,status,sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING id,name,parent_id AS "parentId",depth,sort_order AS "sortOrder",status`, [id, parsed.data.name, parsed.data.parentId || null, depth, path, parsed.data.status, nextOrder]);
      await client.query("COMMIT");
      await audit(pool, request.currentUser!.id, "ORGANIZATION_CREATED", "ORGANIZATION", id, null, result.rows[0], request.ip);
      response.status(201).json({ data: result.rows[0], error: null });
    } catch (error: any) {
      await client.query("ROLLBACK").catch(() => undefined);
      if (error?.code === "23505") return response.status(409).json({ data: null, error: { code: "ORGANIZATION_ALREADY_EXISTS" } });
      next(error);
    } finally { client.release(); }
  });

  router.patch("/organizations/:id", async (request, response, next) => {
    const parsed = organizationPatch.safeParse(request.body); if (!parsed.success) return invalid(response, parsed.error);
    try {
      const result = await pool.query(`UPDATE organizations SET name=COALESCE($2,name),status=COALESCE($3,status),updated_at=now()
        WHERE id=$1 RETURNING id,name,parent_id AS "parentId",depth,status`, [request.params.id, parsed.data.name || null, parsed.data.status || null]);
      if (!result.rowCount) return response.status(404).json({ data: null, error: { code: "ORGANIZATION_NOT_FOUND" } });
      await audit(pool, request.currentUser!.id, "ORGANIZATION_UPDATED", "ORGANIZATION", request.params.id, null, result.rows[0], request.ip);
      response.json({ data: result.rows[0], error: null });
    } catch (error: any) {
      if (error?.code === "23505") return response.status(409).json({ data: null, error: { code: "ORGANIZATION_ALREADY_EXISTS" } });
      next(error);
    }
  });

  router.post("/organizations/:id/promote-corporation", async (request, response, next) => {
    const client = await pool.connect();
    try {
      await ensureCorporateOrganizationSchema(pool);
      await client.query("BEGIN");
      const organization = await client.query(`SELECT id,name,parent_id AS "parentId",depth FROM organizations WHERE id=$1 FOR UPDATE`, [request.params.id]);
      if (!organization.rowCount) { await client.query("ROLLBACK"); return response.status(404).json({ data: null, error: { code: "ORGANIZATION_NOT_FOUND" } }); }
      if (organization.rows[0].parentId) { await client.query("ROLLBACK"); return response.status(409).json({ data: null, error: { code: "CORPORATION_MUST_BE_ROOT" } }); }
      const result = await client.query(`WITH RECURSIVE tree AS (
        SELECT id,0 AS new_depth FROM organizations WHERE id=$1
        UNION ALL SELECT child.id,tree.new_depth+1 FROM organizations child JOIN tree ON child.parent_id=tree.id
      ) UPDATE organizations AS organization SET depth=tree.new_depth,updated_at=now() FROM tree
        WHERE organization.id=tree.id RETURNING organization.id,organization.name,organization.parent_id AS "parentId",organization.depth,organization.status`, [request.params.id]);
      if (result.rows.some((item) => Number(item.depth) > 3)) { await client.query("ROLLBACK"); return response.status(409).json({ data: null, error: { code: "ORGANIZATION_DEPTH_EXCEEDED" } }); }
      await client.query("COMMIT");
      await audit(pool, request.currentUser!.id, "ORGANIZATION_PROMOTED_TO_CORPORATION", "ORGANIZATION", request.params.id, organization.rows[0], result.rows[0], request.ip);
      response.json({ data: result.rows[0], error: null });
    } catch (error) { await client.query("ROLLBACK").catch(() => undefined); next(error); }
    finally { client.release(); }
  });

  router.post("/organizations/:id/reorder", async (request, response, next) => {
    const parsed = z.object({ direction: z.enum(["UP", "DOWN"]) }).safeParse(request.body);
    if (!parsed.success) return invalid(response, parsed.error);
    const client = await pool.connect();
    try {
      await ensureOrganizationOrderSchema(pool);
      await client.query("BEGIN");
      const current = await client.query(`SELECT id,name,parent_id AS "parentId",sort_order AS "sortOrder" FROM organizations WHERE id=$1 FOR UPDATE`, [request.params.id]);
      if (!current.rowCount) { await client.query("ROLLBACK"); return response.status(404).json({ data: null, error: { code: "ORGANIZATION_NOT_FOUND" } }); }
      const item = current.rows[0];
      const upward = parsed.data.direction === "UP";
      const neighbor = await client.query(`SELECT id,name,sort_order AS "sortOrder" FROM organizations
        WHERE parent_id IS NOT DISTINCT FROM $1::uuid AND id<>$2 AND sort_order ${upward ? "<" : ">"} $3
        ORDER BY sort_order ${upward ? "DESC" : "ASC"},name ${upward ? "DESC" : "ASC"} LIMIT 1 FOR UPDATE`,
        [item.parentId, item.id, item.sortOrder]);
      if (neighbor.rowCount) {
        await client.query(`UPDATE organizations SET sort_order=$2,updated_at=now() WHERE id=$1`, [item.id, neighbor.rows[0].sortOrder]);
        await client.query(`UPDATE organizations SET sort_order=$2,updated_at=now() WHERE id=$1`, [neighbor.rows[0].id, item.sortOrder]);
      }
      await client.query("COMMIT");
      await audit(pool, request.currentUser!.id, "ORGANIZATION_REORDERED", "ORGANIZATION", item.id, item, { direction: parsed.data.direction, neighbor: neighbor.rows[0] || null }, request.ip);
      response.json({ data: { id: item.id, moved: Boolean(neighbor.rowCount) }, error: null });
    } catch (error) { await client.query("ROLLBACK").catch(() => undefined); next(error); }
    finally { client.release(); }
  });

  router.delete("/organizations/:id", async (request, response, next) => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const organization = await client.query(`SELECT id,name,parent_id AS "parentId",depth,status FROM organizations WHERE id=$1 FOR UPDATE`, [request.params.id]);
      if (!organization.rowCount) {
        await client.query("ROLLBACK");
        return response.status(404).json({ data: null, error: { code: "ORGANIZATION_NOT_FOUND" } });
      }
      const [children, users, assignments] = await Promise.all([
        client.query(`SELECT count(*)::int AS count FROM organizations WHERE parent_id=$1`, [request.params.id]),
        client.query(`SELECT count(*)::int AS count FROM users WHERE organization_id=$1 AND status<>'DELETED'`, [request.params.id]),
        client.query(`SELECT count(*)::int AS count FROM course_assignments WHERE assignment_type='ORGANIZATION' AND (target_id=$1 OR target_id=$2)`, [request.params.id, organization.rows[0].name]),
      ]);
      const blockers = {
        children: children.rows[0].count,
        users: users.rows[0].count,
        assignments: assignments.rows[0].count,
      };
      if (blockers.children || blockers.users || blockers.assignments) {
        await client.query("ROLLBACK");
        return response.status(409).json({ data: null, error: { code: "ORGANIZATION_DELETE_BLOCKED", details: blockers } });
      }
      await client.query(`UPDATE users SET organization_id=NULL,updated_at=now() WHERE organization_id=$1 AND status='DELETED'`, [request.params.id]);
      await client.query(`DELETE FROM organizations WHERE id=$1`, [request.params.id]);
      await client.query("COMMIT");
      await audit(pool, request.currentUser!.id, "ORGANIZATION_DELETED", "ORGANIZATION", request.params.id, organization.rows[0], null, request.ip);
      response.json({ data: { id: request.params.id }, error: null });
    } catch (error: any) {
      await client.query("ROLLBACK").catch(() => undefined);
      if (error?.code === "23503") return response.status(409).json({ data: null, error: { code: "ORGANIZATION_DELETE_BLOCKED" } });
      next(error);
    } finally { client.release(); }
  });

  router.get("/users/:id/leader-scopes", async (request, response, next) => {
    try { const result=await pool.query(`SELECT organization_id AS "organizationId",include_descendants AS "includeDescendants" FROM organization_leaders WHERE user_id=$1`,[request.params.id]); response.json({data:result.rows,error:null}); }
    catch(error){next(error);}
  });
  router.put("/users/:id/leader-scopes", async (request, response, next) => {
    const parsed=z.object({organizationIds:z.array(z.string().uuid()).max(50)}).safeParse(request.body);
    if(!parsed.success)return invalid(response,parsed.error);
    const client=await pool.connect();try{await client.query("BEGIN");await client.query(`DELETE FROM organization_leaders WHERE user_id=$1`,[request.params.id]);for(const organizationId of parsed.data.organizationIds)await client.query(`INSERT INTO organization_leaders(user_id,organization_id,created_by) VALUES($1,$2,$3)`,[request.params.id,organizationId,request.currentUser!.id]);await client.query("COMMIT");response.json({data:{organizationIds:parsed.data.organizationIds},error:null});}catch(error){await client.query("ROLLBACK");next(error);}finally{client.release();}
  });

  router.get("/archive/status", async (_request, response, next) => {
    try {
      const latest = await pool.query(`SELECT action,after_data AS "afterData",created_at AS "createdAt" FROM audit_logs
        WHERE action IN ('GOOGLE_ARCHIVE_SYNCED','GOOGLE_ARCHIVE_FAILED') ORDER BY created_at DESC LIMIT 1`);
      response.json({ data: { configured: Boolean(config?.GOOGLE_SERVICE_ACCOUNT_JSON && config.GOOGLE_SHEET_ID && config.GOOGLE_DRIVE_ROOT_FOLDER_ID), latest: latest.rows[0] || null }, error: null });
    } catch (error) { next(error); }
  });

  router.post("/archive/sync", async (request, response, next) => {
    if (!config) return response.status(503).json({ data: null, error: { code: "GOOGLE_ARCHIVE_NOT_CONFIGURED" } });
    try {
      const result = await syncGoogleArchive(config, pool);
      await audit(pool, request.currentUser!.id, "GOOGLE_ARCHIVE_SYNCED", "GOOGLE_ARCHIVE", null, null, result, request.ip);
      response.json({ data: result, error: null });
    } catch (error: any) {
      await audit(pool, request.currentUser!.id, "GOOGLE_ARCHIVE_FAILED", "GOOGLE_ARCHIVE", null, null, { message: error?.message || "UNKNOWN" }, request.ip).catch(() => undefined);
      if (error?.message === "GOOGLE_ARCHIVE_NOT_CONFIGURED") return response.status(503).json({ data: null, error: { code: error.message } });
      next(error);
    }
  });
  return router;
}
