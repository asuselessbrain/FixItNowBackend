import { Router } from "express";
import { technicianTimeSlotController } from "./technicianTimeSlot.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router()

router.post("/", auth(Role.technician), technicianTimeSlotController.createTechnicianTimeSlots)
router.put("/", auth(Role.technician), technicianTimeSlotController.updateTechnicianTimeSlots)

export const technicianTimeSlotRouter = router;