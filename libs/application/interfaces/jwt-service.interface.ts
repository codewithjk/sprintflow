import { JwtPayload } from "../../shared/types/src";

export interface IJwtService {
  sign(payload: JwtPayload, expiresIn?: number): string;
  verify(token: string): JwtPayload;
}