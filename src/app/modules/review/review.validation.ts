import { z } from "zod";

const createReviewValidationSchema = z.object({
    body: z.object({
        bookingId: z.uuid({
            error: (issue) => issue.input === undefined ? "Booking ID is required" : "Invalid Booking ID format"
        }),
        rating: z.number({
            error: (issue) => issue.input === undefined ? "Rating is required" : "Invalid rating format"
        }).min(1, "Rating must be at least 1").max(5, "Rating cannot be more than 5"),
        comment: z.string().optional()
    })
});

export const reviewValidations = {
    createReviewValidationSchema
};
