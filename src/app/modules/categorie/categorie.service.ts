import { prisma } from "../../../../lib/prisma";
import { CategoriesWhereInput } from "../../../../prisma/generated/prisma/models";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { searchingHelper } from "../../../helpers/searchingHelper";
import { sortingHelper } from "../../../helpers/sortingHelper";
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
    return result;
}

export const categoryService = {
    createCategory,
    getAllCategories
}