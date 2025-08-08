import { NextFunction, Request, Response } from 'express';
import { PrismaUserRepository } from '../../../../libs/infrastructure/prisma/user.repository';

import { HttpStatus } from '../../../../libs/shared/constants/http-status.enum';
import { Messages } from '../../../../libs/shared/constants/messages';
import { SignupUseCase } from '../../../../libs/application/use-cases/auth/signup.usecase';
import { OtpService } from '../../../../libs/infrastructure/redis/otp.service';
import { EmailService } from '../../../../libs/infrastructure/email/email.service';
import path from 'path';
import { VerifyUserUseCase } from '../../../../libs/application/use-cases/auth/verify-user.usecase';
import { BcryptPasswordService } from '../../../../libs/infrastructure/bcrypt';
import { UnauthorizedError, ValidationError } from '../../../../libs/shared/errors/app-error';
import { LoginUseCase } from '../../../../libs/application/use-cases/auth/login.usecase';
import { JwtService } from '../../../../libs/infrastructure/jwt/jwt.service';
import { JWT_TOKEN_SECRET } from '../../../../libs/shared/constants/env-constants';
import { clearCookie, setCookie } from '../utils/cookies/setCookie';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRATION } from '../../../../libs/shared/constants/time-constants';
import { PrismaOrganizationRepository } from '../../../../libs/infrastructure/prisma/org.repository';


export const signupController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) {
      return next(new ValidationError("Missing required fields!"));
    }
    const userRepository = new PrismaUserRepository();
    const otpService = new OtpService()
    const templatePath = path.join(process.cwd(), 'apps', 'backend', 'src', 'utils', 'email-templates');
    const emailService = new EmailService(templatePath)

    const useCase = new SignupUseCase(userRepository, otpService, emailService);
    await useCase.execute({ email, name });
    res.status(HttpStatus.OK).json({ message: Messages.OTP_SENT });
  } catch (error: any) {
    next(error)
  }
};

//Verify OTP for user registration
export const verifyUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, password, name,orgId } = req.body;
    if (!email || !otp || !password || !name || !orgId) {
      return next(new ValidationError("Missing required fields!"));
    }
    const data = { email, otp, password, name,orgId }
    const userRepository = new PrismaUserRepository();
    const otpService = new OtpService()
    const passwordService = new BcryptPasswordService()
    const useCase = new VerifyUserUseCase(userRepository, otpService, passwordService);
    const newUser = await useCase.execute(data)
    res.status(HttpStatus.CREATED).json({
      message: Messages.USER_VERIFIED,
      user: newUser,
      status: "success"
    });

  } catch (error) {
    next(error);
  }
}

// login user
export const loginUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError(Messages.EMAIL_AND_PASSWORD_REQUIRED));
    }
    const userRepository = new PrismaUserRepository();
    const passwordService = new BcryptPasswordService()
    const jwtService = new JwtService(JWT_TOKEN_SECRET)

    const useCase = new LoginUseCase(userRepository, passwordService, jwtService);
    const data = await useCase.execute({ email, password }, "user")

    setCookie(res, "refresh_token", data.refreshToken);
    setCookie(res, "access_token", data.accessToken);
    res.status(HttpStatus.OK).json({
      message: Messages.LOGIN_SUCCESS,
      user: data.user,
      status: "success"
    });
  } catch (error) {
    next(error);
  }
}

// refresh token
export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {


  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken || refreshToken === undefined) {

      throw new ValidationError(Messages.JWT_TOKEN_MISSING)
    }
    const jwtService = new JwtService(JWT_TOKEN_SECRET);
    const userRepository = new PrismaUserRepository();
    const orgRepository = new PrismaOrganizationRepository();

    const decoded = jwtService.verify(refreshToken);

    if (!decoded || !decoded.id || !decoded.role) {
      return new JsonWebTokenError(Messages.JWT_TOKEN_MALFORMED);
    }
    let account;
    if (decoded.role === "user") {
      account = await userRepository.findById(decoded.id);
    }
    if (decoded.role === "organization") {
      account = await orgRepository.findById(decoded.id);
    }
    if (decoded.role === "super_admin") {
      account = await userRepository.findById(decoded.id);
      if (!account?.isAdmin()) return new UnauthorizedError(Messages.USER_NOT_FOUND);
      

    }
    //todo : other roles here 

    if (!account) {
      return new UnauthorizedError(Messages.USER_NOT_FOUND);
    }
    const accessToken = jwtService.sign({ email: account.email, id: account.id, role: decoded.role }, ACCESS_TOKEN_EXPIRATION);

    setCookie(res, "access_token", accessToken);
    return res.status(HttpStatus.OK).json({ success: true })
  } catch (error) {

    return next(error);
  }
}


export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    clearCookie(res, 'refresh_token');
    clearCookie(res, 'access_token');

    res.status(HttpStatus.OK).json({
      message: Messages.LOGOUT_SUCCESS,
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
};




///admin

export const loginAdminController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError(Messages.EMAIL_AND_PASSWORD_REQUIRED));
    }
    const userRepository = new PrismaUserRepository();
    const passwordService = new BcryptPasswordService()
    const jwtService = new JwtService(JWT_TOKEN_SECRET)

    const useCase = new LoginUseCase(userRepository, passwordService, jwtService);
    const data = await useCase.execute({ email, password }, "super_admin")

    setCookie(res, "refresh_token", data.refreshToken);
    setCookie(res, "access_token", data.accessToken);
    res.status(HttpStatus.OK).json({
      message: Messages.LOGIN_SUCCESS,
      user: data.user,
      status: "success"
    });
  } catch (error) {
    next(error);
  }
}

