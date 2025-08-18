import prisma from './client';
import { ITaskRepository } from '../../application/interfaces/task-repository.interface';
import { Prisma } from '@prisma/client';
import { CreateTaskDTO, TaskDTO, UpdateTaskDTO } from '../../shared/types/src';

export class PrismaTaskRepository implements ITaskRepository {
    private mapTaskInput(input: CreateTaskDTO): Prisma.TaskCreateInput {
        return {
            title: input.title,
            description: input.description,
            startDate: input.startDate,
            endDate: input.endDate,
            tags: input.tags,
            status: input.status,
            priority: input.priority,
            project: { connect: { id: input.projectId } },
            assignee: { connect: { id: input.assignedUserId } },
            author: { connect: { id: input.orgId } },
        };
    }

    async create(task: CreateTaskDTO): Promise<TaskDTO> {
        const mappedTaskInput = this.mapTaskInput(task);
        const created = await prisma.task.create({ data: mappedTaskInput });
        return  created;
    }

    async findById(id: string): Promise<TaskDTO | null> {
        const task = await prisma.task.findUnique({ where: { id } });
        return task ? task : null;
    }

    async update(id: string, task: UpdateTaskDTO): Promise<TaskDTO> {
        const updated = await prisma.task.update({
            where: { id: id },
            data: task,
        });
        return updated;
    }

    async delete(id: string): Promise<void> {
        await prisma.task.delete({ where: { id } });
    }

    async findExistingTask(name: string, orgId: string) {
        const task = await prisma.task.findFirst({ where: { title: name, orgId: orgId } });
        return task ? task : null;
    }

    async search(search: string, orgId: string, skip: number, take: number) {
        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where: {
                    title: {
                        contains: search,
                        mode: 'insensitive',
                    },
                    orgId,
                },
                skip,
                take,
            }),
            prisma.task.count({
                where: {
                    title: {
                        contains: search,
                        mode: 'insensitive',
                    },
                    orgId
                },
            }),
        ]);

        return {
            tasks,
            total,
            page: Math.floor(skip / take) + 1,
            pageSize: take,
        };
    }
    async find(filter: Partial<TaskDTO>, skip: number, take: number) {
        const { title, ...rest } = filter;

        const where: Prisma.TaskWhereInput = {
            ...rest,
            ...(title && typeof title === 'string'
                ? {
                    title: {
                        contains: title,
                        mode: 'insensitive',
                    },
                }
                : {}),
        };
        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where,
                skip,
                take,
                include: {
                    assignee: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profileUrl:true,
                        },
                    },
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profileUrl:true,
                        },
                    },
                    project: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            }),
            prisma.task.count({
                where,
            }),
        ]);

        return {
            tasks,
            total,
            page: Math.floor(skip / take) + 1,
            pageSize: take,
        };
    }
}
