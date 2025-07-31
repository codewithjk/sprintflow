import { Prisma } from '@prisma/client';
import { IOrganizationRepository } from '../../application/interfaces/org-repository.interface';
import { Organization } from '../../domain/entities/organization.entity';
import { CreateOrganizationDTO } from '../../shared/types/src/org.types';
import prisma from './client';


export class PrismaOrganizationRepository implements IOrganizationRepository {
  async create(data :CreateOrganizationDTO) {
    const newOrg = await prisma.organization.create({ data:{...data }});
    return new Organization(newOrg);
  }

  async update(id: string, data: Partial<Organization>) {
    const org = await prisma.organization.update({ where: { id }, data });
    return new Organization(org);
  }

  async delete(id: string) {
    await prisma.organization.delete({ where: { id } });
  }

  async findById(id: string) {
    const org = await prisma.organization.findUnique({ where: { id } });
    return org ? new Organization(org) : null;
  }
  async findByEmail(email: string) {
    const org = await prisma.organization.findUnique({ where: { email } });
    return org ? new Organization(org) : null;
  }
  async findByName(name: string) {
    const org = await prisma.organization.findUnique({ where: { name } });
    return org ? new Organization(org) : null;
  }
  async searchOrganizations(search: string, skip: number, take: number) {
    const [orgs, total] = await Promise.all([
      prisma.organization.findMany({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        skip,
        take,
      }),
      prisma.organization.count({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    return {
      orgs,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }
  async find(filter: Partial<Organization>, skip: number, take: number) {
  const { name, ...rest } = filter;

  const where: Prisma.OrganizationWhereInput = {
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

  const [orgs, total] = await Promise.all([
    prisma.organization.findMany({
      where,
      skip,
      take,
    }),
    prisma.organization.count({
      where,
    }),
  ]);

  return {
    orgs:orgs.map(org => new Organization(org).toDTO()),
    total,
    page: Math.floor(skip / take) + 1,
    pageSize: take,
  };
}


}
