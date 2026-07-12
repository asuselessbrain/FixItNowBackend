import { prisma } from "../../../../lib/prisma"
import { ServiceWhereInput } from "../../../../prisma/generated/prisma/models"
import { filterHelper } from "../../../helpers/filterHelper"
import { paginationHelper } from "../../../helpers/paginationHelper"
import { searchingHelper } from "../../../helpers/searchingHelper"
import { sortingHelper } from "../../../helpers/sortingHelper"
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

const getAllServices = async (payload: Record<string, any>) => {
    const { page, limit, searchTerm, sortBy, sortOrder, ...filters } = payload;

    const whereConditions: ServiceWhereInput[] = [];
    const allowedSearchFields = ["name", "description", "location", "category.name", "technician.user.name"];
    const allowedFilterFields = ["location", "category.name", "rating"];
    const allowedSortFields = ["name", "price", "location", "rating", "createdAt", "updatedAt", "technician.average_rating"];

    if (filters.category) {
        filters['category.name'] = filters.category;
        delete filters.category;
    }

    if (filters.rating) {
        filters['rating'] = parseFloat(filters.rating);
    }

    const ratingRange: Record<string, number> = {};

    if (filters.ratingGt !== undefined && filters.ratingGt !== null && filters.ratingGt !== '') {
        ratingRange.gt = parseFloat(filters.ratingGt);
        delete filters.ratingGt;
    }

    if (filters.ratingGte !== undefined && filters.ratingGte !== null && filters.ratingGte !== '') {
        ratingRange.gte = parseFloat(filters.ratingGte);
        delete filters.ratingGte;
    }

    if (filters.ratingLt !== undefined && filters.ratingLt !== null && filters.ratingLt !== '') {
        ratingRange.lt = parseFloat(filters.ratingLt);
        delete filters.ratingLt;
    }

    if (filters.ratingLte !== undefined && filters.ratingLte !== null && filters.ratingLte !== '') {
        ratingRange.lte = parseFloat(filters.ratingLte);
        delete filters.ratingLte;
    }

    if (Object.keys(ratingRange).length > 0) {
        whereConditions.push({ rating: ratingRange } as ServiceWhereInput);
    }


    searchingHelper(whereConditions, allowedSearchFields, searchTerm);


    filterHelper(whereConditions, filters, allowedFilterFields);

    const { take, skip } = paginationHelper(page, limit);

    const sortCondition = sortingHelper(allowedSortFields, sortBy, sortOrder);

    const result = await prisma.service.findMany({
        where: {
            AND: whereConditions
        },
        include: {
            category: true,
            technician: {
                include: {
                    user: {
                        omit: {
                            password: true,
                            createdAt: true,
                            updatedAt: true,
                            passwordChangeAt: true,
                        }
                    }
                }
            }
        },
        take,
        skip,
        orderBy: sortCondition
    });

    const total = await prisma.service.count({
        where: {
            AND: whereConditions
        }
    });

    const totalPages = Math.ceil(total / take);

    const meta = {
        total,
        totalPages,
        currentPage: payload.page ? parseInt(payload.page) : 1,
        limit: take
    };

    return { meta, result };
}

export const serviceService = {
    createService,
    getAllServices
}