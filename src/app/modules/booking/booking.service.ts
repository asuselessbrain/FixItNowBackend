import { prisma } from "../../../../lib/prisma"
import { SlotStatus } from "../../../../prisma/generated/prisma/enums";
import { AppError } from "../../../middlewares/appError";
import { IBooking } from "./booking.interface";

const createBooking = async (email: string, payload: Omit<IBooking, 'id' | 'customerId' | 'createdAt' | 'updatedAt' | 'technicianId'>) => {

    const isUserExist = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!isUserExist) {
        throw new AppError(404, "User not found");
    }

    const isSlotAvailable = await prisma.technicianSlots.findUnique({
        where: {
            id: payload.slotId
        }
    })

    if (!isSlotAvailable) {
        throw new AppError(404, "Slot not found");
    }

    if (isSlotAvailable.status === SlotStatus.BOOKED) {
        throw new AppError(400, "Slot is already booked");
    }

    const isServiceExist = await prisma.service.findUnique({
        where: {
            id: payload.serviceId
        },
        include: {
            category: true,
            technician: {
                include: {
                    user: true
                }
            }
        }
    })


    if (!isServiceExist) {
        throw new AppError(404, "Service not found");
    }

    const technicianId = isServiceExist.technician.id;

    const result = await prisma.$transaction(async (tx) => {
        const booking = await tx.bookings.create({
            data: {
                customerId: isUserExist.id,
                technicianId: technicianId,
                ...payload
            }
        })

        await tx.technicianSlots.update({
            where: {
                id: payload.slotId
            },
            data: {
                status: SlotStatus.BOOKED
            }
        })
        return booking;
    })

    return result
}

const acceptBooking = async (bookingId: string) => {
    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId
        }
    })

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    if (booking.status === "CONFIRMED") {
        throw new AppError(400, "Booking is already confirmed");
    }

    if (booking.status === "CANCELLED") {
        throw new AppError(400, "Booking is cancelled");
    }

    const result = await prisma.bookings.update({
        where: {
            id: bookingId
        },
        data: {
            status: "CONFIRMED"
        }
    })
    return result;
}

const confirmBooking = async (bookingId: string) => {
    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId
        }
    })

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    if (booking.status === "CONFIRMED") {
        throw new AppError(400, "Booking is already confirmed");
    }

    if (booking.status === "CANCELLED") {
        throw new AppError(400, "Booking is cancelled");
    }

    const result = await prisma.bookings.update({
        where: {
            id: bookingId
        },
        data: {
            status: "CONFIRMED"
        }
    })
    return result;
}

export const bookingService = {
    createBooking,
    confirmBooking,
    acceptBooking
}