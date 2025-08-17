import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum";
import { Messages } from "../../../../libs/shared/constants/messages";
import { getAllOrganizationsUseCase, getAllUsersUseCase, stripeService, updateUserUseCase } from "../di";



export const getAllUsersController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, ...filters } = req.query;
    const result = await getAllUsersUseCase.execute(
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
    const user = await updateUserUseCase.execute({id, data:{status}} );
    
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

    const result = await getAllOrganizationsUseCase.execute(
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

    const result = await stripeService.getSubscriptions(limit, startingAfter);

    res.status(HttpStatus.OK).json(result);
  } catch (error) {
    next(error);
  }
}

export const getRevenueController = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const result = await stripeService.getTotalRevenue();

    res.status(HttpStatus.OK).json({totalRevenue : result});
  } catch (error) {
    next(error);
  }
}





