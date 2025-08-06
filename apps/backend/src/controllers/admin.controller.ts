import { NextFunction,Request,Response } from "express";
import { PrismaUserRepository } from "../../../../libs/infrastructure/prisma/user.repository";
import { GetAllUsersUseCase } from "../../../../libs/application/use-cases/user/get-all-users.usecase";
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum";
import { Messages } from "../../../../libs/shared/constants/messages";
import { PrismaOrganizationRepository } from "../../../../libs/infrastructure/prisma/org.repository";
import { GetAllOrganizationUseCase } from "../../../../libs/application/use-cases/organization/get-all-organization.usecase";



export const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10,...filters } = req.query;
    const userRepo = new PrismaUserRepository();
    const useCase = new GetAllUsersUseCase(userRepo);
    const result = await useCase.execute(
      filters,
      Number(page),
      Number(limit)
    );
    const { users, ...rest } = result;
    res.status(HttpStatus.OK).json({ message:Messages.USER_NOT_FOUND,users, ...rest });

  } catch (err) {
    next(err);
  }
}

export const getAllOrganizationsController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {  page = 1, limit = 10,...rawFilters } = req.query;
    // if (!search) {
    //   throw new ValidationError(Messages.INVALID_PARAMS);
    // }

    const orgRepo = new PrismaOrganizationRepository();
    const useCase = new GetAllOrganizationUseCase(orgRepo);

    const result = await useCase.execute(
      rawFilters,
 Number(page),
Number(limit),
    );

    res.status(HttpStatus.OK).json({ message:Messages.ORG_FOUND ,...result});
  } catch (error) {
    next(error);
  }
};