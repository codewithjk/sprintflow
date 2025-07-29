import { Router } from 'express';
import { loginUserController, logoutUserController, refreshTokenController, signupController, verifyUserController } from '../controllers/auth.controller';
import { getUserController } from '../controllers/user.controller';
import isAuthenticated from '../middlewares/is-authenticated.middleware';
import { authorizeRoles } from '../middlewares/authorize-roles.middleware';
import { acceptInvitationController, createOrganizationController, loginOrgController, verifyOrgController } from '../controllers/org.controller';
import { Roles } from '../types';

const router = Router();
router.post('/signup', signupController);
router.post('/verify', verifyUserController);
router.post('/login', loginUserController);
router.post('/logout',logoutUserController)
router.post('/refresh', refreshTokenController);
router.post('/org/signup', createOrganizationController);
router.post('/org/login',loginOrgController)
router.post('/org/verify', verifyOrgController);

router.post('/verify/invitation', acceptInvitationController);

router.get('/get-user',isAuthenticated,authorizeRoles(Roles.user), getUserController)
export default router;
