import { Request, Response, NextFunction } from 'express';

import { Messages } from '../../../../libs/shared/constants/messages';
import { ValidationError } from '../../../../libs/shared/errors/app-error';
import { HttpStatus } from '../../../../libs/shared/constants/http-status.enum';
import { TaskProps } from '../../../../libs/domain/entities/task.entity';
import { createTaskUseCase, deleteTaskUseCase, getAllTasksUseCase, getTaskUseCase, searchTaskUseCase, updateTaskUseCase } from '../di';


export const createTaskController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, startDate, endDate, assignedUserId, } = req.body;
    if (!title || !description || !startDate || !endDate || !assignedUserId) throw new ValidationError(Messages.MISSING_FIELDS);
    const orgId = req.organization.id;
    const task = await createTaskUseCase.execute({ ...req.body, orgId, createdAt: new Date(), updatedAt: new Date() });
    res.status(HttpStatus.CREATED).json({ task: task.toDTO() });
  } catch (err) {
    next(err);
  }
};

export const getTaskController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await getTaskUseCase.execute(req.params.id);
    res.status(HttpStatus.OK).json({ message: Messages.TASK_FOUND, task });
  } catch (err) {
    next(err);
  }
};

export const updateTaskController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idParam = req.params.id;
    const body = req.body;
    const orgId = req.organization?.id;
    const userId = req.user?.id;
    const updaterId = orgId ?? userId;
    if (typeof idParam !== 'string') {
      throw new ValidationError(Messages.INVALID_PARAMS);
    }
    //validate body
    if ((body && Object.entries(body).length === 0) || !body) {
      throw new ValidationError(Messages.MISSING_FIELDS);
    }
    const data: Partial<TaskProps> = body;
    const id: string = idParam;
    const task = await updateTaskUseCase.execute({ id, data, updaterId });
    res.status(HttpStatus.OK).json({ message: Messages.TASK_UPDATED, task });
  } catch (err) {
    next(err);
  }
};

export const deleteTaskController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idParam = req.params.id;
    const orgId = req.organization.id;
    await deleteTaskUseCase.execute({ id: idParam, orgId });
    res.status(HttpStatus.OK).json({ message: Messages.TASK_DELETED });
  } catch (err) {
    next(err);
  }
};

export const searchTasksController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    if (!search) {
      throw new ValidationError(Messages.INVALID_PARAMS);
    }
    const orgId = req.organization.id;
    const result = await searchTaskUseCase.execute({
      search: String(search),
      orgId,
      page: Number(page),
      limit: Number(limit),
    });
    res.status(HttpStatus.OK).json(result)

  } catch (err) {
    next(err);
  }
};


export const getAllTasksController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, ...rawFilters } = req.query;
    const result = await getAllTasksUseCase.execute(
      rawFilters,
      Number(page),
      Number(limit)
    );
    res.status(HttpStatus.OK).json(result)

  } catch (err) {
    next(err);
  }
}