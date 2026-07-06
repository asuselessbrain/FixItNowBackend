export class AppError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string, stack?: string) {
        super(message);
        this.statusCode = statusCode;
        this.stack = stack || new Error().stack;
    }
}