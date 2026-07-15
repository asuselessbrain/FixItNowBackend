import { Prisma } from "../../../prisma/generated/prisma/client";
import { TErrorSources, TGenericErrorResponse } from "./error.interface";

export const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError): TGenericErrorResponse => {
    let statusCode = 400;
    let message = "Database Error";
    let errorSources: TErrorSources = [];

    if (err.code === "P2002") {
        statusCode = 409;
        const target = (err.meta?.target as string[]) || [];
        message = "Unique constraint violation";
        errorSources = target.map((field) => ({
            path: field,
            message: `This ${field} is already in use`
        }));
        if (errorSources.length === 0) {
            errorSources = [{
                path: "",
                message: "A duplicate record was found"
            }];
        }
    } else if (err.code === "P2003") {
        statusCode = 400;
        message = "Invalid reference error";
        errorSources = [{
            path: "",
            message: "The related record is not found or referenced incorrectly"
        }];
    } else if (err.code === "P2025") {
        statusCode = 404;
        message = "Record not found";
        errorSources = [{
            path: "",
            message: "The requested record was not found or has been deleted"
        }];
    } else {
        errorSources = [{
            path: "",
            message: err.message || "Database request failed"
        }];
    }

    return {
        statusCode,
        message,
        errorSources
    };
};
