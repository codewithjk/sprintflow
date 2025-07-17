import express from 'express';
import { createOrganizationController, deleteOrganizationController, getOrganizationController, inviteUserToOrgController, searchOrganizationsController, updateOrganizationController } from '../controllers/org.controller';
import isAuthenticated from '../middlewares/is-authenticated.middleware';
import { authorizeRoles } from '../middlewares/authorize-roles.middleware';
import { AppOrganizationRole } from '@prisma/client';


const router = express.Router();
router.use(isAuthenticated)
router.post('/', createOrganizationController);
router.get('/',searchOrganizationsController),
router.post('/invite', inviteUserToOrgController);
router.put('/:id', updateOrganizationController);
router.delete('/:id', authorizeRoles(AppOrganizationRole.organization),deleteOrganizationController);
router.get('/:id', getOrganizationController);

export default router;
