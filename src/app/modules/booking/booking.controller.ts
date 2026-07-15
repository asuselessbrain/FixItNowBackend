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

const cancelBookingByTechnician = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const userEmail = req.user?.email;
    const result = await bookingService.cancelBookingByTechnician(userEmail as string, bookingId as string);

    sendResponse(res, {
        statusCode: 200,
        message: "Booking cancelled successfully!",
        data: result
    })
})

const cancelBookingByCustomer = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const userEmail = req.user?.email;
    const result = await bookingService.cancelBookingByCustomer(userEmail as string, bookingId as string);  

    sendResponse(res, {
        statusCode: 200,
        message: "Booking cancelled successfully!",
        data: result
    })
})

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
    const userEmail = req.user?.email;
    const result = await bookingService.getMyBookings(userEmail as string, req.query);

    sendResponse(res, {
        statusCode: 200,
        message: "Bookings retrieved successfully!",
        data: result
    })
})

const getTechnicianBookings = catchAsync(async (req: Request, res: Response) => {
    const userEmail = req.user?.email;
    const result = await bookingService.getTechnicianBookings(userEmail as string, req.query);

    sendResponse(res, {
        statusCode: 200,
        message: "Technician bookings retrieved successfully!",
        data: result
    })
})

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
    const result = await bookingService.getAllBookings(req.query);

    sendResponse(res, {
        statusCode: 200,
        message: "Bookings retrieved successfully!",
        data: result
    })
})

const inProgressBooking = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const userEmail = req.user?.email;
    const result = await bookingService.inProgressBooking(userEmail as string, bookingId as string);

    sendResponse(res, {
        statusCode: 200,
        message: "Booking marked as in-progress successfully!",
        data: result
    })
})

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const userEmail = req.user?.email;
    const userRole = req.user?.role;
    const result = await bookingService.getSingleBooking(bookingId as string, userEmail as string, userRole as string);

    sendResponse(res, {
        statusCode: 200,
        message: "Booking retrieved successfully!",
        data: result
    })
})

export const bookingController = {
    createBooking,
    acceptBooking,
    rejectBooking,
    completeBooking,
    cancelBookingByTechnician,
    cancelBookingByCustomer,
    getMyBookings,
    getTechnicianBookings,
    getAllBookings,
    inProgressBooking,
    getSingleBooking
}