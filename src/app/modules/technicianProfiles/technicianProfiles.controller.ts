import { Request, Response } from "express";
import { catchAsync } from "../../../../lib/catchAsync";
import { technicianProfilesService } from "./technicianProfiles.service";
import sendResponse from "../../../../lib/response";

const getAllTechnicianProfiles = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await technicianProfilesService.getAllTechnician(query)
    sendResponse(res, {
        statusCode: 200,
        message: "Technician retrieved successfully!",
        data: result
    })
})

export const technicianProfilesController = {
    getAllTechnicianProfiles
}