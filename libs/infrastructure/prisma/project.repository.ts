


import { IProjectRepository } from '../../application/interfaces/project-repository.interface';
import { Project } from '../../domain/entities/project.entity';
import { CreateProjectDTO } from '../../shared/types/src';
import prisma from './client';


export class PrismaProjectRepository implements IProjectRepository {
  async create(data :CreateProjectDTO) {
    const project = await prisma.project.create({ data:{...data }});
    return new Project(project);
  }

  async update(id: string, data: Partial<Project>) {
    const project = await prisma.project.update({ where: { id }, data });
    return new Project(project);
  }

  async delete(id: string) {
    await prisma.project.delete({ where: { id } });
  }

  async findById(id: string) {
    const org = await prisma.project.findUnique({ where: { id } });
    return org ? new Project(org) : null;
  }
 
  async findExistingProject(name: string,orgId:string) {
    const org = await prisma.project.findFirst({ where: { name,orgId } });
    return org ? new Project(org) : null;
  }
  async searchProjects(search: string,orgId:string, skip: number, take: number ) {
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
              },
            orgId,
        },
        skip,
        take,
      }),
      prisma.project.count({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
              },
            orgId
        },
      }),
    ]);

    return {
      projects,
      total,
      page: Math.floor(skip / take) + 1,
      pageSize: take,
    };
  }

}
