//Logic to compare the new returning jobs data from adzuna and then comparing it with the existing data in our db
import pool from "../db/db.js";
export async function findNewMatches(preferenceId, jobs) {
    const newMatches = [];
    for (const job of jobs) {
        const existing = await pool.query(`SELECT id FROM job_matches WHERE preference_id = $1 AND external_job_id = $2`, [preferenceId, job.id]);
        if (existing.rows.length > 0)
            continue; // already seen, skip
        const inserted = await pool.query(`INSERT INTO job_matches (preference_id, external_job_id, title, company, source_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, preference_id AS "preferenceId", external_job_id AS "externalJobId",
          title, company, source_url AS "sourceUrl"`, [
            preferenceId,
            job.id,
            job.title,
            job.company.display_name,
            job.redirect_url,
        ]);
        const insertedRow = inserted.rows[0];
        if (!insertedRow) {
            throw new Error(`Insert failed for job ${job.id} on preference ${preferenceId}`);
        }
        newMatches.push(insertedRow);
    }
    return newMatches;
}
//# sourceMappingURL=matchingService.js.map