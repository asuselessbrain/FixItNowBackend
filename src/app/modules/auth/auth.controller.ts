import { Request, Response } from "express";
import { catchAsync } from "../../../../lib/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../../lib/response";

const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });

    res.cookie('accessToken', result.accessToken, { secure: false, httpOnly: true })
    res.cookie('refreshToken', result.refreshToken, { secure: false, httpOnly: true })

    sendResponse(res, {
        statusCode: 200,
        message: "User logged in successfully!",
        data: {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken,
            user: result.user,
        },

    })
});

export const authController = {
    login
}