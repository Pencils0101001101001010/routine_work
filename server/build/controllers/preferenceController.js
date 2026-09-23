import pool from "../db/db.js";
const MAX_PREFERENCES = 5;
export const addPreferences = async (req, res, next) => {
    const { job_title, location, active } = req.body;
    const userId = req.userId;
    if (!job_title || !location) {
        return res.status(400).json({ error: "All fields are required." });
    }
    try {
        const countResult = await pool.query("SELECT COUNT(*) FROM job_preferences WHERE user_id = $1", [userId]);
        const currentCount = parseInt(countResult.rows[0].count, 10);
        if (currentCount >= MAX_PREFERENCES) {
            return res.status(429).json({
                error: `You've reached the maximum of ${MAX_PREFERENCES} job preferences. Delete one to add another.`,
            });
        }
        const result = await pool.query("INSERT INTO JOB_PREFERENCES (user_id, job_title, location, active) VALUES ($1, $2, $3, $4) RETURNING * ", [userId, job_title, location, active ?? true]);
        return res.status(201).json(result.rows[0]);
    }
    catch (error) {
        next(error);
    }
};
export const getPreferences = async (req, res, next) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ error: "Not authenticated." });
    }
    try {
        const result = await pool.query("SELECT * FROM JOB_PREFERENCES WHERE user_id = $1", [userId]);
        // if (result.rows.length === 0) {
        //   return res.status(204).json({ error: "No preferences set yet" });
        // }
        return res.status(200).json(result.rows);
    }
    catch (error) {
        next(error);
    }
};
export const updatePreferences = async (req, res, next) => {
    const { id } = req.params; //Preference id
    const userId = req.userId;
    const { job_title, location, active } = req.body;
    if (!userId) {
        return res.status(400).json({ error: "Not authenticated." });
    }
    try {
        const result = await pool.query("UPDATE JOB_PREFERENCES SET job_title = COALESCE($1, job_title), location = COALESCE($2, location), active = COALESCE($3, active) WHERE user_id = $4 AND id = $5 RETURNING *", [job_title, location, active, userId, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Preference not found." });
        }
        return res.status(200).json(result.rows[0]);
    }
    catch (error) {
        next(error);
    }
};
export const deletePreferences = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ error: "Not authenticated." });
    }
    try {
        const result = await pool.query("DELETE FROM JOB_PREFERENCES WHERE id = $1 AND user_id = $2 RETURNING id", [id, userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Item not found." });
        }
        return res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=preferenceController.js.map