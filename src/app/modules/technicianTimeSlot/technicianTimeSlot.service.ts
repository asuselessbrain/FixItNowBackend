import { prisma } from "../../../../lib/prisma";
import { AppError } from "../../../middlewares/appError";


import { SlotStatus } from "../../../../prisma/generated/prisma/enums";

const createTechnicianTimeSlots = async (email: string, date: string, selectedSlots: string[]) => {
    const inputDate = new Date(date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate < currentDate) {
        throw new AppError(400, "Cannot create time slots for a past date");
    }

    const isUserExist = await prisma.user.findUnique({
        where: {
            email,
            status: "active",
            role: "technician"
        },
        omit: {
            "password": true,
            "createdAt": true,
            "updatedAt": true,
            "status": true,
            "role": true
        }
    })

    if (!isUserExist) {
        throw new AppError(404, "Technician not found");
    }

    const isTechnicianExist = await prisma.technicianProfiles.findFirst({
        where: {
            userId: isUserExist.id
        }
    })

    if (!isTechnicianExist) {
        throw new AppError(404, "Technician profile not found");
    }

    const slotData = selectedSlots.map(slot => ({
        slotTime: slot,
        date,
        technicianId: isTechnicianExist.id
    }))

    const result = await prisma.technicianSlots.createMany({
        data: slotData,
        skipDuplicates: true
    })

    return result;
}

const updateTechnicianTimeSlots = async (email: string, date: string, selectedSlots: string[]) => {
    const inputDate = new Date(date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate < currentDate) {
        throw new AppError(400, "Cannot update time slots for a past date");
    }

    const isUserExist = await prisma.user.findUnique({
        where: {
            email,
            status: "active",
            role: "technician"
        }
    });

    if (!isUserExist) {
        throw new AppError(404, "Technician not found");
    }

    const isTechnicianExist = await prisma.technicianProfiles.findUnique({
        where: {
            userId: isUserExist.id
        }
    });

    if (!isTechnicianExist) {
        throw new AppError(404, "Technician profile not found");
    }

    const technicianId = isTechnicianExist.id;

    // Get existing slots for the given date
    const existingSlots = await prisma.technicianSlots.findMany({
        where: {
            technicianId,
            date
        }
    });

    const existingSlotTimes = existingSlots.map(slot => slot.slotTime);

    // Identify slots to delete (slots present in database but not in selectedSlots)
    const slotsToDelete = existingSlots.filter(slot => !selectedSlots.includes(slot.slotTime));

    // Safety check: verify that no booked slots are being deleted
    const bookedSlotsToDelete = slotsToDelete.filter(slot => slot.status === SlotStatus.BOOKED);
    if (bookedSlotsToDelete.length > 0) {
        const bookedSlotTimes = bookedSlotsToDelete.map(slot => slot.slotTime).join(", ");
        throw new AppError(400, `Cannot delete slots that have active bookings: ${bookedSlotTimes}`);
    }

    // Identify slots to create (slots in selectedSlots but not in database)
    const slotsToCreate = selectedSlots.filter(slot => !existingSlotTimes.includes(slot));

    const result = await prisma.$transaction(async (tx) => {
        // Delete the removed slots
        if (slotsToDelete.length > 0) {
            await tx.technicianSlots.deleteMany({
                where: {
                    technicianId,
                    date,
                    slotTime: {
                        in: slotsToDelete.map(slot => slot.slotTime)
                    }
                }
            });
        }

        // Create the newly added slots
        if (slotsToCreate.length > 0) {
            const slotData = slotsToCreate.map(slot => ({
                slotTime: slot,
                date,
                technicianId
            }));

            await tx.technicianSlots.createMany({
                data: slotData
            });
        }

        // Return updated list of slots for that date
        const updatedSlots = await tx.technicianSlots.findMany({
            where: {
                technicianId,
                date
            },
            orderBy: {
                slotTime: "asc"
            }
        });

        return updatedSlots;
    });

    return result;
}

export const technicianTimeSlotService = {
    createTechnicianTimeSlots,
    updateTechnicianTimeSlots
}