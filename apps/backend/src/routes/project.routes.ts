import express from "express"
import { createProjectController, deleteProjectController, getAllProjectController, getProjectController, searchProjectsController, updateProjectController } from "../controllers/project.controller";
import { authorizeRoles } from "../middlewares/authorize-roles.middleware";
import { AppUserRole } from "../../../../libs/shared/types/src";
const router = express.Router();


router.post('/',authorizeRoles(AppUserRole.ORGANIZATION), createProjectController);
router.get('/search/', searchProjectsController);
router.get('/',getAllProjectController)
router.get('/:id', getProjectController);
router.put('/:id', authorizeRoles(AppUserRole.ORGANIZATION),updateProjectController);
router.delete('/:id',authorizeRoles(AppUserRole.ORGANIZATION), deleteProjectController);

export default router;