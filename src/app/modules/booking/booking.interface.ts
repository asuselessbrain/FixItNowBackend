export interface IBooking {
    id?: string;
    customerId?: string;
    serviceId: string;
    technicianId?: string;
    slotId: string;
    totalAmount: number;
    status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    createdAt?: Date;
    updatedAt?: Date;
}