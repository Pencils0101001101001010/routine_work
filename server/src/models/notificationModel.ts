import pool from "../db/db.js";
import type { NotificationLog } from "../types/index.js";

export async function logNotification(
  userId: string,
  matchId: string,
  title: string,
  company: string | null,
  result: string,
  sourceUrl: string,
  externalJobId: string,
) {
  try {
    await pool.query<NotificationLog>(
      "INSERT INTO NOTIFICATION_LOG (user_id, job_match_id, job_title, company, status, source_url, sent_at, external_job_id) VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7)",
      [userId, matchId, title, company, result, sourceUrl, externalJobId],
    );
    console.log("=========All notifications sent=============");
  } catch (error: any) {
    console.error(error.message);
  }
}
