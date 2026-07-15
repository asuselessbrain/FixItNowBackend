import { Router } from "express";
import { categoryController } from "./categorie.controller";
import auth from "../../../middlewares/auth";
import { Role } from "../../../../prisma/generated/prisma/enums";
import { validateRequest } from "../../../middlewares/validateRequest";
import { categoryValidations } from "./categorie.validation";

const router = Router();

router.post('/', auth(Role.admin), validateRequest(categoryValidations.createCategoryValidationSchema), categoryController.createCategory)
router.get('/', categoryController.getAllCategories)
router.get('/:id', categoryController.getSingleCategory)
router.patch('/:id', auth(Role.admin), validateRequest(categoryValidations.updateCategoryValidationSchema), categoryController.updateCategory)
router.patch('/:id/toggle-status', auth(Role.admin), categoryController.toggleActiveStatus)

export const categoryRouter = router;