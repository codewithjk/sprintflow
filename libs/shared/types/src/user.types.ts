import { UserStatus } from "../../../domain/enums/user.enums";


export enum AppUserRole {
  USER = "user" ,
  SUPER_ADMIN = "super_admin",
  ORGANIZATION = "organization",
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
  orgId: string;
}


export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: "user" | "super_admin";
  isOwner?: boolean;
  isVerified: boolean;
  isBlocked?: boolean;
  orgId: string;
  status: UserStatus;
}

export interface UpdateUserDTO {
  name?: string;
  phoneNumber?: string;
  profileUrl?: string;
  isBlocked?: boolean;
  status?: UserStatus;
}

export interface User{
  id:string
  name:string
  email:string
  orgId:string
  role: string
  profileUrl?: string | null
  phoneNumber?: string | null
}

// Response
export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: "user" | "super_admin";
  orgId: string;
  profileUrl?: string | null;
  phoneNumber?: string | null;
  status: "blocked" | "active" | "inactive";
  authProvider: "local" | "google" | "github" |null;
  isOwner: boolean;
  isBlocked: boolean;
}


export interface JwtPayload{
  email: string;
  id: string;
  role:AppUserRole
}