import { z } from "zod";

const createServiceValidationSchema = z.object({
    body: z.object({
        name: z.string({
            error: (issue) => issue.input === undefined ? "Service name is required" : "Invalid name format"
        }).min(2, "Service name must be at least 2 characters long"),
        price: z.number({
            error: (issue) => issue.input === undefined ? "Price is required" : "Invalid price format"
        }).positive("Price must be a positive number"),
        location: z.string({
            error: (issue) => issue.input === undefined ? "Location is required" : "Invalid location format"
        }),
        categoryId: z.uuid({
            error: (issue) => issue.input === undefined ? "Category ID is required" : "Invalid Category ID format"
        }),
        description: z.string().optional(),
        image_url: z.url({ message: "Invalid image URL" }).or(z.string().length(0)).optional()
    })
});

const updateServiceValidationSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Service name must be at least 2 characters long").optional(),
        price: z.number().positive("Price must be a positive number").optional(),
        location: z.string().optional(),
        categoryId: z.uuid().optional(),
        description: z.string().optional(),
        image_url: z.url({ message: "Invalid image URL" }).or(z.string().length(0)).optional()
    })
});

export const serviceValidations = {
    createServiceValidationSchema,
    updateServiceValidationSchema
};
