import { z } from "zod";

const createOrUpdateTimeSlotValidationSchema = z.object({
    body: z.object({
        date: z.string({
            error: (issue) => issue.input === undefined ? "Date is required" : "Invalid date format"
        }).refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid date format"
        }),
        selectedSlots: z.array(z.string(), {
            error: (issue) => issue.input === undefined ? "Selected slots array is required" : "Invalid selected slots format"
        }).min(1, "At least one time slot must be selected")
    })
});

export const technicianTimeSlotValidations = {
    createOrUpdateTimeSlotValidationSchema
};
