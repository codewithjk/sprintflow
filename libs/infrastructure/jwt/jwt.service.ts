import jwt from 'jsonwebtoken';
import { IJwtService } from '../../application/interfaces/jwt-service.interface';
import { JwtPayload } from '../../shared/types/src';


export class JwtService implements IJwtService {
    constructor(private readonly secret: string) {}
    sign(payload: JwtPayload | Buffer, expiresIn: number ): string{
    const options: jwt.SignOptions = { expiresIn };
    return jwt.sign(payload, this.secret,options );
  }

  verify(token: string):JwtPayload {
    return jwt.verify(token, this.secret) as JwtPayload;
  }
}