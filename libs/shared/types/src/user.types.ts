export enum AppUserRole {
  USER ,
  SUPER_ADMIN ,
}

export interface SignupDTO {
  name: string;
  email: string;
}

export interface LoginDTO{
  email: string;
  password: string;
}

export interface VerificationDTO{
  name: string;
  email: string;
  password: string;
  otp: string;
}


export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: "user" | "super_admin";
  isOwner?: boolean;
  isVerified: boolean;
  isBlocked?: boolean;
  orgId?: string | null;
}


export interface JwtPayload{
  email: string;
  id: string;
  role : "user" | "super_admin";
}