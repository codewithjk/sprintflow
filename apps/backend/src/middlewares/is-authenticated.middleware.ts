import { NextFunction, Response } from "express";
import { JwtService } from "../../../../libs/infrastructure/jwt/jwt.service";
import { JWT_TOKEN_SECRET } from "../../../../libs/shared/constants/env-constants";
import { Messages } from "../../../../libs/shared/constants/messages";
import { HttpStatus } from "../../../../libs/shared/constants/http-status.enum";
import { PrismaUserRepository } from "../../../../libs/infrastructure/prisma/user.repository";
import { PrismaOrganizationRepository } from "../../../../libs/infrastructure/prisma/org.repository";
import { TokenNames } from "../../../../libs/shared/constants/jwt-token-constants";
import { AppUserRole } from "../../../../libs/shared/types/src";

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {

    try {
        const jwtService = new JwtService(JWT_TOKEN_SECRET);
        const userRepository = new PrismaUserRepository();
        const orgRepository = new PrismaOrganizationRepository();


         // Check for possible access token names in cookies
        const possibleAccessTokens = [
            TokenNames.USER_ACCESS_TOKEN,
            TokenNames.ORG_ACCESS_TOKEN,
            TokenNames.SUPER_ADMIN_ACCESS_TOKEN,
        ];

        let token: string | undefined;

        // Search for token in known access token cookies
        for (const name of possibleAccessTokens) {
            if (req.cookies[name]) {
                token = req.cookies[name];
                break;
            }
        }

        // Fallback: Authorization header
        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.JWT_TOKEN_MISSING })
        }

        const decoded = jwtService.verify(token);


        if (!decoded) {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.JWT_TOKEN_INVALID })
        }
        switch (decoded.role) {
            case AppUserRole.ORGANIZATION: {
                const org = await orgRepository.findById(decoded.id);
                if (!org) {
                    return res
                        .status(HttpStatus.UNAUTHORIZED)
                        .json({ message: Messages.ORG_NOT_FOUND });
                }
                req.organization = org;
                break;
            }

            case AppUserRole.USER: {
                const user = await userRepository.findById(decoded.id);
                if (!user) {
                    return res
                        .status(HttpStatus.UNAUTHORIZED)
                        .json({ message: Messages.USER_NOT_FOUND });
                }
                req.user = user
                break;
            }

            case AppUserRole.SUPER_ADMIN: {
                const admin = await userRepository.findById(decoded.id);
                if (!admin) {
                    return res
                        .status(HttpStatus.UNAUTHORIZED)
                        .json({ message: Messages.USER_NOT_FOUND });
                }
                req.super_admin = admin;
                break;
            }

            default:
                return res
                    .status(HttpStatus.UNAUTHORIZED)
                    .json({ message: Messages.JWT_TOKEN_INVALID });
        }

        req.role = decoded.role;
        return next();
    } catch (error) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.JWT_TOKEN_EXPIRED })
    }
}
export default isAuthenticated;