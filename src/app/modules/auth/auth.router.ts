import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

router.post("/login", authController.login)
router.get('/refresh-token', authController.generateAccessTokenUsingRefreshToken);
router.post('/forget-password', authController.forgetPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', auth(Role.admin, Role.customer, Role.technician), authController.changePassword);

export const authRouter = router;