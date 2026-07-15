import { Router } from "express";
import { reviewController } from "./review.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

router.post("/", auth(Role.customer), reviewController.createReview);

export const reviewRouter = router;
