import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../../middlewares/validateRequest";
import { authValidations } from "./auth.validation";

const router = Router();

router.post("/login", validateRequest(authValidations.loginValidationSchema), authController.login)
router.get('/refresh-token', authController.generateAccessTokenUsingRefreshToken);
router.post('/forget-password', validateRequest(authValidations.forgetPasswordValidationSchema), authController.forgetPassword);
router.post('/reset-password', validateRequest(authValidations.resetPasswordValidationSchema), authController.resetPassword);
router.post('/change-password', auth(Role.admin, Role.customer, Role.technician), validateRequest(authValidations.changePasswordValidationSchema), authController.changePassword);
router.patch('/update-profile', auth(Role.admin, Role.customer, Role.technician), validateRequest(authValidations.updateProfileValidationSchema), authController.updateProfile);
router.get('/me', auth(Role.admin, Role.customer, Role.technician), authController.currentAuthenticatedUser);

export const authRouter = router;