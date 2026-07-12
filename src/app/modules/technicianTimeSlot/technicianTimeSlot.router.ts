import { Router } from "express";
import { technicianTimeSlotController } from "./technicianTimeSlot.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router()

router.post("/", auth(Role.technician), technicianTimeSlotController.createTechnicianTimeSlots)

export const technicianTimeSlotRouter = router;