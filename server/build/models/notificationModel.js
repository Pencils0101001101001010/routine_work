import pool from "../db/db.js";
export async function logNotification(userId, matchId, title, company, result, sourceUrl, externalJobId) {
    try {
        await pool.query("INSERT INTO NOTIFICATION_LOG (user_id, job_match_id, job_title, company, status, source_url, sent_at, external_job_id) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)", [userId, matchId, title, company, result, sourceUrl, externalJobId]);
        // console.log("=========All notifications sent=============");
    }
    catch (error) {
        console.error(error.message);
    }
}
//# sourceMappingURL=notificationModel.js.map