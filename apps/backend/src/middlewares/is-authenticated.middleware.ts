import { NextFunction, Response } from "express";
import { JwtService } from "../../../../libs/infrastructure/jwt/jwt.service";
import { JWT_TOKEN_SECRET } from "../../../../libs/shared/constants/env-constants";
import { Messages } from "../../../../libs/shared/constants/messages";
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum";
import { PrismaUserRepository } from "../../../../libs/infrastructure/prisma/user.repository";

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
    console.log(req.cookies)
    try {
        const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.JWT_TOKEN_MISSING })
        }

        const jwtService = new JwtService(JWT_TOKEN_SECRET);
        const userRepository = new PrismaUserRepository();
        const decoded = jwtService.verify(token);
        console.log(decoded)

        if (!decoded) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.JWT_TOKEN_INVALID })
        }
        const user = await userRepository.findById(decoded.id);
        if (!user) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.USER_NOT_FOUND })
        }
        req.user = user.toDTO();
        return next();
    } catch (error) {
        console.log(error)
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.JWT_TOKEN_EXPIRED })
    }
}
export default isAuthenticated;