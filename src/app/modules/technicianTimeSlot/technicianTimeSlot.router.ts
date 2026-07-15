import { Router } from "express";
import { technicianTimeSlotController } from "./technicianTimeSlot.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../../middlewares/validateRequest";
import { technicianTimeSlotValidations } from "./technicianTimeSlot.validation";

const router = Router()

router.post("/", auth(Role.technician), validateRequest(technicianTimeSlotValidations.createOrUpdateTimeSlotValidationSchema), technicianTimeSlotController.createTechnicianTimeSlots)
router.put("/", auth(Role.technician), validateRequest(technicianTimeSlotValidations.createOrUpdateTimeSlotValidationSchema), technicianTimeSlotController.updateTechnicianTimeSlots)

export const technicianTimeSlotRouter = router;