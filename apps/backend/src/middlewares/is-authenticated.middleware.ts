import { NextFunction, Response } from "express";
import { JwtService } from "../../../../libs/infrastructure/jwt/jwt.service";
import { JWT_TOKEN_SECRET } from "../../../../libs/shared/constants/env-constants";
import { Messages } from "../../../../libs/shared/constants/messages";
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum";
import { PrismaUserRepository } from "../../../../libs/infrastructure/prisma/user.repository";
import { PrismaOrganizationRepository } from "../../../../libs/infrastructure/prisma/org.repository";

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {

    try {
        const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.JWT_TOKEN_MISSING })
        }

        const jwtService = new JwtService(JWT_TOKEN_SECRET);
        const userRepository = new PrismaUserRepository();
        const orgRepository = new PrismaOrganizationRepository()
        const decoded = jwtService.verify(token);


        if (!decoded) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.JWT_TOKEN_INVALID })
        }
        if (decoded.role === "organization") {
            const org = orgRepository.findById(decoded.id);
            req.organization = org; 
        }
        if (decoded.role === "user") {
            const user = await userRepository.findById(decoded.id);
            if (!user) return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.USER_NOT_FOUND });
            req.user = user.toDTO();
        }
        if(decoded.role === "super_admin") {
            const admin = await userRepository.findById(decoded.id);
            if (!admin) return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.USER_NOT_FOUND });
            req.admin = admin.toDTO();
        }
        req.role = decoded.role;
        return next();
    } catch (error) {
        console.log(error)
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.JWT_TOKEN_EXPIRED })
    }
}
export default isAuthenticated;