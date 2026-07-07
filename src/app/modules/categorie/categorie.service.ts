import { prisma } from "../../../../lib/prisma";
import { CategoriesWhereInput } from "../../../../prisma/generated/prisma/models";
import { paginationHelper } from "../../../helpers/paginationHelper";
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

    if (query.searchTerm) {
        whereCondition.push({
            OR: [
                { name: { contains: query.searchTerm, mode: "insensitive" } },
                { description: { contains: query.searchTerm, mode: "insensitive" } },
                { slug: { contains: query.searchTerm, mode: "insensitive" } }
            ]
        })
    }

    const {take, skip} = paginationHelper(query.page, query.limit);

    const sortCondition: { [key: string]: "asc" | "desc" } = {};

    if (query.sortBy && allowedSortFields.includes(query.sortBy)) {
        const sortOrder = query.sortOrder === "asc" ? "asc" : "desc";

        sortCondition[query.sortBy] = sortOrder;
    }
    const result = await prisma.categories.findMany({
        where: {
            AND: whereCondition
        },
        take,
        skip,
        orderBy: sortCondition
    });
    return result;
}

export const categoryService = {
    createCategory,
    getAllCategories
}