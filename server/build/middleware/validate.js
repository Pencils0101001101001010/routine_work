import { HttpError } from "../util/errors.js";
export function validate(schema) {
    return (req, _res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success)
            return next(new HttpError(400, "Check the submitted fields.", "VALIDATION_ERROR", {
                fields: result.error.flatten().fieldErrors,
            }));
        req.validated = result.data;
        next();
    };
}
//# sourceMappingURL=validate.js.map