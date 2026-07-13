import { Request, Response } from "express";
import { catchAsync } from "../../../../lib/catchAsync";
import { bookingService } from "./booking.service";
import sendResponse from "../../../../lib/response";

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const userEmail = req.user?.email;
    const result = await bookingService.createBooking(userEmail as string, req.body)

    sendResponse(res, {
        statusCode: 201,
        message: "Booking created successfully!",
        data: result
    })
})

export const bookingController = {
    createBooking
}