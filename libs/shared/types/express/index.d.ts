import { Request } from 'express';
import { User } from '../../../domain/entities/user.entity';
import { Organization } from '../../../domain/entities/organization.entity';
import { AppUserRole } from '../src';

declare global {
  namespace Express {
    interface Request {
      user: User
      role: AppUserRole
      organization: Organization
      super_admin : User
    }
  }
}
