// libs/infrastructure/security/bcrypt-password.service.ts
import bcrypt from 'bcrypt'
import { IPasswordService } from '../../application/interfaces/password-service.interface';


export class BcryptPasswordService implements IPasswordService {
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
