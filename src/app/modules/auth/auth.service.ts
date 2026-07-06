import bcrypt from "bcrypt"
import { prisma } from "../../../../lib/prisma"
import { Status } from "../../../../prisma/generated/prisma/enums"
import { AppError } from "../../../middlewares/appError"
import { jwtGenerator, jwtVerifier } from '../../../../lib/jwt';
import { config } from '../../../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { StringValue } from 'ms';

const loginUser = async (payload: { email: string, password: string }) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: payload.email,
            status: Status.active
        }
    })

    if (!isUserExist) {
        throw new AppError(404, "User not found!")
    }

    const isPasswordMarched = await bcrypt.compare(payload.password, isUserExist.password)

    if (!isPasswordMarched) {
        throw new AppError(401, "Invalid credentials!")
    }

    const accessToken = jwtGenerator({
        userInfo: { email: isUserExist.email, role: isUserExist.role },
        createSecretKey: config.jwt.token_secret as Secret,
        expiresIn: config.jwt.token_expires_in as StringValue,
    })

    const refreshToken = jwtGenerator({
        userInfo: { email: isUserExist.email, role: isUserExist.role },
        createSecretKey: config.jwt.refresh_token_secret as Secret,
        expiresIn: config.jwt.refresh_token_expires_in as StringValue,
    })


    return {
        accessToken,
        refreshToken,
        user: {
            email: isUserExist.email,
            role: isUserExist.role,
        }
    }
}

const generateAccessTokenUsingRefreshToken = async (refreshToken: string) => {
    if(!refreshToken) {
        throw new AppError(401, "Unauthorized")
    }

    let decoded;

    try {
        decoded = jwtVerifier({
            token: refreshToken,
            secretKey: config.jwt.refresh_token_secret as Secret,
        }) as JwtPayload;
    } catch (err: any) {
        if (err.name === "TokenExpiredError") {
            throw new AppError(401, "Refresh token expired");
        }
        if (err.name === "JsonWebTokenError") {
            throw new AppError(401, "Invalid refresh token");
        }
        throw new AppError(401, "Unauthorized");
    }

    const user = await prisma.user.findUnique({
        where: {
            email: decoded.email,
            status: Status.active,
        },
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const newAccessToken = jwtGenerator({
        userInfo: { email: user.email, role: user.role },
        createSecretKey: config.jwt.token_secret as Secret,
        expiresIn: config.jwt.token_expires_in as StringValue,
    })

    return {
        accessToken: newAccessToken
    };
}


export const authService = {
    loginUser,
    generateAccessTokenUsingRefreshToken
}