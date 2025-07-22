import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../../libs/shared/errors/app-error";
import { Messages } from "../../../../libs/shared/constants/messages";
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum";
import { CreateProjectDTO } from "../../../../libs/shared/types/src";
import { PrismaProjectRepository } from "../../../../libs/infrastructure/prisma/project.repository";
import { CreateProjectUseCase } from "../../../../libs/application/use-cases/project/create-project.usecase";
import { Project } from "../../../../libs/domain/entities/project.entity";
import { UpdateProjectUseCase } from "../../../../libs/application/use-cases/project/update-project.usecase";
import { DeleteProjectUseCase } from "../../../../libs/application/use-cases/project/delete-project.usecase";
import { GetProjectUseCase } from "../../../../libs/application/use-cases/project/get-project.usecase";
import { SearchProjectsUseCase } from "../../../../libs/application/use-cases/project/search-project.usecase";

export const createProjectController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, startDate, endDate }: CreateProjectDTO = req.body;
        const orgId = req.organization.id;
        if (!name || !description) throw new ValidationError(Messages.MISSING_FIELDS);

        const data: CreateProjectDTO = {
            name,
            orgId,
            startDate,
            endDate,
            description,
        }
        const projectRepo = new PrismaProjectRepository();

        const useCase = new CreateProjectUseCase(projectRepo);
        const newProject = await useCase.execute(data);
        res.status(HttpStatus.CREATED).json({ message: Messages.PROJECT_CREATED, project: newProject })
    } catch (error) {
        next(error);
    }
};


export const updateProjectController = async (req: Request, res: Response, next: NextFunction) => {
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
        const data: Partial<Project> = body;
        const id: string = idParam;
        const projectRepo = new PrismaProjectRepository();
        const useCase = new UpdateProjectUseCase(projectRepo);
        const project = await useCase.execute({ id, data, orgId })
        res.status(HttpStatus.OK).json({ message: Messages.PROJECT_UPDATED, project })
    } catch (error) {
        next(error)
    }
}

export const deleteProjectController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const idParam = req.params.id;
        if (typeof idParam !== 'string') {
            throw new ValidationError(Messages.INVALID_PARAMS);
        }
        const id: string = idParam;
        const orgId = req.organization.id;
        const projectRepo = new PrismaProjectRepository();
        const useCase = new DeleteProjectUseCase(projectRepo)
        await useCase.execute({ id, orgId });
        res.status(HttpStatus.OK).json({ message: Messages.PROJECT_DELETED })
    } catch (error) {
        next(error)
    }
}
export const getProjectController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const idParam = req.params.id;
        if (typeof idParam !== 'string') {
            throw new ValidationError(Messages.INVALID_PARAMS);
        }
        const id: string = idParam;
        const projectRepo = new PrismaProjectRepository();
        const useCase = new GetProjectUseCase(projectRepo);
        const org = await useCase.execute(id);
        res.status(HttpStatus.OK).json({ message: Messages.PROJECT_FOUND, org })
    } catch (error) {
        next(error)
    }
}

export const searchProjectsController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;
        if (!search) {
            throw new ValidationError(Messages.INVALID_PARAMS);
        }
        const orgId = req.organization.id;
        const projectRepo = new PrismaProjectRepository();
        const useCase = new SearchProjectsUseCase(projectRepo);

        const result = await useCase.execute({
            search: String(search),
            orgId,
            page: Number(page),
            limit: Number(limit),
        });

        res.status(HttpStatus.OK).json(result);
    } catch (error) {
        next(error);
    }
};
