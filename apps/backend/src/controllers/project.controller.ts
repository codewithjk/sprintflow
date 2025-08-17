import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../../../libs/shared/errors/app-error";
import { Messages } from "../../../../libs/shared/constants/messages";
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum";
import { CreateProjectDTO } from "../../../../libs/shared/types/src";
import { Project } from "../../../../libs/domain/entities/project.entity";
import { createProjectUseCase, deleteProjectUseCase, getAllProjectsUseCase, getProjectUseCase, searchProjectsUseCase, updateProjectUseCase } from "../di";

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
        const newProject = await createProjectUseCase.execute(data);
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
        const project = await updateProjectUseCase.execute({ id, data, orgId })
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
        await deleteProjectUseCase.execute({ id, orgId });
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
        const project = await getProjectUseCase.execute(id);
        res.status(HttpStatus.OK).json({ message: Messages.PROJECT_FOUND, project })
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

        const result = await searchProjectsUseCase.execute({
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


export const getAllProjectController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page = 1, limit = 10, ...rawFilters } = req.query;
        const result = await getAllProjectsUseCase.execute(
            rawFilters,
            Number(page),
            Number(limit)
        );
        res.status(HttpStatus.OK).json(result)

    } catch (err) {
        next(err);
    }
}