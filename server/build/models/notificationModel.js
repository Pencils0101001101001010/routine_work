import pool from "../db/db.js";
export async function logNotification(userId, matchId, title, company, result) {
    try {
        await pool.query("INSERT INTO NOTIFICATION_LOG (user_id, job_match_id, job_title, company, status, sent_at) VALUES ($1, $2, $3, $4, $5, NOW())", [userId, matchId, title, company, result]);
    }
    catch (error) {
        console.error(error.message);
    }
}
//# sourceMappingURL=notificationModel.js.map