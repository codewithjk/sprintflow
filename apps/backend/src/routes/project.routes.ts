import express from "express"
import { createProjectController, deleteProjectController, getAllProjectController, getProjectController, searchProjectsController, updateProjectController } from "../controllers/project.controller";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { Roles } from "../types";
const router = express.Router();


router.post('/',authorizeRoles(Roles.organization), createProjectController);
router.get('/search/', searchProjectsController);
router.get('/',getAllProjectController)
router.get('/:id', getProjectController);
router.put('/:id', authorizeRoles(Roles.organization),updateProjectController);
router.delete('/:id',authorizeRoles(Roles.organization), deleteProjectController);

export default router;