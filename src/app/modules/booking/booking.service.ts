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

export const bookingService = {
    createBooking
}