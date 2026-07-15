import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../../middlewares/validateRequest";
import { userValidations } from "./user.validation";

const router = Router();

router.post("/", validateRequest(userValidations.createUserValidationSchema), userController.createUser)
router.get("/", auth(Role.admin), userController.getAllUsers)
router.patch("/:userId/status", auth(Role.admin), validateRequest(userValidations.updateUserStatusValidationSchema), userController.updateUserStatus)

export const userRouter = router;