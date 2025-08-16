import { Router } from 'express';
import { loginAdminController, loginUserController, logoutController, refreshTokenController, signupController, verifyUserController } from '../controllers/auth.controller';
import { getUserController } from '../controllers/user.controller';
import isAuthenticated from '../middlewares/is-authenticated.middleware';
import { authorizeRoles } from '../middlewares/authorize-roles.middleware';
import { acceptInvitationController, createOrganizationController, loginOrgController, verifyOrgController } from '../controllers/org.controller';
import { AppUserRole } from '../../../../libs/shared/types/src';

const router = Router();
router.post('/signup', signupController);
router.post('/verify', verifyUserController);
router.post('/login', loginUserController);
router.post('/logout',isAuthenticated, logoutController);
router.post('/refresh',isAuthenticated, refreshTokenController);
router.post('/org/signup', createOrganizationController);
router.post('/org/login',loginOrgController)
router.post('/org/verify', verifyOrgController);

router.post('/admin/login', loginAdminController);



router.post('/verify/invitation', acceptInvitationController);

router.get('/get-user/:id',isAuthenticated,authorizeRoles(AppUserRole.USER), getUserController)
export default router;
