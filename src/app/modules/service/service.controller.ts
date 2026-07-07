import { Request, Response } from "express"
import { catchAsync } from "../../../../lib/catchAsync"
import sendResponse from "../../../../lib/response"
import { serviceService } from "./service.service"

const createService = catchAsync(async (req: Request, res: Response) => {
    const technicianEmail = req.user?.email;

    const result = await serviceService.createService(technicianEmail, req.body)

    sendResponse(res, {
        statusCode: 201,
        message: "Service created successfully!",
        data: result
    })
})

export const serviceController = {
    createService
}