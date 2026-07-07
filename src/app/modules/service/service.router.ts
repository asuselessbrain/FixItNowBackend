import { Router } from "express";
import { serviceController } from "./service.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router()

router.post("/", auth(Role.technician), serviceController.createService)

export const serviceRouter = router;