import { Router } from "express";
import { technicianProfilesController } from "./technicianProfiles.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../../middlewares/validateRequest";
import { technicianProfileValidations } from "./technicianProfiles.validation";

const router = Router();

router.get("/", technicianProfilesController.getAllTechnicianProfiles)
router.get("/generate-time-slots", auth(Role.technician), technicianProfilesController.generateTimeSlots)
router.get("/:id", technicianProfilesController.getSingleTechnicianProfile)
router.patch("/", auth(Role.technician), validateRequest(technicianProfileValidations.updateTechnicianProfileValidationSchema), technicianProfilesController.updateTechnicianProfile)


export const technicianRouter = router;