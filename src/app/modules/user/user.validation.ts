import { z } from "zod";

const createUserValidationSchema = z.object({
    body: z.object({
        email: z.email({
            error: (issue) => issue.input === undefined ? "Email is required" : "Invalid email address"
        }),
        name: z.string({
            error: (issue) => issue.input === undefined ? "Name is required" : "Invalid name format"
        }).min(2, "Name must be at least 2 characters long"),
        password: z.string({
            error: (issue) => issue.input === undefined ? "Password is required" : "Invalid password format"
        }).min(6, "Password must be at least 6 characters long"),
        phone: z.string({
            error: (issue) => issue.input === undefined ? "Phone number is required" : "Invalid phone format"
        }),
        role: z.enum(["customer", "technician", "admin"]).optional(),
        status: z.enum(["active", "banned"]).optional(),
        avatar: z.url({ message: "Invalid avatar URL" }).or(z.string().length(0)).optional(),
        address: z.string().optional()
    })
});

const updateUserStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum(["active", "banned"], {
            error: (issue) => issue.input === undefined ? "Status is required" : "Invalid status option"
        })
    })
});

export const userValidations = {
    createUserValidationSchema,
    updateUserStatusValidationSchema
};
