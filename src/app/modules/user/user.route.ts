import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

router.post("/", userController.createUser)
router.get("/", auth(Role.admin), userController.getAllUsers)
router.patch("/:userId/status", auth(Role.admin), userController.updateUserStatus)

export const userRouter = router;