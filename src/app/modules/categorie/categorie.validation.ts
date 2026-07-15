import { z } from "zod";

const createCategoryValidationSchema = z.object({
    body: z.object({
        name: z.string({
            error: (issue) => issue.input === undefined ? "Category name is required" : "Invalid category name"
        }).min(2, "Category name must be at least 2 characters long"),
        slug: z.string({
            error: (issue) => issue.input === undefined ? "Slug is required" : "Invalid slug format"
        }).min(2, "Slug must be at least 2 characters long"),
        description: z.string().optional(),
        image_url: z.url({ message: "Invalid image URL" }).or(z.string().length(0)).optional()
    })
});

const updateCategoryValidationSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Category name must be at least 2 characters long").optional(),
        slug: z.string().min(2, "Slug must be at least 2 characters long").optional(),
        description: z.string().optional(),
        image_url: z.url({ message: "Invalid image URL" }).or(z.string().length(0)).optional()
    })
});

export const categoryValidations = {
    createCategoryValidationSchema,
    updateCategoryValidationSchema
};
