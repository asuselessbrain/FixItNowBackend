import { Router } from "express";
import { technicianProfilesController } from "./technicianProfiles.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

router.get("/", technicianProfilesController.getAllTechnicianProfiles)
router.get("/:id", technicianProfilesController.getSingleTechnicianProfile)

export const technicianRouter = router;