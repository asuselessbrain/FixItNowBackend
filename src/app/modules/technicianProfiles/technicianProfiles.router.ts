import { Router } from "express";
import { technicianProfilesController } from "./technicianProfiles.controller";

const router = Router();

router.get("/", technicianProfilesController.getAllTechnicianProfiles)

export const technicianRouter = router;