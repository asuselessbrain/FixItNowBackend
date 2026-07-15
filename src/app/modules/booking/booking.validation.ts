import { z } from "zod";

const createBookingValidationSchema = z.object({
    body: z.object({
        serviceId: z.uuid({
            error: (issue) => issue.input === undefined ? "Service ID is required" : "Invalid Service ID format"
        }),
        slotId: z.uuid({
            error: (issue) => issue.input === undefined ? "Slot ID is required" : "Invalid Slot ID format"
        })
    })
});

export const bookingValidations = {
    createBookingValidationSchema
};
