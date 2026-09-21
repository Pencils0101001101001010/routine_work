import pool from "../db/db.js";
export async function logNotification(userId, matchId, result) {
    try {
        await pool.query("INSERT INTO NOTIFICATION_LOG (user_id, job_match_id, status, sent_at) VALUES ($1, $2, $3, NOW())", [userId, matchId, result]);
    }
    catch (error) {
        console.error(error.message);
    }
}
//# sourceMappingURL=notificationModel.js.map