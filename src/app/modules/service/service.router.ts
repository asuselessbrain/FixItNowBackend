import { Router } from "express";
import { serviceController } from "./service.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../../middlewares/validateRequest";
import { serviceValidations } from "./service.validation";

const router = Router()

router.post("/", auth(Role.technician), validateRequest(serviceValidations.createServiceValidationSchema), serviceController.createService)
router.get("/", serviceController.getAllServices)
router.get("/my-added-services", auth(Role.technician), serviceController.getMyAddedServices)
router.get("/:id", serviceController.getSingleService)
router.patch("/:id", auth(Role.technician), validateRequest(serviceValidations.updateServiceValidationSchema), serviceController.updateService)

export const serviceRouter = router;