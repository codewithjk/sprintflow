import { Prisma } from '@prisma/client';
import { IProjectRepository } from '../../application/interfaces/project-repository.interface';
import { CreateProjectDTO, ProjectDTO, UpdateProjectDTO } from '../../shared/types/src';
import prisma from './client';

export class PrismaProjectRepository implements IProjectRepository {
  async create(data :CreateProjectDTO) {
    const project = await prisma.project.create({ data:{...data }});
    return project;
  }

  async update(id: string, data: UpdateProjectDTO) {
    const project = await prisma.project.update({ where: { id }, data });
    return project;
  }

  async delete(id: string) {
    await prisma.project.delete({ where: { id } });
  }

  async findById(id: string) {
    const org = await prisma.project.findUnique({ where: { id } });
    return org ? org : null;
  }
 
  async findExistingProject(name: string,orgId:string) {
    const org = await prisma.project.findFirst({ where: { name,orgId } });
    return org ? org : null;
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

  async find(filter: Partial<ProjectDTO>, skip: number, take: number) {
        const { name, ...rest } = filter;

        const where: Prisma.ProjectWhereInput = {
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
        const [projects, total] = await Promise.all([
            prisma.project.findMany({
                where,
                skip,
                take,
            }),
            prisma.project.count({
                where,
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
