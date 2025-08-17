import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../../../libs/shared/constants/http-status.enum';
import { Messages } from '../../../../libs/shared/constants/messages';
import { UnauthorizedError, ValidationError } from '../../../../libs/shared/errors/app-error';
import { clearCookie, setCookie } from '../utils/cookies/setCookie';
import { JsonWebTokenError } from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRATION, TokenNames, TokenType } from '../../../../libs/shared/constants/jwt-token-constants';
import { AppUserRole } from '../../../../libs/shared/types/src';
import { jwtService, orgRepo, signupUseCase, userLoginUseCase, userRepo, verifyUserUseCase } from '../di';


export const signupController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) {
      return next(new ValidationError("Missing required fields!"));
    }
    await signupUseCase.execute({ email, name });
    res.status(HttpStatus.OK).json({ message: Messages.OTP_SENT });
  } catch (error: any) {
    next(error)
  }
};

//Verify OTP for user registration
export const verifyUserController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp, password, name, orgId } = req.body;
    if (!email || !otp || !password || !name || !orgId) {
      return next(new ValidationError("Missing required fields!"));
    }
    const data = { email, otp, password, name, orgId }
    const newUser = await verifyUserUseCase.execute(data)
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
    const data = await userLoginUseCase.execute({ email, password }, AppUserRole.USER)

    setCookie(res, data.refreshToken, AppUserRole.USER, TokenType.REFRESH_TOKEN);
    setCookie(res, data.accessToken, AppUserRole.USER, TokenType.ACCESS_TOKEN);
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

    // Check for possible access token names in cookies
    const possibleRefreshTokens = [
      TokenNames.USER_REFRESH_TOKEN,
      TokenNames.ORG_REFRESH_TOKEN,
      TokenNames.SUPER_ADMIN_REFRESH_TOKEN,
    ];

    let refreshToken: string | undefined;

    // Search for token in known access token cookies
    for (const name of possibleRefreshTokens) {
      if (req.cookies[name]) {
        refreshToken = req.cookies[name];
        break;
      }
    }

    if (!refreshToken || refreshToken === undefined) {

      throw new ValidationError(Messages.JWT_TOKEN_MISSING)
    }
    const decoded = jwtService.verify(refreshToken);

    if (!decoded || !decoded.id || !decoded.role) {
      return new JsonWebTokenError(Messages.JWT_TOKEN_MALFORMED);
    }
    let account;
    if (decoded.role === "user") {
      account = await userRepo.findById(decoded.id);
    }
    if (decoded.role === "organization") {
      account = await orgRepo.findById(decoded.id);
    }
    if (decoded.role === "super_admin") {
      account = await userRepo.findById(decoded.id);
      if (!account?.isAdmin()) return new UnauthorizedError(Messages.USER_NOT_FOUND);
    }
    if (!account) {
      return new UnauthorizedError(Messages.USER_NOT_FOUND);
    }
    const accessToken = jwtService.sign({ email: account.email, id: account.id, role: decoded.role }, ACCESS_TOKEN_EXPIRATION);

    setCookie(res, accessToken, decoded.role, TokenType.ACCESS_TOKEN);
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
    if (req.user) {
      clearCookie(res, AppUserRole.USER, TokenType.REFRESH_TOKEN);
      clearCookie(res, AppUserRole.USER, TokenType.ACCESS_TOKEN);
    } else if (req.organization) {
      clearCookie(res, AppUserRole.ORGANIZATION, TokenType.REFRESH_TOKEN);
      clearCookie(res, AppUserRole.ORGANIZATION, TokenType.ACCESS_TOKEN);
    } else if (req.super_admin) {
      clearCookie(res, AppUserRole.SUPER_ADMIN, TokenType.REFRESH_TOKEN);
      clearCookie(res, AppUserRole.SUPER_ADMIN, TokenType.ACCESS_TOKEN);
    }


    res.status(HttpStatus.OK).json({
      message: Messages.LOGOUT_SUCCESS,
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
};

//admin
export const loginAdminController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ValidationError(Messages.EMAIL_AND_PASSWORD_REQUIRED));
    }

    const data = await userLoginUseCase.execute({ email, password }, AppUserRole.SUPER_ADMIN)

    setCookie(res, data.refreshToken, AppUserRole.SUPER_ADMIN, TokenType.REFRESH_TOKEN);
    setCookie(res, data.accessToken, AppUserRole.SUPER_ADMIN, TokenType.ACCESS_TOKEN);
    res.status(HttpStatus.OK).json({
      message: Messages.LOGIN_SUCCESS,
      user: data.user,
      status: "success"
    });
  } catch (error) {
    next(error);
  }
}

