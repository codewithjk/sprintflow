import { Router } from 'express';
import { loginUserController, refreshTokenController, signupController, verifyUserController } from '../controllers/auth.controller';
import { getUserController } from '../controllers/user.controller';
import isAuthenticated from '../middlewares/is-authenticated.middleware';
import { authorizeRoles } from '../middlewares/authorize-roles.middleware';
import { createOrganizationController, loginOrgController, verifyOrgController } from '../controllers/org.controller';

const router = Router();
router.post('/signup', signupController);
router.post('/verify', verifyUserController);
router.post('/login', loginUserController);
router.post('/refresh', refreshTokenController);
router.post('/org/signup', createOrganizationController);
router.post('/org/login',loginOrgController)
router.post('/org/verify', verifyOrgController);

router.get('/get-user',isAuthenticated,authorizeRoles("user","organization"), getUserController)
export default router;
