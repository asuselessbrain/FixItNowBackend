import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../../middlewares/validateRequest";
import { reviewValidations } from "./review.validation";

const router = Router();

router.post("/", auth(Role.customer), validateRequest(reviewValidations.createReviewValidationSchema), reviewController.createReview);

export const reviewRouter = router;
