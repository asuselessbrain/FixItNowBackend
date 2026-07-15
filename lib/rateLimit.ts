import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";

const limitHandler = (req: Request, res: Response, next: NextFunction, options: any) => {
    res.status(options.statusCode).json({
        success: false,
        message: options.message,
        errorSources: [
            {
                path: "",
                message: options.message,
            },
        ],
    });
};
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: "Too many requests from this IP, please try again after 15 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: limitHandler,
});
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Too many login/reset attempts, please try again after 15 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
    handler: limitHandler,
});
export { globalLimiter, authLimiter };