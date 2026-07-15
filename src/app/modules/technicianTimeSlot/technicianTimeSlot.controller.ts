import { Request, Response } from "express";
import { catchAsync } from "../../../../lib/catchAsync";
import sendResponse from "../../../../lib/response";
import { technicianTimeSlotService } from "./technicianTimeSlot.service";

const createTechnicianTimeSlots = catchAsync(async (req: Request, res: Response) => {
    const email = req.user?.email;
    const { date, selectedSlots } = req.body;

    const result = await technicianTimeSlotService.createTechnicianTimeSlots(email as string, date, selectedSlots)

    sendResponse(res, {
        statusCode: 201,
        message: "Technician time slots created successfully!",
        data: result
    })
})

const updateTechnicianTimeSlots = catchAsync(async (req: Request, res: Response) => {
    const email = req.user?.email;
    const { date, selectedSlots } = req.body;

    const result = await technicianTimeSlotService.updateTechnicianTimeSlots(email as string, date, selectedSlots);

    sendResponse(res, {
        statusCode: 200,
        message: "Technician time slots updated successfully!",
        data: result
    });
});

export const technicianTimeSlotController = {
    createTechnicianTimeSlots,
    updateTechnicianTimeSlots
}