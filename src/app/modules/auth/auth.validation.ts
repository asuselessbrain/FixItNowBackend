import { z } from "zod";

const loginValidationSchema = z.object({
    body: z.object({
        email: z.email({
            error: (issue) => issue.input === undefined ? "Email is required" : "Invalid email address"
        }),
        password: z.string({
            error: (issue) => issue.input === undefined ? "Password is required" : "Invalid password format"
        }).min(6, "Password must be at least 6 characters long")
    })
});

const forgetPasswordValidationSchema = z.object({
    body: z.object({
        email: z.email({
            error: (issue) => issue.input === undefined ? "Email is required" : "Invalid email address"
        })
    })
});

const resetPasswordValidationSchema = z.object({
    body: z.object({
        token: z.string({
            error: (issue) => issue.input === undefined ? "Token is required" : "Invalid token format"
        }),
        newPassword: z.string({
            error: (issue) => issue.input === undefined ? "New password is required" : "Invalid password format"
        }).min(6, "Password must be at least 6 characters long")
    })
});

const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({
            error: (issue) => issue.input === undefined ? "Old password is required" : "Invalid password format"
        }),
        newPassword: z.string({
            error: (issue) => issue.input === undefined ? "New password is required" : "Invalid password format"
        }).min(6, "Password must be at least 6 characters long")
    })
});

const updateProfileValidationSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters long").optional(),
        phone: z.string().optional(),
        avatar: z.url({ message: "Invalid avatar URL" }).or(z.string().length(0)).optional(),
        address: z.string().optional()
    })
});

export const authValidations = {
    loginValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema,
    changePasswordValidationSchema,
    updateProfileValidationSchema
};
