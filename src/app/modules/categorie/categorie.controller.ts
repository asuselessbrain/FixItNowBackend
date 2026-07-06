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

export const categoryController = {
    createCategory
}