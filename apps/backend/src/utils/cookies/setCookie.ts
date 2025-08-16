import { Response } from 'express';
import { TokenNames, TokenType } from '../../../../../libs/shared/constants/jwt-token-constants';
import { AppUserRole } from '../../../../../libs/shared/types/src';



// select token name based on role and token type.
export const getTokenName = (role: AppUserRole, type: TokenType): string => {
  switch (role) {
    case AppUserRole.SUPER_ADMIN:
      return type === TokenType.ACCESS_TOKEN
        ? TokenNames.SUPER_ADMIN_ACCESS_TOKEN
        : TokenNames.SUPER_ADMIN_REFRESH_TOKEN;
    case AppUserRole.ORGANIZATION:
      return type === TokenType.ACCESS_TOKEN
        ? TokenNames.ORG_ACCESS_TOKEN
        : TokenNames.ORG_REFRESH_TOKEN;
    case AppUserRole.USER:
      return type === TokenType.ACCESS_TOKEN
        ? TokenNames.USER_ACCESS_TOKEN
        : TokenNames.USER_REFRESH_TOKEN;
    default:
      throw new Error('Invalid role');
  }
};

export const setCookie = (
  res: Response,
  token: string,
  role: AppUserRole,
  type: TokenType
) => {
  const name = getTokenName(role, type);
  res.cookie(name, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearCookie = (
  res: Response,
  role: AppUserRole,
  type: TokenType
) => {
  const name = getTokenName(role, type);
  res.clearCookie(name, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });
};
