import { Router } from 'express';

import {
  createTaskController,
  getTaskController,
  updateTaskController,
  deleteTaskController,
  searchTasksController,
} from '../controllers/task.controller';
import isAuthenticated from '../middlewares/is-authenticated.middleware';

const router = Router();
router.use(isAuthenticated);

router.post('/', createTaskController);
router.get('/', searchTasksController); // with filters
router.get('/:id', getTaskController);
router.put('/:id', updateTaskController);
router.delete('/:id', deleteTaskController);

export default router;
