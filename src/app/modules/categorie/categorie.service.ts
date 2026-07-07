import { prisma } from "../../../../lib/prisma";
import { CategoriesWhereInput } from "../../../../prisma/generated/prisma/models";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { searchingHelper } from "../../../helpers/searchingHelper";
import { sortingHelper } from "../../../helpers/sortingHelper";
import { AppError } from "../../../middlewares/appError";
import { ICategory } from "./categorie.interface";

const createCategory = async (payload: ICategory) => {

    const result = await prisma.categories.create({
        data: payload
    })

    return result;
}

const getAllCategories = async (query: any) => {
    const whereCondition: CategoriesWhereInput[] = [];

    const allowedSortFields = ["name", "createdAt", "updatedAt"];
    const allowedSearchFields = ["name", "description", "slug"];

    searchingHelper(whereCondition, allowedSearchFields, query.searchTerm)

    const { take, skip } = paginationHelper(query.page, query.limit);

    const sortCondition = sortingHelper(allowedSortFields, query.sortBy, query.sortOrder);

    const result = await prisma.categories.findMany({
        where: {
            AND: whereCondition
        },
        take,
        skip,
        orderBy: sortCondition
    });

    const total = await prisma.categories.count({
        where: {
            AND: whereCondition
        }
    })

    const totalPages = Math.ceil(total / take);

    const meta = {
        total,
        totalPages,
        currentPage: query.page ? parseInt(query.page) : 1,
        limit: take
    }
    return { meta, result };
}

const getSingleCategory = async (id: string) => {
    const result = await prisma.categories.findUnique({
        where: {
            id
        }
    })

    if (!result) {
        throw new AppError(404, "Category not found");
    }
    return result;
}

const updateCategory = async (id: string, payload: ICategory) => {

    const existingCategory = await prisma.categories.findUnique({
        where: {
            id
        }
    })

    if (!existingCategory) {
        throw new AppError(404, "Category not found");
    }
    
    const result = await prisma.categories.update({
        where: {
            id
        },
        data: payload
    })

    return result;
}

export const categoryService = {
    createCategory,
    getAllCategories,
    getSingleCategory,
    updateCategory
}