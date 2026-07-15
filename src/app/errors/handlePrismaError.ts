import { Prisma } from "../../../prisma/generated/prisma/client";
import { TErrorSources, TGenericErrorResponse } from "./error.interface";

export const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError): TGenericErrorResponse => {
    let statusCode = 400;
    let message = "Database Error";
    let errorSources: TErrorSources = [];

    if (err.code === "P2002") {
        statusCode = 409;
        let fields: string[] = [];

        if (err.meta && err.meta.target) {
            if (Array.isArray(err.meta.target)) {
                fields = err.meta.target;
            } else if (typeof err.meta.target === "string") {
                const parts = err.meta.target.split("_");
                if (parts.length > 2) {
                    fields = [parts[parts.length - 2]];
                } else {
                    fields = [err.meta.target];
                }
            }
        }

        if (fields.length === 0 && err.meta?.driverAdapterError) {
            const adapterFields = (err.meta.driverAdapterError as any)?.cause?.constraint?.fields;
            if (Array.isArray(adapterFields)) {
                fields = adapterFields.map(f => typeof f === "string" ? f.replace(/['"`\\]/g, "") : String(f));
            }
        }

        if (fields.length === 0 && err.message) {
            const match = err.message.match(/Unique constraint failed on the fields: \((.+?)\)/);
            if (match) {
                fields = match[1].split(",").map(f => f.trim().replace(/['"`\\]/g, ""));
            }
        }

        message = "Unique constraint violation";

        if (fields.length > 0) {
            errorSources = fields.map((field) => ({
                path: field,
                message: `This ${field} is already in use`
            }));
            message = `${fields.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(", ")} is already registered. Please use a different value.`;
        } else {
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
