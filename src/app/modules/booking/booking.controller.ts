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

const acceptBooking = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const result = await bookingService.acceptBooking(bookingId as string);

    sendResponse(res, {
        statusCode: 200,
        message: "Booking accepted successfully!",
        data: result
    })
})


const rejectBooking = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const result = await bookingService.rejectBooking(bookingId as string);

    sendResponse(res, {
        statusCode: 200,
        message: "Booking rejected successfully!",
        data: result
    })
})

const completeBooking = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const userEmail = req.user?.email;
    const result = await bookingService.completeBooking(userEmail as string, bookingId as string);

    sendResponse(res, {
        statusCode: 200,
        message: "Booking completed successfully!",
        data: result
    })
})

export const bookingController = {
    createBooking,
    acceptBooking,
    rejectBooking,
    completeBooking
}