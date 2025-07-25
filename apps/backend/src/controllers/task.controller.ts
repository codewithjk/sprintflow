import { Request, Response, NextFunction } from 'express';


import { CreateTaskUseCase } from '../../../../libs/application/use-cases/task/create-task.usecase';
import { GetTaskUseCase } from '../../../../libs/application/use-cases/task/get-task.usecase';
import { UpdateTaskUseCase } from '../../../../libs/application/use-cases/task/update-task.usecase';
import { DeleteTaskUseCase } from '../../../../libs/application/use-cases/task/delete-task.usecase';
import { PrismaTaskRepository } from '../../../../libs/infrastructure/prisma/task.repository';
import { Messages } from '../../../../libs/shared/constants/messages';
import { ValidationError } from '../../../../libs/shared/errors/app-error';
import { HttpStatus } from '../../../../libs/shared/constants/http-status.enum';
import { Task } from '../../../../libs/domain/entities/task.entity';
import { SearchTaskUseCase } from '../../../../libs/application/use-cases/task/search-task.usecase';

const taskRepo = new PrismaTaskRepository();

export const createTaskController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description,startDate,endDate,assignedUserId, } = req.body;
        if (!title || !description || !startDate||!endDate || !assignedUserId) throw new ValidationError(Messages.MISSING_FIELDS);
    const orgId = req.organization.id;
    const useCase = new CreateTaskUseCase(taskRepo);
    const task = await useCase.execute({ ...req.body, createdAt: new Date(), updatedAt: new Date() },orgId);
    res.status(HttpStatus.CREATED).json({ task: task.toDTO() });
  } catch (err) {
    next(err);
  }
};

export const getTaskController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const useCase = new GetTaskUseCase(taskRepo);
    const task = await useCase.execute(req.params.id);
    res.status(HttpStatus.OK).json({message:Messages.TASK_FOUND, task });
  } catch (err) {
    next(err);
  }
};

export const updateTaskController = async (req: Request, res: Response, next: NextFunction) => {
    try {
       const idParam = req.params.id;
               const body = req.body;
               const orgId = req.organization.id;
               if (typeof idParam !== 'string') {
                   throw new ValidationError(Messages.INVALID_PARAMS);
               }
               //validate body
               if ((body && Object.entries(body).length === 0) || !body) {
                   throw new ValidationError(Messages.MISSING_FIELDS);
               }
               const data: Partial<Task> = body;
               const id: string = idParam;
    const useCase = new UpdateTaskUseCase(taskRepo);
    const task = await useCase.execute({id , data,orgId});
    res.status(HttpStatus.OK).json({message:Messages.TASK_UPDATED, task });
  } catch (err) {
    next(err);
  }
};

export const deleteTaskController = async (req: Request, res: Response, next: NextFunction) => {
    try {
         const idParam = req.params.id;
               const orgId = req.organization.id;
      
    const useCase = new DeleteTaskUseCase(taskRepo);
    await useCase.execute({id:idParam,orgId});
    res.status(HttpStatus.OK).json({message:Messages.TASK_DELETED});
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
      const useCase = new SearchTaskUseCase(taskRepo);
    const result = await useCase.execute({  search: String(search),
            orgId,
            page: Number(page),
        limit: Number(limit),
    });
        res.status(HttpStatus.OK).json(result)
    
  } catch (err) {
    next(err);
  }
};
