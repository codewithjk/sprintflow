import { NextFunction, Response } from "express";
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum";
import { Messages } from "../../../../libs/shared/constants/messages";
import { getUserByIdUseCase } from "../di";



// //get logged in user
export const getUserController = async (req: any, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const user = await getUserByIdUseCase.execute(id);
        res.status(HttpStatus.OK).json({message : Messages.USERS_FOUND,user})
    } catch (error) {
        return next(error)
    }
}