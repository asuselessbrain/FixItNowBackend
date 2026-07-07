import { Request, Response } from "express"
import { catchAsync } from "../../../../lib/catchAsync"
import sendResponse from "../../../../lib/response"
import { categoryService } from "./categorie.service"

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const result = await categoryService.createCategory(req.body)

    sendResponse(res, {
        statusCode: 201,
        message: "Category created successfully!",
        data: result
    })
})

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await categoryService.getAllCategories(query)
    sendResponse(res, {
        statusCode: 200,
        message: "Categories retrieved successfully!",
        data: result
    })
})

const getSingleCategory = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await categoryService.getSingleCategory(id as string)
    sendResponse(res, {
        statusCode: 200,
        message: "Category retrieved successfully!",
        data: result
    })
})

export const categoryController = {
    createCategory,
    getAllCategories,
    getSingleCategory
}