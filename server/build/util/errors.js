export class HttpError extends Error {
    status;
    code;
    details;
    constructor(status, message, code = "REQUEST_FAILED", details) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details;
    }
}
//# sourceMappingURL=errors.js.map