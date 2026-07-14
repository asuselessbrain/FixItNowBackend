import { Request, Response } from "express";
import { catchAsync } from "../../../../lib/catchAsync";
import { paymentService } from "./payment.service";
import sendResponse from "../../../../lib/response";

const createPayment = catchAsync(async (req:Request, res: Response) => {
    const userEmail = req.user?.email;
    const result = await paymentService.createPayment(userEmail as string, req.body);

    sendResponse(res, {
        statusCode: 201,
        message: "Payment created successfully!",
        data: result
    })
})

const handleWebhook = catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;
    const payload = req.body;

    await paymentService.handleWebhook(payload, signature);

    sendResponse(res, {
        statusCode: 200,
        message: "Webhook handled successfully!",
        data: null
    })
})

export const paymentController = {
    createPayment,
    handleWebhook
}