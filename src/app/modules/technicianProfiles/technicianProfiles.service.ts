import { prisma } from "../../../../lib/prisma"
import { UserWhereInput } from "../../../../prisma/generated/prisma/models"
import { paginationHelper } from "../../../helpers/paginationHelper"
import { searchingHelper } from "../../../helpers/searchingHelper"
import { sortingHelper } from "../../../helpers/sortingHelper"

const getAllTechnician = async (payload: any) => {
    const whereCondition: UserWhereInput[] = []

    const allowedSearchFields = ["name", "email", "phone", "address", "technicianProfiles.skills", "technicianProfiles.location", "technicianProfiles.bio"]
    
    const allowedSortFields = ["name", "technicianProfiles.average_rating", "createdAt", "updatedAt"]

    if(payload.sortBy && payload.sortBy === "average_rating") {
        payload.sortBy = "technicianProfiles.average_rating"
    }

    searchingHelper(whereCondition, allowedSearchFields, payload.searchTerm)

    const { take, skip } = paginationHelper(payload.page, payload.limit)

    const sortCondition = sortingHelper(allowedSortFields, payload.sortBy, payload.sortOrder)

    const result = await prisma.user.findMany({
        where: {
            AND: whereCondition,
            role: "technician"
        },
        include: {
            technicianProfiles: true
        },
        take,
        skip,
        orderBy: sortCondition
    })

    const total = await prisma.user.count({
        where: {
            AND: whereCondition,
            role: "technician"
        }
    })

    const totalPages = Math.ceil(total / take)

    const meta = {
        total,
        totalPages,
        currentPage: payload.page ? parseInt(payload.page) : 1,
        limit: take
    }

    return { meta, result }
}

export const technicianProfilesService = {
    getAllTechnician
}