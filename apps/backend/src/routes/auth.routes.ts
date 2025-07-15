import { Router } from 'express';
import { loginUserController, refreshTokenController, signupController, verifyUserController } from '../controllers/auth.controller';
import { getUserController } from '../controllers/user.controller';
import isAuthenticated from '../middlewares/is-authenticated.middleware';

const router = Router();
router.post('/signup', signupController);
router.post('/verify', verifyUserController);
router.post('/login', loginUserController);
router.post('/refresh', refreshTokenController);

router.get('/get-user',isAuthenticated, getUserController)
export default router;
