

import { IUserRepository } from '../../application/interfaces/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDTO } from '../../shared/types/src';
import prisma from './client';


export class PrismaUserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    const user = await prisma.user.create({ data });
    return new User(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? new User(user) : null;
  }
  async findById(id: string): Promise<User | null>{
    const user = await prisma.user.findUnique({ where: { id } });
    return user? new User(user) : null;
  }
}
