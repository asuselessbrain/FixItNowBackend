import { z } from "zod";

const createPaymentValidationSchema = z.object({
    body: z.object({
        bookingId: z.uuid({
            error: (issue) => issue.input === undefined ? "Booking ID is required" : "Invalid Booking ID format"
        })
    })
});

export const paymentValidations = {
    createPaymentValidationSchema
};
