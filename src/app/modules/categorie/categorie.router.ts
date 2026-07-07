import { Router } from "express";
import { categoryController } from "./categorie.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";

const router = Router();

router.post('/', auth(Role.admin), categoryController.createCategory)
router.get('/', categoryController.getAllCategories)
router.get('/:id', categoryController.getSingleCategory)
router.patch('/:id', auth(Role.admin), categoryController.updateCategory)

export const categoryRouter = router;