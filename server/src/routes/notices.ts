import { Router } from "express";
import { z } from "zod";
import { requireRole, requireUser } from "../auth/middleware.js";
import { ensureNoticesSchema } from "../database/notices-schema.js";
import type { DatabasePool } from "../database/pool.js";

const allowedNoticeTags = new Set(["p","div","br","strong","b","u","a","font","ul","ol","li"]);
function sanitizeNoticeContent(input: string) {
  const source = input.replace(/\0/g, "").trim();
  if (!/<[a-z!/][\s\S]*>/i.test(source)) return source;
  const withoutActiveContent = source
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\s*(script|style|iframe|object|embed|form|svg|math)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "");
  return withoutActiveContent.replace(/<[^>]*>/g, (raw) => {
    const match = raw.match(/^<\s*(\/?)\s*([a-z0-9]+)([^>]*)>$/i);
    if (!match) return "";
    const closing = Boolean(match[1]);
    const tag = (match[2] || "").toLowerCase();
    const attrs = match[3] || "";
    if (!allowedNoticeTags.has(tag)) return "";
    if (closing) return tag === "br" ? "" : `</${tag}>`;
    if (tag === "br") return "<br>";
    if (tag === "a") {
      const hrefMatch = attrs.match(/href\s*=\s*(["'])(.*?)\1/i);
      const href = hrefMatch?.[2];
      if (!href) return "<a>";
      try {
        const url = new URL(href);
        if (!["http:","https:"].includes(url.protocol)) return "<a>";
        const safeHref = url.toString().replace(/&/g,"&amp;").replace(/"/g,"&quot;");
        return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">`;
      } catch { return "<a>"; }
    }
    if (tag === "font") {
      const color = attrs.match(/color\s*=\s*(["'])(#[0-9a-f]{6})\1/i)?.[2];
      const size = attrs.match(/size\s*=\s*(["']?)([1-7])\1/i)?.[2];
      return `<font${color ? ` color="${color}"` : ""}${size ? ` size="${size}"` : ""}>`;
    }
    return `<${tag}>`;
  });
}

const noticeInput = z.object({
  category: z.string().trim().min(1).max(80).default("일반 공지"),
  title: z.string().trim().min(1).max(240),
  targetType: z.enum(["전체 임직원", "부서 선택", "교육과정 수강자"]).default("전체 임직원"),
  targetDetails: z.array(z.string().trim().min(1).max(240)).max(100).default([]),
  start: z.iso.date(),
  end: z.iso.date().nullable().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ENDED"]).default("PUBLISHED"),
  important: z.boolean().default(false),
  content: z.string().trim().min(1).max(100000).transform(sanitizeNoticeContent),
  file: z.string().trim().max(300).nullable().optional(),
});
const noticePatch = noticeInput.partial().refine((value) => Object.keys(value).length > 0);
const selectNotice = `SELECT id,category,title,target_type AS "targetType",target_details AS "targetDetails",
  to_char(start_date,'YYYY-MM-DD') AS start,to_char(end_date,'YYYY-MM-DD') AS "end",status,important,content,
  attachment_name AS file,views,created_at AS "createdAt",updated_at AS "updatedAt" FROM notices`;

function output(row: any) {
  return {
    ...row,
    target: row.targetType === "전체 임직원" ? "전체 임직원" : (row.targetDetails || []).join(", "),
    departments: row.targetType === "부서 선택" ? row.targetDetails || [] : [],
    course: row.targetType === "교육과정 수강자" ? row.targetDetails?.[0] || "" : "",
    noEnd: !row.end,
    status: row.status === "PUBLISHED" ? "게시 중" : row.status === "ENDED" ? "종료" : "임시저장",
    date: row.start?.replaceAll("-", "."),
    writer: "LMS 관리자",
  };
}

async function audit(pool: DatabasePool, actor: string, action: string, id: string, before: unknown, after: unknown, ip?: string) {
  await pool.query(`INSERT INTO audit_logs(actor_user_id,action,target_type,target_id,before_data,after_data,ip_address)
    VALUES($1,$2,'NOTICE',$3,$4,$5,$6)`, [actor, action, id, before ? JSON.stringify(before) : null, after ? JSON.stringify(after) : null, ip || null]);
}

export function createNoticesRouter(pool: DatabasePool) {
  const router = Router();
  router.use(requireUser(pool));
  router.get("/", async (request, response, next) => {
    try {
      await ensureNoticesSchema(pool);
      const result = await pool.query(`${selectNotice} WHERE deleted_at IS NULL AND status='PUBLISHED'
        AND start_date<=CURRENT_DATE AND (end_date IS NULL OR end_date>=CURRENT_DATE)
        AND (target_type='전체 임직원'
          OR (target_type='부서 선택' AND target_details ? COALESCE((SELECT o.name FROM users u LEFT JOIN organizations o ON o.id=u.organization_id WHERE u.id=$1),''))
          OR (target_type='교육과정 수강자' AND EXISTS(SELECT 1 FROM enrollments e JOIN courses c ON c.id=e.course_id WHERE e.user_id=$1 AND e.status<>'CANCELLED' AND target_details ? c.title)))
        ORDER BY important DESC,start_date DESC,created_at DESC`, [request.currentUser!.id]);
      response.json({ data: result.rows.map(output), error: null });
    } catch (error) { next(error); }
  });
  router.post("/:id/view", async (request, response, next) => {
    try {
      await ensureNoticesSchema(pool);
      const result = await pool.query(`UPDATE notices SET views=views+1,updated_at=now()
        WHERE id=$1 AND deleted_at IS NULL AND status='PUBLISHED' AND start_date<=CURRENT_DATE
          AND (end_date IS NULL OR end_date>=CURRENT_DATE)
          AND (target_type='전체 임직원'
            OR (target_type='부서 선택' AND target_details ? COALESCE((SELECT o.name FROM users u LEFT JOIN organizations o ON o.id=u.organization_id WHERE u.id=$2),''))
            OR (target_type='교육과정 수강자' AND EXISTS(SELECT 1 FROM enrollments e JOIN courses c ON c.id=e.course_id WHERE e.user_id=$2 AND e.status<>'CANCELLED' AND target_details ? c.title)))
        RETURNING views`, [request.params.id, request.currentUser!.id]);
      if (!result.rowCount) return response.status(404).json({ data: null, error: { code: "NOTICE_NOT_FOUND" } });
      response.json({ data: { views: result.rows[0].views }, error: null });
    } catch (error) { next(error); }
  });
  return router;
}

export function createAdminNoticesRouter(pool: DatabasePool) {
  const router = Router();
  router.use(requireUser(pool), requireRole("ADMIN"));
  router.get("/", async (_request, response, next) => {
    try {
      await ensureNoticesSchema(pool);
      const result = await pool.query(`${selectNotice} WHERE deleted_at IS NULL ORDER BY important DESC,created_at DESC`);
      response.json({ data: result.rows.map(output), error: null });
    } catch (error) { next(error); }
  });
  router.post("/", async (request, response, next) => {
    const parsed = noticeInput.safeParse(request.body);
    if (!parsed.success) return response.status(400).json({ data: null, error: { code: "VALIDATION_ERROR", details: parsed.error.issues } });
    try {
      await ensureNoticesSchema(pool);
      const value = parsed.data;
      const result = await pool.query(`INSERT INTO notices(category,title,target_type,target_details,start_date,end_date,status,important,content,attachment_name,created_by)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING id`, [value.category,value.title,value.targetType,JSON.stringify(value.targetDetails),value.start,value.end || null,value.status,value.important,value.content,value.file || null,request.currentUser!.id]);
      const saved = await pool.query(`${selectNotice} WHERE id=$1`, [result.rows[0].id]);
      await audit(pool,request.currentUser!.id,"NOTICE_CREATED",result.rows[0].id,null,saved.rows[0],request.ip);
      response.status(201).json({ data: output(saved.rows[0]), error: null });
    } catch (error) { next(error); }
  });
  router.patch("/:id", async (request, response, next) => {
    const parsed = noticePatch.safeParse(request.body);
    if (!parsed.success) return response.status(400).json({ data: null, error: { code: "VALIDATION_ERROR", details: parsed.error.issues } });
    try {
      await ensureNoticesSchema(pool);
      const before = await pool.query(`${selectNotice} WHERE id=$1 AND deleted_at IS NULL`, [request.params.id]);
      if (!before.rowCount) return response.status(404).json({ data: null, error: { code: "NOTICE_NOT_FOUND" } });
      const value = parsed.data;
      await pool.query(`UPDATE notices SET category=COALESCE($2,category),title=COALESCE($3,title),target_type=COALESCE($4,target_type),
        target_details=COALESCE($5::jsonb,target_details),start_date=COALESCE($6::date,start_date),
        end_date=CASE WHEN $7::boolean THEN $8::date ELSE end_date END,status=COALESCE($9,status),important=COALESCE($10,important),
        content=COALESCE($11,content),attachment_name=CASE WHEN $12::boolean THEN $13 ELSE attachment_name END,updated_at=now() WHERE id=$1`,
        [request.params.id,value.category || null,value.title || null,value.targetType || null,value.targetDetails ? JSON.stringify(value.targetDetails) : null,value.start || null,"end" in value,value.end || null,value.status || null,value.important ?? null,value.content || null,"file" in value,value.file || null]);
      const saved = await pool.query(`${selectNotice} WHERE id=$1`, [request.params.id]);
      await audit(pool,request.currentUser!.id,"NOTICE_UPDATED",request.params.id,before.rows[0],saved.rows[0],request.ip);
      response.json({ data: output(saved.rows[0]), error: null });
    } catch (error) { next(error); }
  });
  router.delete("/:id", async (request, response, next) => {
    try {
      await ensureNoticesSchema(pool);
      const result = await pool.query(`UPDATE notices SET deleted_at=now(),updated_at=now() WHERE id=$1 AND deleted_at IS NULL RETURNING id,title`, [request.params.id]);
      if (!result.rowCount) return response.status(404).json({ data: null, error: { code: "NOTICE_NOT_FOUND" } });
      await audit(pool,request.currentUser!.id,"NOTICE_DELETED",request.params.id,result.rows[0],null,request.ip);
      response.status(204).end();
    } catch (error) { next(error); }
  });
  return router;
}
