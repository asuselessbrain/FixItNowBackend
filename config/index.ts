import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join(process.cwd(), ".env")});

export const config = {
    node_env: process.env.NODE_ENV || "development",
    databaseUrl: process.env.DATABASE_URL || "",
    port: process.env.PORT || 3000,
    salt_rounds: process.env.SALT_ROUNDS || 10,
    client_local_url: process.env.CLIENT_LOCAL_URL || "http://localhost:3000",
    client_prod_url: process.env.CLIENT_PROD_URL || "https://assignment-4-arfan.vercel.app",
    jwt: {
        token_secret: process.env.JWT_TOKEN_SECRET || "default_secret",
        token_expires_in: process.env.JWT_TOKEN_EXPIRES_IN || "1h",
        refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET || "default_refresh_secret",
        refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || "7d",
    },
    email: {
        host: process.env.EMAIL_HOST || "",
        port: process.env.EMAIL_PORT || 587,
        user: process.env.EMAIL_USER || "",
        pass: process.env.EMAIL_PASS || "",
    },
    seedAdminData: {
        email: process.env.SEED_ADMIN_EMAIL || "admin@gmail.com",
        password: process.env.SEED_ADMIN_PASSWORD || "123456"
    },
    payment: {
        stripe_secret_key: process.env.STRIPE_SECRET_KEY
    }
}