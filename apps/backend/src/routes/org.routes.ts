import express from 'express';
import {  deleteOrganizationController, getAllMembersController, getOrganizationController, inviteUserToOrgController, searchOrganizationsController, updateMemberController, updateOrganizationController } from '../controllers/org.controller';

import { authorizeRoles } from '../middlewares/authorize-roles.middleware';

import { AppUserRole } from '../../../../libs/shared/types/src';


const router = express.Router();
router.get('/', searchOrganizationsController);
router.post('/invite', authorizeRoles(AppUserRole.ORGANIZATION), inviteUserToOrgController);
router.get('/members', authorizeRoles(AppUserRole.ORGANIZATION), getAllMembersController)
router.put('/members/:id',authorizeRoles(AppUserRole.USER),updateMemberController)
router.put('/:id',authorizeRoles(AppUserRole.ORGANIZATION), updateOrganizationController);
router.delete('/:id', authorizeRoles(AppUserRole.ORGANIZATION),deleteOrganizationController);
router.get('/:id', getOrganizationController);





export default router;
