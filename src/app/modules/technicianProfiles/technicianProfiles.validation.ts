import { z } from "zod";

const updateTechnicianProfileValidationSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Name must be at least 2 characters long").optional(),
        phone: z.string().optional(),
        avatar: z.url({ message: "Invalid avatar URL" }).or(z.string().length(0)).optional(),
        address: z.string().optional(),
        technicianProfiles: z.object({
            bio: z.string().optional(),
            experience_year: z.number().int().nonnegative("Experience years must be non-negative").optional(),
            location: z.string().optional(),
            skills: z.string().optional(),
            isAvailable: z.boolean().optional()
        }).optional()
    })
});

export const technicianProfileValidations = {
    updateTechnicianProfileValidationSchema
};
