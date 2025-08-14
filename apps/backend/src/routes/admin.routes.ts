import express from "express";
import { getAllOrganizationsController, getAllUsersController, getChargesController, getRevenueController, getSubscriptionsController } from "../controllers/admin.controller";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { Roles } from "../types";


const router = express.Router();


router.get("/users",authorizeRoles(Roles.super_admin), getAllUsersController);
router.get("/organizations",authorizeRoles(Roles.super_admin), getAllOrganizationsController);
router.get("/charges",authorizeRoles(Roles.super_admin), getChargesController);
router.get("/subscriptions",authorizeRoles(Roles.super_admin), getSubscriptionsController);
router.get("/revenue",authorizeRoles(Roles.super_admin), getRevenueController);

export default router;