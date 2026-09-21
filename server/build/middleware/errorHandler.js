// A small helper to throw errors with a specific status code
// from anywhere in controllers/services, instead of only ever
// getting generic 500s in the catch block.
export class AppError extends Error {
    statusCode;
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = "AppError";
    }
}
export const errorHandler = (err, req, res, next) => {
    const isDev = process.env.NODE_ENV !== "production";
    console.error(err);
    // Errors you threw on purpose, with a specific status code already attached
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    // Postgres unique constraint violation (e.g. duplicate whatsapp_number)
    const pgErr = err;
    if (pgErr.code === "23505") {
        return res.status(409).json({ error: "This record already exists." });
    }
    // Postgres foreign key violation (e.g. user_id doesn't exist)
    if (pgErr.code === "23503") {
        return res.status(400).json({ error: "Referenced record does not exist." });
    }
    // Fallback — unknown error, don't leak internals in production
    res.status(500).json({
        error: isDev ? err.message : "Something went wrong.",
    });
};
//# sourceMappingURL=errorHandler.js.map