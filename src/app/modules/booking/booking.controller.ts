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

const confirmBooking = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const result = await bookingService.confirmBooking(bookingId as string);

    sendResponse(res, {
        statusCode: 200,
        message: "Booking confirmed successfully!",
        data: result
    })
})

export const bookingController = {
    createBooking,
    confirmBooking
}