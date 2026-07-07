import { prisma } from "../../../../lib/prisma";
import { ICategory } from "./categorie.interface";

const createCategory = async (payload: ICategory) => {

    const result = await prisma.categories.create({
        data: payload
    })

    return result;
}

const getAllCategories = async () => {
    const result = await prisma.categories.findMany();
    return result;
}

export const categoryService = {
    createCategory,
    getAllCategories
}