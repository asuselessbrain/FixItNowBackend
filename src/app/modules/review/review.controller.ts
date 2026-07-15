import { Request, Response } from "express";
import { catchAsync } from "../../../../lib/catchAsync";
import { reviewService } from "./review.service";
import sendResponse from "../../../../lib/response";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const userEmail = req.user?.email;
    const result = await reviewService.createReview(userEmail as string, req.body);

    sendResponse(res, {
        statusCode: 201,
        message: "Review submitted successfully!",
        data: result
    });
});

export const reviewController = {
    createReview
};
