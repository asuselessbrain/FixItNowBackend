import { config } from "../../../../config";
import { prisma } from "../../../../lib/prisma"
import bcrypt from "bcrypt";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { Secret } from "jsonwebtoken";
import { StringValue } from "ms";
import { jwtGenerator } from "../../../../lib/jwt";
import { IUser } from "./user.interface";
import { AppError } from "../../../middlewares/appError";

const createUser = async (payload: IUser) => {
    const hashedPassword = await bcrypt.hash(payload.password, Number(config.salt_rounds))

    if (payload.role && payload.role === Role.admin) {
        throw new AppError(403, "You are not allowed to create an admin user");
    }

    const userData = {
        ...payload,
        password: hashedPassword
    }

    const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: userData
        })

        if (payload.role === Role.technician) {
            await tx.technicianProfiles.create({
                data: {
                    userId: user.id,
                }
            })
        }

        return user;
    })

    const accessToken = jwtGenerator({
        userInfo: { email: result.email, role: result.role },
        createSecretKey: config.jwt.token_secret as Secret,
        expiresIn: config.jwt.token_expires_in as StringValue,
    })

    const refreshToken = jwtGenerator({
        userInfo: { email: result.email, role: result.role },
        createSecretKey: config.jwt.refresh_token_secret as Secret,
        expiresIn: config.jwt.refresh_token_expires_in as StringValue,
    })
    return { ...result, accessToken, refreshToken };
}

export const userService = {
    createUser,
}