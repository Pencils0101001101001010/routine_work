import "../config/loadEnv.js";
import pg from "pg";
import { Pool } from "pg";
declare const pool: Pool;
export declare function transaction<T>(work: (client: pg.PoolClient) => Promise<T>): Promise<T>;
export default pool;
//# sourceMappingURL=db.d.ts.map