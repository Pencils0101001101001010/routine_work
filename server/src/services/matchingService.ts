import pool from "../db/db.js";
import type {
  AdzunaJob,
  JobMatch,
  PreferenceNotMatched,
} from "../types/index.js";

export async function findNewMatches(
  preferenceId: string,
  jobs: AdzunaJob[],
): Promise<JobMatch[]> {
  const newMatches: JobMatch[] = [];

  for (const job of jobs) {
    const existing = await pool.query(
      `SELECT id FROM job_matches WHERE preference_id = $1 AND external_job_id = $2`,
      [preferenceId, job.id],
    );
    if (existing.rows.length > 0) continue; // already seen, skip

    const inserted = await pool.query<JobMatch>(
      `INSERT INTO job_matches (preference_id, external_job_id, title, company, source_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, preference_id AS "preferenceId", external_job_id AS "externalJobId",
          title, company, source_url AS "sourceUrl"`,
      [
        preferenceId,
        job.id,
        job.title,
        job.company.display_name,
        job.redirect_url,
      ],
    );
    const insertedRow = inserted.rows[0];
    if (!insertedRow) {
      throw new Error(
        `Insert failed for job ${job.id} on preference ${preferenceId}`,
      );
    }
    newMatches.push(insertedRow);
  }

  return newMatches;
}

export async function noMatchesFound(
  preferenceId: string,
  jobs: AdzunaJob[],
  newMatches: JobMatch[],
): Promise<PreferenceNotMatched[]> {
  if (jobs.length > 0 || newMatches.length > 0) return [];

  try {
    if (newMatches.length > 0) {
      await pool.query(
        `DELETE FROM preference_not_matched WHERE preference_id = $1`,
        [preferenceId],
      );
    }
    await pool.query(
      `INSERT INTO preference_not_matched (preference_id, user_id, job_title, location)
       SELECT id, user_id, job_title, location
       FROM job_preferences
       WHERE id = $1`,
      [preferenceId],
    );

    const { rows } = await pool.query<PreferenceNotMatched>(
      `SELECT * FROM preference_not_matched WHERE preference_id = $1`,
      [preferenceId],
    );
    return rows;
  } catch (error) {
    throw new Error(
      `Insert into preference_not_matched failed for preference ${preferenceId}`,
      { cause: error },
    );
  }
}
