import express from "express";
import { getAllOrganizationsController, getAllUsersController } from "../controllers/admin.controller";


const router = express.Router();


router.get("/users", getAllUsersController);
router.get("/organizations", getAllOrganizationsController);


export default router;