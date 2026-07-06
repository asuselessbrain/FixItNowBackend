import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/login", authController.login)
router.get('/refresh-token', authController.generateAccessTokenUsingRefreshToken);
router.post('/forget-password', authController.forgetPassword);
router.post('/reset-password', authController.resetPassword);

export const authRouter = router;