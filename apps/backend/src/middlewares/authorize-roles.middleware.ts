import { NextFunction, Request, Response } from "express"
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum"
import { Messages } from "../../../../libs/shared/constants/messages"
import { Roles } from "../types"


export const authorizeRoles = (...allowedRoles: Roles[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!allowedRoles.includes(req.role)) {
            return res.status(HttpStatus.FORBIDDEN).json({message:Messages.FORBIDDEN})
        }
        return next();
    }
}

