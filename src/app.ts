import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import router from "./routes/router";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./app/docs/swaggerSpec";
import { authLimiter, globalLimiter } from "../lib/rateLimit";
import helmet from "helmet";

const app: Application = express();

app.set('trust proxy', 1)

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                "script-src": ["'self'", "'unsafe-inline'"],
                "style-src": ["'self'", "'unsafe-inline'"],
                "img-src": ["'self'", "data:", "validator.swagger.io"],
            },
        },
    })
);

app.use("/api/v1", globalLimiter)
app.use("/api/v1/auth/login", authLimiter)
app.use("/api/v1/auth/forget-password", authLimiter)
app.use("/api/v1/auth/reset-password", authLimiter)
app.use("/api/v1/auth/change-password", authLimiter)
app.use("/api/v1/payment/webhook", express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// @ts-ignore
import swaggerUiDist from "swagger-ui-dist";

const swaggerUiDistPath = swaggerUiDist.getAbsoluteFSPath();
app.use("/api-docs", express.static(swaggerUiDistPath, { index: false }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
    res.send("Server is running .......");
});

app.use(globalErrorHandler)
app.use(notFound);

export default app;
