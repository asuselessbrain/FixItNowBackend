import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { Prisma } from "../../prisma/generated/prisma/client";
import { config } from "../../config";
import { TErrorSources } from "../app/errors/error.interface";
import { handleZodError } from "../app/errors/handleZodError";
import { handlePrismaError } from "../app/errors/handlePrismaError";
import { AppError } from "./appError";

export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let statusCode = 500;
    let message = "Something went wrong!";
    let errorSources: TErrorSources = [
        {
            path: "",
            message: err.message || "Internal Server Error",
        },
    ];

    if (err instanceof ZodError) {
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const simplifiedError = handlePrismaError(err);
        statusCode = simplifiedError.statusCode;
        message = simplifiedError.message;
        errorSources = simplifiedError.errorSources;
    } else if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errorSources = [
            {
                path: "",
                message: err.message,
            },
        ];
    } else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Access token expired";
        errorSources = [
            {
                path: "",
                message: "Please log in again. Your session has expired.",
            },
        ];
    } else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
        errorSources = [
            {
                path: "",
                message: "Unauthorized access token.",
            },
        ];
    } else if (err instanceof Error) {
        message = err.message;
        errorSources = [
            {
                path: "",
                message: err.message,
            },
        ];
    }

    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        stack: config.node_env === "development" ? err?.stack : undefined,
    });
};