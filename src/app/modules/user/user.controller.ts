import { Request, Response } from "express"
import { catchAsync } from "../../../../lib/catchAsync"
import { userService } from "./user.service"
import sendResponse from "../../../../lib/response"

const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.createUser(req.body)

    res.cookie('token', result.accessToken, { secure: false, httpOnly: true })

    sendResponse(res, {
        statusCode: 201,
        message: "User created successfully!",
        data: result
    })
})

export const userController = {
    createUser
}