export declare class HttpError extends Error {
    status: number;
    code: string;
    details?: Record<string, unknown> | undefined;
    constructor(status: number, message: string, code?: string, details?: Record<string, unknown> | undefined);
}
//# sourceMappingURL=errors.d.ts.map