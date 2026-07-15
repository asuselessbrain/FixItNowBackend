export interface IReview {
    id?: string;
    customerId: string;
    serviceId: string;
    technicianId: string;
    bookingId: string;
    rating: number;
    comment?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
