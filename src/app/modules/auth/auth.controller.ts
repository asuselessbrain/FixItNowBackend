import { Request, Response } from "express";
import { catchAsync } from "../../../../lib/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../../lib/response";
import { AppError } from "../../../middlewares/appError";

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

const generateAccessTokenUsingRefreshToken = catchAsync(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    const result = await authService.generateAccessTokenUsingRefreshToken(refreshToken);
    sendResponse(res, {
        statusCode: 200,
        message: "Access token generated successfully!",
        data: result,
    })
})

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
    await authService.forgetPassword(req.body.email);
    res.status(200).json({
        success: true,
        message: "Password reset link sent to your email if the email is registered with us",
    })
})

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    await authService.resetPassword(req.body);
    res.status(200).json({
        success: true,
        message: "Password reset successfully",
    })
})

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const email = req.user?.email;
    await authService.changePassword(email, oldPassword, newPassword);
    res.status(200).json({
        success: true,
        message: "Password changed successfully",
    })
})

const currentAuthenticatedUser = catchAsync(async (req: Request, res: Response) => {
    const user = req.user;
    const authenticatedUser = await authService.currentAuthenticatedUser(user?.email);
    sendResponse(res, {
        statusCode: 200,
        message: "Authenticated user retrieved successfully!",
        data: authenticatedUser,
    });
});

export const authController = {
    login,
    generateAccessTokenUsingRefreshToken,
    forgetPassword,
    resetPassword,
    changePassword,
    currentAuthenticatedUser
}