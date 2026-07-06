import { config } from "../../../../config";
import { prisma } from "../../../../lib/prisma"
import bcrypt from "bcrypt";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { Secret } from "jsonwebtoken";
import { StringValue } from "ms";
import { jwtGenerator } from "../../../../lib/jwt";
import { IUser } from "./user.interface";

const createUser = async (payload: IUser) => {
    const hashedPassword = await bcrypt.hash(payload.password, Number(config.salt_rounds))

    const userData = {
        ...payload,
        password: hashedPassword,
        role: Role.customer
    }

    const result = await prisma.user.create({
        data: userData,
    })

    const accessToken = jwtGenerator({
        userInfo: { email: result.email, role: result.role },
        createSecretKey: config.jwt.token_secret as Secret,
        expiresIn: config.jwt.token_expires_in as StringValue,
    })
    return { ...result, accessToken };
}

export const userService = {
    createUser,
}