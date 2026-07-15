import { Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../../middlewares/validateRequest";
import { bookingValidations } from "./booking.validation";

const router = Router();

router.post("/", auth(Role.customer), validateRequest(bookingValidations.createBookingValidationSchema), bookingController.createBooking)
router.get("/", auth(Role.admin), bookingController.getAllBookings)
router.get("/my-bookings", auth(Role.customer), bookingController.getMyBookings)
router.get("/technician-bookings", auth(Role.technician), bookingController.getTechnicianBookings)
router.get("/:bookingId", auth(Role.customer, Role.technician, Role.admin), bookingController.getSingleBooking)
router.patch("/:bookingId/accept", auth(Role.technician), bookingController.acceptBooking)
router.patch("/:bookingId/reject", auth(Role.technician), bookingController.rejectBooking)
router.patch("/:bookingId/in-progress", auth(Role.technician), bookingController.inProgressBooking)
router.patch("/:bookingId/complete", auth(Role.technician), bookingController.completeBooking)
router.patch("/:bookingId/cancel-by-technician", auth(Role.technician), bookingController.cancelBookingByTechnician)
router.patch("/:bookingId/cancel-by-customer", auth(Role.customer), bookingController.cancelBookingByCustomer)

export const bookingRouter = router;