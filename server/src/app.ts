import cors from "cors";
import express, { type ErrorRequestHandler } from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import type { AppConfig } from "./config.js";
import type { DatabasePool } from "./database/pool.js";
import { createAuthRouter } from "./auth/routes.js";
import { createAdminRouter } from "./routes/admin.js";
import { createLeaderRouter } from "./routes/leader.js";
import { createCoursesRouter } from "./routes/courses.js";
import { createLearningRouter } from "./routes/learning.js";
import { createAdminRewardsRouter, createRewardsRouter } from "./routes/rewards.js";
import { createAdminNoticesRouter, createNoticesRouter } from "./routes/notices.js";

interface AppOptions {
  sessionStore?: session.Store;
}

export function createApp(config: AppConfig, pool: DatabasePool, options: AppOptions = {}) {
  const app = express();
  const PgStore = connectPgSimple(session);
  const store = options.sessionStore ?? new PgStore({ pool, tableName: "user_sessions", createTableIfMissing: true });

  app.set("trust proxy", config.NODE_ENV === "production" ? 1 : 0);
  app.use(cors({ origin: config.APP_ORIGIN, credentials: true }));
  app.use(express.json({ limit: "4mb" }));
  app.use((request, response, next) => {
    if (!request.path.startsWith("/api")) return next();
    const startedAt = Date.now();
    const requestId = request.headers["x-vercel-id"] || request.headers["x-request-id"] || "local";
    response.on("finish", () => console.info(JSON.stringify({
      level: response.statusCode >= 500 ? "error" : response.statusCode >= 400 ? "warn" : "info",
      message: "api_request",
      method: request.method,
      path: request.path,
      status: response.statusCode,
      durationMs: Date.now() - startedAt,
      requestId,
    })));
    next();
  });
  app.use(session({
    name: "sparkplus.sid",
    store,
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: config.NODE_ENV === "production",
      maxAge: 8 * 60 * 60 * 1000,
    },
  }));

  app.get(["/health", "/api/health"], async (_request, response, next) => {
    try {
      await pool.query("SELECT 1");
      response.json({ data: { status: "ok" }, error: null });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/ready", async (_request, response, next) => {
    try {
      const [tables, initialAdmin] = await Promise.all([
        pool.query(`SELECT COUNT(*)::int AS count FROM information_schema.tables
          WHERE table_schema='public' AND table_name IN ('users','organizations','courses','enrollments','audit_logs')`),
        pool.query(`SELECT role,status FROM users WHERE lower(email)=lower($1) LIMIT 1`, [config.INITIAL_ADMIN_EMAIL]),
      ]);
      const checks = {
        database: true,
        criticalTables: tables.rows[0]?.count === 5,
        initialAdmin: initialAdmin.rows[0]?.role === "ADMIN" && initialAdmin.rows[0]?.status === "ACTIVE",
        googleArchiveConfigured: Boolean(config.GOOGLE_SERVICE_ACCOUNT_JSON && config.GOOGLE_SHEET_ID && config.GOOGLE_DRIVE_ROOT_FOLDER_ID),
        geminiConfigured: Boolean(config.GEMINI_API_KEY),
      };
      const ready = checks.database && checks.criticalTables && checks.initialAdmin;
      response.status(ready ? 200 : 503).json({ data: { status: ready ? "ready" : "not_ready", checks }, error: null });
    } catch (error) { next(error); }
  });

  app.use("/api/v1/auth", createAuthRouter(config, pool));
  app.use("/api/v1/admin/notices", createAdminNoticesRouter(pool));
  app.use("/api/v1/admin", createAdminRouter(pool, config));
  app.use("/api/v1/leader", createLeaderRouter(pool));
  app.use("/api/v1/courses", createCoursesRouter(pool, config));
  app.use("/api/v1/learning", createLearningRouter(pool, config));
  app.use("/api/v1/rewards", createRewardsRouter(pool));
  app.use("/api/v1/notices", createNoticesRouter(pool));
  app.use("/api/v1/admin/rewards", createAdminRewardsRouter(pool));

  app.use((_request, response) => response.status(404).json({ data: null, error: { code: "NOT_FOUND" } }));

  const errorHandler: ErrorRequestHandler = (error, request, response, _next) => {
    console.error(JSON.stringify({
      level: "error",
      message: "unhandled_api_error",
      method: request.method,
      path: request.path,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }));
    if ((error as any)?.type === "entity.too.large") {
      return response.status(413).json({ data: null, error: { code: "PAYLOAD_TOO_LARGE" } });
    }
    response.status(500).json({ data: null, error: { code: "INTERNAL_SERVER_ERROR" } });
  };
  app.use(errorHandler);

  return app;
}
