import { Router } from "express";
import { paymentController } from "./payment.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router()

router.post("/checkout-session", auth(Role.customer), paymentController.createPayment)
router.get("/history", auth(Role.customer), paymentController.getMyPaymentHistory)
router.get("/:paymentId", auth(Role.customer, Role.admin), paymentController.getSinglePayment)
router.post("/webhook", paymentController.handleWebhook)
export const paymentRouter = router;