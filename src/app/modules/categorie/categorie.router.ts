import { Router } from "express";
import { categoryController } from "./categorie.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

router.post('/', auth(Role.admin), categoryController.createCategory)

export const categoryRouter = router;