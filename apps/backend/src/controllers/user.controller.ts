import { NextFunction, Response } from "express";
import { GetUserByIdUseCase } from "../../../../libs/application/use-cases/user/get-user-by-id.usecase";
import { PrismaUserRepository } from "../../../../libs/infrastructure/prisma/user.repository";
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum";
import { Messages } from "../../../../libs/shared/constants/messages";



// //get logged in user
export const getUserController = async (req: any, res: Response, next: NextFunction) => {
    console.log("request reached")
    try {
        const id = req.params.id;
        const userRepo = new PrismaUserRepository()
        const useCase = new GetUserByIdUseCase(userRepo);
        const user = await useCase.execute(id);
        res.status(HttpStatus.OK).json({message : Messages.USERS_FOUND,user})
    } catch (error) {
        return next(error)
    }
}