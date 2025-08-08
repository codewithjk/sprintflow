import express from "express";
import { getAllOrganizationsController, getAllUsersController, getChargesController, getRevenueController, getSubscriptionsController } from "../controllers/admin.controller";


const router = express.Router();


router.get("/users", getAllUsersController);
router.get("/organizations", getAllOrganizationsController);
router.get("/charges", getChargesController);
router.get("/subscriptions", getSubscriptionsController);
router.get("/revenue", getRevenueController);

export default router;