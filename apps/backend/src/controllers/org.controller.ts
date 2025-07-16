import { NextFunction, Request, Response } from "express";
import { CreateOrganizationUseCase } from "../../../../libs/application/use-cases/organization/create-organization.usecase";
import { PrismaOrganizationRepository } from "../../../../libs/infrastructure/prisma/org.repository";
import { PrismaUserRepository } from "../../../../libs/infrastructure/prisma/user.repository";
import { ValidationError } from "../../../../libs/shared/errors/app-error";
import { Messages } from "../../../../libs/shared/constants/messages";
import { DeleteOrganizationUseCase } from "../../../../libs/application/use-cases/organization/delete-organization.usecase";
import { GetOrganizationUseCase } from "../../../../libs/application/use-cases/organization/get-organization.usecase";
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum";
import { Organization } from "../../../../libs/domain/entities/organization.entity";
import { UpdateOrganizationUseCase } from "../../../../libs/application/use-cases/organization/update-organization.usecase";


export const createOrganizationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const { user } = req;

        if (!name) throw new ValidationError(Messages.MISSING_FIELDS);
        const orgRepo = new PrismaOrganizationRepository();
        const userRepo = new PrismaUserRepository();
        const useCase = new CreateOrganizationUseCase(orgRepo, userRepo);
        const org = await useCase.execute({ name, ownerId: user.id });
        res.status(HttpStatus.CREATED).json({ message: Messages.ORG_CREATED, org });
    } catch (error) {
        next(error);
    }
};


export const inviteUserToOrgController = async (req: Request, res: Response, next: NextFunction) => {
    //todo
}

export const updateOrganizationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const idParam = req.params.id;
        const body = req.body;
        const userId = req.user.id;
        if (typeof idParam !== 'string') {
            throw new ValidationError(Messages.INVALID_PARAMS);
        }
        //validate body
        if ((body && Object.entries(body).length === 0) || !body) {
            throw new ValidationError(Messages.MISSING_FIELDS);
        }
        const data : Partial<Organization> = body;
        const id: string = idParam;
        const orgRepo = new PrismaOrganizationRepository();
        const useCase = new UpdateOrganizationUseCase(orgRepo);
        const org = await useCase.execute({id,userId,data})
        res.status(HttpStatus.OK).json({ message: Messages.ORG_UPDATED,org })
    } catch (error) {
        next(error)
    }
}

export const deleteOrganizationController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const idParam = req.params.id;
        if (typeof idParam !== 'string') {
            throw new ValidationError(Messages.INVALID_PARAMS);
        }
        const id: string = idParam;
        const ownerId = req.user.id;
        const userRepo = new PrismaUserRepository();
        const orgRepo = new PrismaOrganizationRepository();
        const useCase = new DeleteOrganizationUseCase(orgRepo, userRepo);
        await useCase.execute({ id, ownerId });
        res.status(HttpStatus.OK).json({ message: Messages.ORG_DELETED })
    } catch (error) {
        next(error)
    }
}
export const getOrganizationController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const idParam = req.params.id;
        if (typeof idParam !== 'string') {
            throw new ValidationError(Messages.INVALID_PARAMS);
        }
        const id: string = idParam;
        const orgRepo = new PrismaOrganizationRepository();
        const useCase = new GetOrganizationUseCase(orgRepo);
        const org = await useCase.execute(id);
        res.status(HttpStatus.OK).json({ message: Messages.ORG_FOUND, org })
    } catch (error) {
        next(error)
    }
}