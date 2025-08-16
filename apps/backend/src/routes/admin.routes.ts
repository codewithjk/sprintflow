import express from "express";
import { getAllOrganizationsController, getAllUsersController, getChargesController, getRevenueController, getSubscriptionsController, updateUserStatusController } from "../controllers/admin.controller";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { AppUserRole } from "../../../../libs/shared/types/src";


const router = express.Router();


router.get("/users", authorizeRoles(AppUserRole.SUPER_ADMIN), getAllUsersController);
router.patch("/users/:id/status", authorizeRoles(AppUserRole.SUPER_ADMIN), updateUserStatusController);
router.get("/organizations",authorizeRoles(AppUserRole.SUPER_ADMIN), getAllOrganizationsController);
router.get("/charges",authorizeRoles(AppUserRole.SUPER_ADMIN), getChargesController);
router.get("/subscriptions",authorizeRoles(AppUserRole.SUPER_ADMIN), getSubscriptionsController);
router.get("/revenue",authorizeRoles(AppUserRole.SUPER_ADMIN), getRevenueController);

export default router;