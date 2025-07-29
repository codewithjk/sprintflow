import express from 'express';
import {  deleteOrganizationController, getAllMembersController, getOrganizationController, inviteUserToOrgController, searchOrganizationsController, updateOrganizationController } from '../controllers/org.controller';

import { authorizeRoles } from '../middlewares/authorize-roles.middleware';
import { Roles } from '../types';


const router = express.Router();
router.get('/', searchOrganizationsController);
router.post('/invite', authorizeRoles(Roles.organization), inviteUserToOrgController);
router.get('/members',authorizeRoles(Roles.organization),getAllMembersController)
router.put('/:id',authorizeRoles(Roles.organization), updateOrganizationController);
router.delete('/:id', authorizeRoles(Roles.organization),deleteOrganizationController);
router.get('/:id', getOrganizationController);



export default router;
