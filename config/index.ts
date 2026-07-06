import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join(process.cwd(), ".env")});

export const config = {
    databaseUrl: process.env.DATABASE_URL || "",
    port: process.env.PORT || 3000,
}