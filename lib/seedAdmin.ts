import bcrypt from "bcrypt";
import { config } from "../config";
import { prisma } from "./prisma";
import { Role, Status } from "../prisma/generated/prisma/enums";

export const seedAdmin = async () => {
    try {
        const hashedPassword = await bcrypt.hash(config.seedAdminData.password, Number(config.salt_rounds));

        if (!config.seedAdminData.email || !config.seedAdminData.password) {
            console.warn("Admin email or password not provided. Skipping admin seeding.");
            return;
        }

        const existingAdmin = await prisma.user.findUnique({
            where: {
                email: config.seedAdminData.email,
            },
        });

        if (!existingAdmin) {
            await prisma.user.create({
                data: {
                    email: config.seedAdminData.email,
                    name: "Mahmudul Hasan",
                    password: hashedPassword,
                    phone: "+8801712345678",
                    role: Role.admin,
                    status: Status.active,
                    avatar: "https://api.yourdomain.com/uploads/avatars/admin-profile.png",
                    address: "Dhaka, Bangladesh",
                },
            })

            if (process.env.NODE_ENV === "development") {
                console.log("Admin user seeded successfully.");
            }
        }
    }
    catch (error) {
        if (process.env.NODE_ENV === "development") {
            console.error("Error seeding admin user:", error);
        }
    }
}