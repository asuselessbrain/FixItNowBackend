import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.customer), bookingController.createBooking)
router.patch("/:bookingId/confirm", auth(Role.technician), bookingController.confirmBooking)
router.patch("/:bookingId/accept", auth(Role.technician), bookingController.acceptBooking)

export const bookingRouter = router;