import "../config/loadEnv.js";
import net from "net";
net.setDefaultAutoSelectFamilyAttemptTimeout(1000);
import pg from "pg";
import { Pool } from "pg";
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
pool.on("error", (err) => {
    return console.error("Something went wrong with DB connection", err);
});
export async function transaction(work) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const result = await work(client);
        await client.query("COMMIT");
        return result;
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
}
export default pool;
//# sourceMappingURL=db.js.map