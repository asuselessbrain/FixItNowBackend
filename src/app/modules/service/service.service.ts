import { prisma } from "../../../../lib/prisma"
import { AppError } from "../../../middlewares/appError"
import { IService } from "./service.interface"

const createService = async (technicianEmail: string, payload: Omit<IService, 'id' | 'createdAt' | 'updatedAt' | 'technicianId'>) => {

    const isUserExist = await prisma.user.findUnique({
        where: {
            email: technicianEmail
        }
    })

    if (!isUserExist) {
        throw new AppError(404, "User not found")
    }

    const isTechnicianExist = await prisma.technicianProfiles.findUnique({
        where: {
            userId: isUserExist.id
        }
    })

    if (!isTechnicianExist) {
        throw new AppError(404, "Technician not found")
    }

    const isServiceExist = await prisma.service.findFirst({
        where: {
            name: payload.name,
            location: payload.location,
            technicianId: isTechnicianExist.id,
            categoryId: payload.categoryId
        }
    })

    if (isServiceExist) {
        throw new AppError(400, "Service already exists")
    }

    const result = await prisma.service.create({
        data: {
            ...payload,
            technicianId: isTechnicianExist.id
        }
    })
    
    return result
}

export const serviceService = {
    createService
}