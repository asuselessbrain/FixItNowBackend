import { prisma } from "../../../../lib/prisma";
import { AppError } from "../../../middlewares/appError";
import { BookingStatus } from "../../../../prisma/generated/prisma/enums";

const createReview = async (
    email: string,
    payload: { bookingId: string; rating: number; comment?: string }
) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
            status: "active"
        }
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const booking = await prisma.bookings.findUnique({
        where: {
            id: payload.bookingId
        },
        include: {
            review: true
        }
    });

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    if (booking.customerId !== user.id) {
        throw new AppError(403, "You are not authorized to review this booking");
    }

    if (booking.status !== BookingStatus.COMPLETED) {
        throw new AppError(400, "You can only leave a review for completed bookings");
    }

    if (booking.review) {
        throw new AppError(400, "You have already reviewed this booking");
    }

    if (payload.rating < 1 || payload.rating > 5) {
        throw new AppError(400, "Rating must be between 1 and 5");
    }

    const result = await prisma.$transaction(async (tx) => {
        // 1. Create the review
        const review = await tx.review.create({
            data: {
                customerId: user.id,
                serviceId: booking.serviceId,
                technicianId: booking.technicianId,
                bookingId: booking.id,
                rating: payload.rating,
                comment: payload.comment
            }
        });

        // 2. Recalculate average rating for the service
        const serviceAvg = await tx.review.aggregate({
            where: {
                serviceId: booking.serviceId
            },
            _avg: {
                rating: true
            }
        });

        const newServiceRating = serviceAvg._avg.rating || 0.0;

        await tx.service.update({
            where: {
                id: booking.serviceId
            },
            data: {
                rating: newServiceRating
            }
        });

        // 3. Recalculate average rating for the technician
        const technicianAvg = await tx.review.aggregate({
            where: {
                technicianId: booking.technicianId
            },
            _avg: {
                rating: true
            }
        });

        const newTechnicianRating = technicianAvg._avg.rating || 0.0;

        await tx.technicianProfiles.update({
            where: {
                id: booking.technicianId
            },
            data: {
                average_rating: newTechnicianRating
            }
        });

        return review;
    });

    return result;
};

export const reviewService = {
    createReview
};
