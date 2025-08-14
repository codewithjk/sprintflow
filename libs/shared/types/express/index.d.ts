import { Request } from 'express';
import { User } from '../../../domain/entities/user.entity';
import { Organization } from '../../../domain/entities/organization.entity';
import {Roles} from "../../../../apps/backend/src/types/index"
declare global {
  namespace Express {
    interface Request {
      user: User
      role: Roles
      organization: Organization
      super_admin : User
    }
  }
}
