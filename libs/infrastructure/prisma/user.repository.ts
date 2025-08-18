

import { Prisma } from '@prisma/client';
import { IUserRepository } from '../../application/interfaces/user-repository.interface';
import { CreateUserDTO, UpdateUserDTO, UserDTO } from '../../shared/types/src';
import prisma from './client';


export class PrismaUserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<UserDTO> {
    const user = await prisma.user.create({ data });
    return user;
  }
  async update(id: string, data: UpdateUserDTO): Promise<UserDTO>{
      const user = await prisma.user.update({ where: { id }, data });
      return user;
  }

  async findByEmail(email: string): Promise<UserDTO | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    return user ? user : null;
  }
  async findById(id: string): Promise<UserDTO | null>{
    const user = await prisma.user.findUnique({ where: { id } });
    return user? user : null;
  }
  async find(filter: Partial<UserDTO>, skip: number, take: number) {
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
            users,
            total,
            page: Math.floor(skip / take) + 1,
            pageSize: take,
        };
    }
}
