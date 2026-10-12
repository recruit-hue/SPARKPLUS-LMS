import pg from "pg";

const { Pool } = pg;

export function createPool(databaseUrl: string) {
  return new Pool({
    connectionString: databaseUrl,
    // Neon may need several seconds to resume after an idle period. Vercel
    // functions also scale horizontally, so keep each instance's pool small
    // and allow enough time for the first connection to become available.
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 15_000,
  });
}

export type DatabasePool = ReturnType<typeof createPool>;
