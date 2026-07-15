import bcrypt from "bcrypt"
import { prisma } from "../../../../lib/prisma"
import { Status } from "../../../../prisma/generated/prisma/enums"
import { AppError } from "../../../middlewares/appError"
import { jwtGenerator, jwtVerifier } from '../../../../lib/jwt';
import { config } from '../../../../config';
import { JwtPayload, Secret } from 'jsonwebtoken';
import { StringValue } from 'ms';
import { sendEmail } from "../../../../lib/emailSender";
import { resetPasswordHtml } from "../../../../lib/emailTempletes/resetPasswordTemplete";

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
    if (!refreshToken) {
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

const forgetPassword = async (email: string) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: email,
            status: Status.active
        }
    })

    if (!isUserExist) {
        throw new AppError(404, "User not found!")
    }

    if (isUserExist.updatedAt && isUserExist.updatedAt.getTime() > Date.now() - 5 * 60 * 1000) {
        throw new AppError(429, "You can only request a password reset once every 5 minutes.")
    }

    const token = jwtGenerator({
        userInfo: { email: isUserExist.email, role: isUserExist.role },
        createSecretKey: config.jwt.token_secret as Secret,
        expiresIn: '5m',
    })

    let resetPasswordLink;

    if (config.node_env === 'production') {
        resetPasswordLink = `${config.client_prod_url}/reset-password?token=${token}`
    } else {
        resetPasswordLink = `${config.client_local_url}/reset-password?token=${token}`
    }

    await sendEmail(
        isUserExist.email,
        "Password Reset Request",
        `You requested a password reset. Click the link to reset your password: ${resetPasswordLink}`,
        resetPasswordHtml(resetPasswordLink),
    );
}

const resetPassword = async (payload: { token: string; newPassword: string }) => {
    const decoded = jwtVerifier({
        token: payload.token,
        secretKey: config.jwt.token_secret as Secret,
    }) as JwtPayload;

    const isUserExist = await prisma.user.findUnique({
        where: {
            email: decoded.email,
        },
    });

    if (!isUserExist) {
        throw new AppError(404, "User not found");
    }

    const hashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.salt_rounds),
    );


    await prisma.user.update({
        where: {
            email: decoded.email,
        },
        data: {
            password: hashedPassword,
        },
    });
}

const changePassword = async (email: string, oldPassword: string, newPassword: string) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: email,
            status: Status.active
        }
    })

    if (!isUserExist) {
        throw new AppError(404, "User not found!")
    }

    const isPasswordMarched = await bcrypt.compare(oldPassword, isUserExist.password)

    if (!isPasswordMarched) {
        throw new AppError(401, "Invalid credentials!")
    }

    if(isUserExist.passwordChangeAt && isUserExist.passwordChangeAt.getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) {
        throw new AppError(429, "You can only change your password once every 7 days.")
    }

    const hashedPassword = await bcrypt.hash(
        newPassword,
        Number(config.salt_rounds),
    );

    await prisma.user.update({
        where: {
            email: email,
        },
        data: {
            password: hashedPassword,
        },
    });
}

const currentAuthenticatedUser = async (email: string) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: email,
            status: Status.active
        },
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            role: true,
            status: true,
            avatar: true,
            address: true,
            createdAt: true,
            updatedAt: true,
        }
    })

    if (!isUserExist) {
        throw new AppError(404, "User not found!")
    }

    return isUserExist;
}

const updateProfile = async (
    email: string,
    payload: { name?: string; phone?: string; avatar?: string; address?: string }
) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            email: email,
            status: Status.active
        }
    });

    if (!isUserExist) {
        throw new AppError(404, "User not found!");
    }

    // Filter payload to only update allowed fields
    const updatedData: Record<string, any> = {};
    if (payload.name !== undefined) updatedData.name = payload.name;
    if (payload.phone !== undefined) updatedData.phone = payload.phone;
    if (payload.avatar !== undefined) updatedData.avatar = payload.avatar;
    if (payload.address !== undefined) updatedData.address = payload.address;

    const result = await prisma.user.update({
        where: {
            email: email
        },
        data: updatedData,
        select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            role: true,
            status: true,
            avatar: true,
            address: true,
            createdAt: true,
            updatedAt: true
        }
    });

    return result;
};

export const authService = {
    loginUser,
    generateAccessTokenUsingRefreshToken,
    forgetPassword,
    resetPassword,
    changePassword,
    currentAuthenticatedUser,
    updateProfile
}