import { NextFunction, Response } from "express";

// //get logged in user
export const getUserController = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        res.status(200).json({
            success: true,
            user,
        })
    } catch (error) {
        return next(error)
    }
}