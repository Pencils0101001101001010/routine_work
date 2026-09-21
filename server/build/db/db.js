import "../config/loadEnv.js";
import net from "net";
net.setDefaultAutoSelectFamilyAttemptTimeout(1000);
import { Pool } from "pg";
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
pool.on("error", (err) => {
    return console.error("Something went wrong with DB connection", err);
});
export default pool;
//# sourceMappingURL=db.js.map