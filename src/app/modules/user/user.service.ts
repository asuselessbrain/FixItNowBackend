import { config } from "../../../../config";
import { prisma } from "../../../../lib/prisma"
import bcrypt from "bcrypt";
import { Role, Status } from "../../../../prisma/generated/prisma/enums";
import { UserWhereInput } from "../../../../prisma/generated/prisma/models";
import { filterHelper } from "../../../helpers/filterHelper";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { searchingHelper } from "../../../helpers/searchingHelper";
import { sortingHelper } from "../../../helpers/sortingHelper";
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

const getAllUsers = async (query: Record<string, any>) => {
    const { page, limit, searchTerm, sortBy, sortOrder, ...filters } = query;

    const whereConditions: UserWhereInput[] = [];

    const allowedSearchFields = ["name", "email", "phone"];
    const allowedFilterFields = ["role", "status"];
    const allowedSortFields = ["name", "email", "createdAt", "updatedAt", "role", "status"];

    searchingHelper(whereConditions, allowedSearchFields, searchTerm);
    filterHelper(whereConditions, filters, allowedFilterFields);

    const { take, skip } = paginationHelper(page, limit);
    const sortCondition = sortingHelper(allowedSortFields, sortBy, sortOrder);

    const result = await prisma.user.findMany({
        where: {
            AND: whereConditions
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
            updatedAt: true
        },
        take,
        skip,
        orderBy: sortCondition
    });

    const total = await prisma.user.count({
        where: {
            AND: whereConditions
        }
    });

    const totalPages = Math.ceil(total / take);

    const meta = {
        total,
        totalPages,
        currentPage: query.page ? parseInt(query.page) : 1,
        limit: take
    };

    return { meta, result };
}

const updateUserStatus = async (userId: string, payload: { status: Status }) => {
    const isUserExist = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });


    if (!isUserExist) {
        throw new AppError(404, "User not found");
    }

    if (isUserExist.role === Role.admin) {
        throw new AppError(400, "Cannot change the status of an admin user");
    }

    const result = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            status: payload.status
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
            updatedAt: true
        }
    });

    return result;
}

export const userService = {
    createUser,
    getAllUsers,
    updateUserStatus
}