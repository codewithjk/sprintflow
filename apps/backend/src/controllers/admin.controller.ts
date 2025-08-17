import { NextFunction, Request, Response } from "express";
import { PrismaUserRepository } from "../../../../libs/infrastructure/prisma/user.repository";
import { GetAllUsersUseCase } from "../../../../libs/application/use-cases/user/get-all-users.usecase";
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum";
import { Messages } from "../../../../libs/shared/constants/messages";
import { PrismaOrganizationRepository } from "../../../../libs/infrastructure/prisma/org.repository";
import { GetAllOrganizationUseCase } from "../../../../libs/application/use-cases/organization/get-all-organization.usecase";
import { StripeService } from "../../../../libs/infrastructure/stripe/stripe.service";
import { UpdateUserUseCase } from "../../../../libs/application/use-cases/user/update-user.usecase";



export const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const userRepo = new PrismaUserRepository();
    const useCase = new GetAllUsersUseCase(userRepo);
    const result = await useCase.execute(
      filters,
      Number(page),
      Number(limit)
    );
    const { users, ...rest } = result;
    res.status(HttpStatus.OK).json({ message: Messages.USERS_FOUND, users, ...rest });

  } catch (err) {
    next(err);
  }
}

export const updateUserStatusController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userRepo = new PrismaUserRepository();
    const useCase = new UpdateUserUseCase(userRepo);
    const user = await useCase.execute({id, data:{status}} );
    
    res.status(HttpStatus.OK).json({ message: Messages.USER_UPDATED, user });

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
    const { page = 1, limit = 10, ...rawFilters } = req.query;
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

    res.status(HttpStatus.OK).json({ message: Messages.ORG_FOUND, ...result });
  } catch (error) {
    next(error);
  }
};

export const getChargesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const startingAfter = req.query.starting_after as string;

    const stripeService = new StripeService();
    const result = await stripeService.getCharges(limit, startingAfter);

    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
}

export const getSubscriptionsController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const startingAfter = req.query.starting_after as string;

    const stripeService = new StripeService();
    const result = await stripeService.getSubscriptions(limit, startingAfter);

    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
}

export const getRevenueController = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const stripeService = new StripeService();
    const result = await stripeService.getTotalRevenue();

    res.status(HttpStatus.OK).json({totalRevenue : result});
  } catch (error) {
    next(error);
  }
}





