import { ZodError } from "zod";
import { TErrorSources, TGenericErrorResponse } from "./error.interface";

export const handleZodError = (err: ZodError): TGenericErrorResponse => {
    const errorSources: TErrorSources = err.issues.map((issue) => {
        return {
            path: String(issue.path[issue.path.length - 1] ?? ""),
            message: issue.message
        };
    });

    return {
        statusCode: 400,
        message: "Validation Error",
        errorSources
    };
};
