

import { Prisma } from '@prisma/client';
import { IUserRepository } from '../../application/interfaces/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { CreateUserDTO } from '../../shared/types/src';
import prisma from './client';


export class PrismaUserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    const user = await prisma.user.create({ data });
    return new User(user);
  }
  async update(id: string, data: Partial<User>) {
      const user = await prisma.user.update({ where: { id }, data });
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
  async find(filter: Partial<User>, skip: number, take: number) {
        const { name, ...rest } = filter;

        const where: Prisma.UserWhereInput = {
            ...rest,
            ...(name && typeof name === 'string'
                ? {
                    name: {
                        contains: name,
                        mode: 'insensitive',
                    },
                }
                : {}),
        };
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take,
            }),
            prisma.user.count({
                where,
            }),
        ]);

        return {
            users: users.map(user => new User(user).toDTO()),
            total,
            page: Math.floor(skip / take) + 1,
            pageSize: take,
        };
    }
}
