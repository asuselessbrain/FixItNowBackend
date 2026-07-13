import { BookingStatus } from "../../../../prisma/generated/prisma/enums";

export interface IBooking {
    id?: string;
    customerId?: string;
    serviceId: string;
    technicianId?: string;
    slotId: string;
    totalAmount: number;
    status?: BookingStatus;
    createdAt?: Date;
    updatedAt?: Date;
}