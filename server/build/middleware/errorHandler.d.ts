import type { ErrorRequestHandler } from "express";
export declare class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode?: number);
}
export declare const errorHandler: ErrorRequestHandler;
//# sourceMappingURL=errorHandler.d.ts.map