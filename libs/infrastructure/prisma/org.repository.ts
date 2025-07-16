import { IOrganizationRepository } from '../../application/interfaces/org-repository.interface';
import { Organization } from '../../domain/entities/organization.entity';
import prisma from './client';


export class PrismaOrganizationRepository implements IOrganizationRepository {
  async create(name: string, ownerId: string) {
    console.log("repo : ",name,ownerId)
      const newOrg = await prisma.organization.create({ data: { name, ownerId } });
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
      return  org ? new Organization(org) : null;
  }
}
