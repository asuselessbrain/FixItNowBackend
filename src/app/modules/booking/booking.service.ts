import { prisma } from "../../../../lib/prisma"
import { BookingStatus, SlotStatus } from "../../../../prisma/generated/prisma/enums";
import { BookingsWhereInput } from "../../../../prisma/generated/prisma/models";
import { filterHelper } from "../../../helpers/filterHelper";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { searchingHelper } from "../../../helpers/searchingHelper";
import { sortingHelper } from "../../../helpers/sortingHelper";
import { AppError } from "../../../middlewares/appError";
import { IBooking } from "./booking.interface";

const createBooking = async (email: string, payload: Omit<IBooking, 'id' | 'customerId' | 'createdAt' | 'updatedAt' | 'technicianId' | 'totalAmount'>) => {

    const isUserExist = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!isUserExist) {
        throw new AppError(404, "User not found");
    }

    const isSlotAvailable = await prisma.technicianSlots.findUnique({
        where: {
            id: payload.slotId
        }
    })

    if (!isSlotAvailable) {
        throw new AppError(404, "Slot not found");
    }

    const slotDate = new Date(isSlotAvailable.date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    slotDate.setHours(0, 0, 0, 0);

    if (slotDate < currentDate) {
        throw new AppError(400, "Cannot book a service for a past date");
    }

    if (isSlotAvailable.status === SlotStatus.BOOKED) {
        throw new AppError(400, "Slot is already booked");
    }

    const isServiceExist = await prisma.service.findUnique({
        where: {
            id: payload.serviceId
        },
        include: {
            category: true,
            technician: {
                include: {
                    user: true
                }
            }
        }
    })


    if (!isServiceExist) {
        throw new AppError(404, "Service not found");
    }

    const technicianId = isServiceExist.technician.id;
    const totalAmount = isServiceExist.price;

    const result = await prisma.$transaction(async (tx) => {
        const booking = await tx.bookings.create({
            data: {
                customerId: isUserExist.id,
                technicianId: technicianId,
                totalAmount,
                ...payload
            }
        })

        await tx.technicianSlots.update({
            where: {
                id: payload.slotId
            },
            data: {
                status: SlotStatus.BOOKED
            }
        })
        return booking;
    })

    return result
}

const acceptBooking = async (bookingId: string) => {
    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId
        }
    })

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    if (booking.status === "CONFIRMED") {
        throw new AppError(400, "Booking is already confirmed");
    }

    if (booking.status === "CANCELLED") {
        throw new AppError(400, "Booking is cancelled");
    }

    const result = await prisma.bookings.update({
        where: {
            id: bookingId
        },
        data: {
            status: "CONFIRMED"
        }
    })
    return result;
}

const rejectBooking = async (bookingId: string) => {
    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId
        }
    })

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    if (booking.status === BookingStatus.CANCELLED) {
        throw new AppError(400, "Booking is already cancelled");
    }

    if (booking.status === BookingStatus.CONFIRMED) {
        throw new AppError(400, "Booking is already confirmed");
    }

    if (booking.status === BookingStatus.COMPLETED) {
        throw new AppError(400, "Booking is already completed");
    }

    if (booking.status === BookingStatus.IN_PROGRESS) {
        throw new AppError(400, "Booking is already in progress");
    }

    if (booking.status === BookingStatus.PAID) {
        throw new AppError(400, "Booking is already paid");
    }

    const result = await prisma.$transaction(async (tx) => {
        await tx.bookings.update({
            where: {
                id: bookingId
            },
            data: {
                status: BookingStatus.REJECTED
            }
        })
    })

    await prisma.technicianSlots.update({
        where: {
            id: booking.slotId
        },
        data: {
            status: SlotStatus.AVAILABLE
        }
    })
    return result;
}

const completeBooking = async (email: string, bookingId: string) => {
    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId
        }
    })

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    const isUserExist = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (!isUserExist) {
        throw new AppError(404, "User not found");
    }

    const isTechnician = await prisma.technicianProfiles.findUnique({
        where: {
            userId: isUserExist.id
        }
    })

    if (!isTechnician) {
        throw new AppError(403, "You are not authorized to complete this booking");
    }

    if (booking?.technicianId !== isTechnician.id) {
        throw new AppError(403, "You are not authorized to complete this booking");
    }

    if (booking.status === "CANCELLED") {
        throw new AppError(400, "Booking is cancelled");
    }

    if (booking.status === "COMPLETED") {
        throw new AppError(400, "Booking is already completed");
    }

    if (booking.status !== "IN_PROGRESS") {
        throw new AppError(400, "Booking must be in-progress before marking as completed");
    }

    const result = await prisma.bookings.update({
        where: {
            id: bookingId
        },
        data: {
            status: "COMPLETED"
        }
    })
    return result;
}

const cancelBookingByTechnician = async (email: string, bookingId: string) => {
    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId
        }
    })

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    if (booking.status === "CANCELLED") {
        throw new AppError(400, "Booking is already cancelled");
    }

    if (booking.status === "COMPLETED") {
        throw new AppError(400, "Booking is already completed");
    }

    if (booking.status === "PAID") {
        throw new AppError(400, "Booking is already paid");
    }

    const isUserExist = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!isUserExist) {
        throw new AppError(404, "User not found");
    }

    const isTechnician = await prisma.technicianProfiles.findUnique({
        where: {
            userId: isUserExist.id
        }
    })

    if (!isTechnician) {
        throw new AppError(404, "Technician not found");
    }

    if (booking.technicianId !== isTechnician.id) {
        throw new AppError(403, "You are not authorized to cancel this booking");
    }

    const result = await prisma.$transaction(async (tx) => {
        const booking = await tx.bookings.update({
            where: {
                id: bookingId
            },
            data: {
                status: "CANCELLED"
            }
        })

        await tx.technicianSlots.update({
            where: {
                id: booking.slotId
            },
            data: {
                status: SlotStatus.AVAILABLE
            }
        })
        return booking;
    }
    )
    return result;
}

const cancelBookingByCustomer = async (email: string, bookingId: string) => {
    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId
        }
    })

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    if (booking.status === "CANCELLED") {
        throw new AppError(400, "Booking is already cancelled");
    }

    if (booking.status === "COMPLETED") {
        throw new AppError(400, "Booking is already completed");
    }

    if (booking.status === "IN_PROGRESS") {
        throw new AppError(400, "Booking is already in-progress and cannot be cancelled");
    }

    const isUserExist = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!isUserExist) {
        throw new AppError(404, "User not found");
    }

    if (booking.customerId !== isUserExist.id) {
        throw new AppError(403, "You are not authorized to cancel this booking");
    }

    const result = await prisma.$transaction(async (tx) => {
        const updatedBooking = await tx.bookings.update({
            where: {
                id: bookingId
            },
            data: {
                status: "CANCELLED"
            }
        })

        await tx.technicianSlots.update({
            where: {
                id: booking.slotId
            },
            data: {
                status: SlotStatus.AVAILABLE
            }
        })

        return updatedBooking;
    })
    return result;
}

const getMyBookings = async (email: string, query: Record<string, any>) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
            status: "active"
        }
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    const { page, limit, searchTerm, sortBy, sortOrder, ...filters } = query;

    const whereConditions: BookingsWhereInput[] = [
        {
            customerId: user.id
        }
    ];

    const allowedSearchFields = ["service.name", "service.description", "service.location", "technician.user.name"];
    const allowedFilterFields = ["status"];
    const allowedSortFields = ["createdAt", "updatedAt", "totalAmount", "status"];

    searchingHelper(whereConditions, allowedSearchFields, searchTerm);
    filterHelper(whereConditions, filters, allowedFilterFields);

    const { take, skip } = paginationHelper(page, limit);
    const sortCondition = sortingHelper(allowedSortFields, sortBy, sortOrder);

    const result = await prisma.bookings.findMany({
        where: {
            AND: whereConditions
        },
        include: {
            service: true,
            technician: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            avatar: true
                        }
                    }
                }
            },
            slot: true,
            payments: true
        },
        take,
        skip,
        orderBy: sortCondition
    });

    const total = await prisma.bookings.count({
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

const getTechnicianBookings = async (email: string, query: Record<string, any>) => {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
            status: "active"
        },
        include: {
            technicianProfiles: true
        }
    });

    if (!user || !user.technicianProfiles) {
        throw new AppError(404, "Technician profile not found");
    }

    const { page, limit, searchTerm, sortBy, sortOrder, ...filters } = query;

    const whereConditions: BookingsWhereInput[] = [
        {
            technicianId: user.technicianProfiles.id
        }
    ];

    const allowedSearchFields = ["service.name", "customer.name", "customer.phone", "customer.email"];
    const allowedFilterFields = ["status"];
    const allowedSortFields = ["createdAt", "updatedAt", "totalAmount", "status"];

    searchingHelper(whereConditions, allowedSearchFields, searchTerm);
    filterHelper(whereConditions, filters, allowedFilterFields);

    const { take, skip } = paginationHelper(page, limit);
    const sortCondition = sortingHelper(allowedSortFields, sortBy, sortOrder);

    const result = await prisma.bookings.findMany({
        where: {
            AND: whereConditions
        },
        include: {
            service: true,
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    avatar: true,
                    address: true
                }
            },
            slot: true,
            payments: true
        },
        take,
        skip,
        orderBy: sortCondition
    });

    const total = await prisma.bookings.count({
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

const getAllBookings = async (query: Record<string, any>) => {
    const { page, limit, searchTerm, sortBy, sortOrder, ...filters } = query;

    const whereConditions: BookingsWhereInput[] = [];

    const allowedSearchFields = ["service.name", "customer.name", "customer.phone", "technician.user.name"];
    const allowedFilterFields = ["status"];
    const allowedSortFields = ["createdAt", "updatedAt", "totalAmount", "status"];

    searchingHelper(whereConditions, allowedSearchFields, searchTerm);
    filterHelper(whereConditions, filters, allowedFilterFields);

    const { take, skip } = paginationHelper(page, limit);
    const sortCondition = sortingHelper(allowedSortFields, sortBy, sortOrder);

    const result = await prisma.bookings.findMany({
        where: {
            AND: whereConditions
        },
        include: {
            service: true,
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    avatar: true,
                    address: true
                }
            },
            technician: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            avatar: true
                        }
                    }
                }
            },
            slot: true,
            payments: true
        },
        take,
        skip,
        orderBy: sortCondition
    });

    const total = await prisma.bookings.count({
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

const inProgressBooking = async (email: string, bookingId: string) => {
    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId
        }
    });

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    const isUserExist = await prisma.user.findUnique({
        where: {
            email: email
        }
    });

    if (!isUserExist) {
        throw new AppError(404, "User not found");
    }

    const isTechnician = await prisma.technicianProfiles.findUnique({
        where: {
            userId: isUserExist.id
        }
    });

    if (!isTechnician) {
        throw new AppError(403, "You are not authorized to start this booking");
    }

    if (booking.technicianId !== isTechnician.id) {
        throw new AppError(403, "You are not authorized to start this booking");
    }

    if (booking.status === "CANCELLED") {
        throw new AppError(400, "Booking is cancelled");
    }

    if (booking.status === "IN_PROGRESS") {
        throw new AppError(400, "Booking is already in-progress");
    }

    if (booking.status === "COMPLETED") {
        throw new AppError(400, "Booking is already completed");
    }

    if (booking.status !== "PAID") {
        throw new AppError(400, "Booking must be PAID before marking as in-progress");
    }

    const result = await prisma.bookings.update({
        where: {
            id: bookingId
        },
        data: {
            status: "IN_PROGRESS"
        }
    });

    return result;
}

const getSingleBooking = async (bookingId: string, email: string, role: string) => {
    const booking = await prisma.bookings.findUnique({
        where: {
            id: bookingId
        },
        include: {
            service: true,
            customer: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    avatar: true,
                    address: true
                }
            },
            technician: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            avatar: true
                        }
                    }
                }
            },
            slot: true,
            payments: true
        }
    });

    if (!booking) {
        throw new AppError(404, "Booking not found");
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new AppError(404, "User not found");
    }

    // Role-based authorization
    if (role === "customer" && booking.customerId !== user.id) {
        throw new AppError(403, "You are not authorized to view this booking");
    }

    if (role === "technician") {
        const technician = await prisma.technicianProfiles.findUnique({
            where: { userId: user.id }
        });
        if (!technician || booking.technicianId !== technician.id) {
            throw new AppError(403, "You are not authorized to view this booking");
        }
    }

    return booking;
}

export const bookingService = {
    createBooking,
    acceptBooking,
    rejectBooking,
    completeBooking,
    cancelBookingByTechnician,
    cancelBookingByCustomer,
    getMyBookings,
    getTechnicianBookings,
    getAllBookings,
    inProgressBooking,
    getSingleBooking
}