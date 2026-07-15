import { Request, Response } from "express"
import { catchAsync } from "../../../../lib/catchAsync"
import { userService } from "./user.service"
import sendResponse from "../../../../lib/response"

const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.createUser(req.body)

    res.cookie('accessToken', result.accessToken, { secure: false, httpOnly: true })
    res.cookie('refreshToken', result.refreshToken, { secure: false, httpOnly: true })

    sendResponse(res, {
        statusCode: 201,
        message: "User created successfully!",
        data: result
    })
})

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.getAllUsers(req.query);

    sendResponse(res, {
        statusCode: 200,
        message: "Users retrieved successfully!",
        data: result
    })
})

const updateUserStatus = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await userService.updateUserStatus(userId as string, req.body);

    sendResponse(res, {
        statusCode: 200,
        message: "User status updated successfully!",
        data: result
    })
})

export const userController = {
    createUser,
    getAllUsers,
    updateUserStatus
}