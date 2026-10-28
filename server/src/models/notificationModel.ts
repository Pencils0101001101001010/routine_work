import pool from "../db/db.js";
import type { NotificationLog } from "../types/index.js";

export async function logNotification(
  trackingId: string,
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
      "INSERT INTO notification_log (id, user_id, job_match_id, job_title, company, status, source_url, sent_at, external_job_id) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), $8)",
      [
        trackingId,
        userId,
        matchId,
        title,
        company,
        result,
        sourceUrl,
        externalJobId,
      ],
    );
  } catch (error: any) {
    console.error(error.message);
  }
}
