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

const getAllServices = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await serviceService.getAllServices(query)

    sendResponse(res, {
        statusCode: 200,
        message: "Services retrieved successfully!",
        data: result
    })
})

const getSingleService = catchAsync(async (req: Request, res: Response) => {
    const serviceId = req.params.id;
    const result = await serviceService.getSingleService(serviceId as string)

    sendResponse(res, {
        statusCode: 200,
        message: "Service retrieved successfully!",
        data: result
    })
})

const updateService = catchAsync(async (req: Request, res: Response) => {
    const technicianEmail = req.user?.email;
    const serviceId = req.params.id;
    const payload = req.body;

    const result = await serviceService.updateService(technicianEmail, serviceId as string, payload)

    sendResponse(res, {
        statusCode: 200,
        message: "Service updated successfully!",
        data: result
    })
})

const getMyAddedServices = catchAsync(async (req: Request, res: Response) => {
    const technicianEmail = req.user?.email;

    const result = await serviceService.getMyAddedServices(technicianEmail as string, req.query)

    sendResponse(res, {
        statusCode: 200,
        message: "My added services retrieved successfully!",
        data: result
    })
})


export const serviceController = {
    createService,
    getAllServices,
    getSingleService,
    updateService,
    getMyAddedServices
}