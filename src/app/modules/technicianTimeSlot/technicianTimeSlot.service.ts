import { prisma } from "../../../../lib/prisma";
import { AppError } from "../../../middlewares/appError";


const createTechnicianTimeSlots = async (email: string, date: string, selectedSlots: string[]) => {

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


export const technicianTimeSlotService = {
    createTechnicianTimeSlots
}