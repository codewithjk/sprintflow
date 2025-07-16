import express from 'express';
import { createOrganizationController, deleteOrganizationController, getOrganizationController, inviteUserToOrgController, updateOrganizationController } from '../controllers/org.controller';
import isAuthenticated from '../middlewares/is-authenticated.middleware';
import { authorizeRoles } from '../middlewares/authorize-roles.middleware';
import { AppUserRole } from '../../../../libs/shared/types/src';


const router = express.Router();
router.use(isAuthenticated)
router.post('/', createOrganizationController);

router.post('/invite', inviteUserToOrgController);
router.put('/:id', updateOrganizationController);
router.delete('/:id', authorizeRoles(AppUserRole.ORGANIZATION),deleteOrganizationController);
router.get('/:id', getOrganizationController);

export default router;
