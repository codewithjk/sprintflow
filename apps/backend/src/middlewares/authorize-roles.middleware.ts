import { NextFunction, Request, Response } from "express"
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum"
import { Messages } from "../../../../libs/shared/constants/messages"
import { AppUserRole } from "../../../../libs/shared/types/src"


export const authorizeRoles = (...allowedRoles: AppUserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!allowedRoles.includes(req.role)) {
            return res.status(HttpStatus.FORBIDDEN).json({message:Messages.FORBIDDEN})
        }
        // authorize if organization member or creator
        if (req.params.orgId) {
            if (req.organization.id) {
                if (req.params.orgId !== req.organization.id) return res.status(HttpStatus.FORBIDDEN).json({ message: Messages.FORBIDDEN });
            }
            if (req.user.orgId) {
                if (req.params.orgId !== req.user.orgId) return res.status(HttpStatus.FORBIDDEN).json({ message: Messages.FORBIDDEN });
            }
        }
        return next();
    }
}

