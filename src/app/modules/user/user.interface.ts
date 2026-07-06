export interface IUser {
    id?: string;
    email: string;
    name: string;
    password: string;
    phone: string;
    role: Role;
    status: Status;
    avatar?: string;
    address?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

type Role = "admin" | "customer" | "technician";
type Status = "active" | "banned";