import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join(process.cwd(), ".env")});

export const config = {
    databaseUrl: process.env.DATABASE_URL || "",
    port: process.env.PORT || 3000,
    salt_rounds: process.env.SALT_ROUNDS || 10,
    jwt: {
        token_secret: process.env.JWT_TOKEN_SECRET || "default_secret",
        token_expires_in: process.env.JWT_TOKEN_EXPIRES_IN || "1h",
        refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET || "default_refresh_secret",
        refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d",
    }
}