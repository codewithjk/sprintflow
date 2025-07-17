import { Request } from 'express';
import { User } from '../../../domain/entities/user.entity';
import { Organization } from '../../../domain/entities/organization.entity';

declare global {
  namespace Express {
    interface Request {
      user: User
      role: "user" | "organization" | "super_admin"
      organization: Organization
      admin : User
    }
  }
}
