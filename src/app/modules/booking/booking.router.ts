import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.customer), bookingController.createBooking)
router.patch("/:bookingId/accept", auth(Role.technician), bookingController.acceptBooking)
router.patch("/:bookingId/reject", auth(Role.technician), bookingController.rejectBooking)
router.patch("/:bookingId/complete", auth(Role.technician), bookingController.completeBooking)
router.patch("/:bookingId/cancel-by-technician", auth(Role.technician), bookingController.cancelBookingByTechnician)
router.patch("/:bookingId/cancel-by-customer", auth(Role.customer), bookingController.cancelBookingByCustomer)

export const bookingRouter = router;