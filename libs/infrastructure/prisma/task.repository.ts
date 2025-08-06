

import prisma from './client';
import { Task, TaskProps } from '../../domain/entities/task.entity';
import { ITaskRepository } from '../../application/interfaces/task-repository.interface';
import { Prisma } from '@prisma/client';


export class PrismaTaskRepository implements ITaskRepository {
    private mapTaskInput(input: TaskProps): Prisma.TaskCreateInput {
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

    async create(task: TaskProps): Promise<Task> {
        console.log(task)
        const mappedTaskInput = this.mapTaskInput(task);
        const created = await prisma.task.create({ data: mappedTaskInput });
        return new Task({ ...created });
    }

    async findById(id: string): Promise<Task | null> {
        const task = await prisma.task.findUnique({ where: { id } });
        return task ? new Task({ ...task }) : null;
    }

    async update(id: string, task: Partial<TaskProps>): Promise<Task> {
        const updated = await prisma.task.update({
            where: { id: id },
            data: task,
        });
        return new Task({ ...updated });
    }

    async delete(id: string): Promise<void> {
        await prisma.task.delete({ where: { id } });
    }

    async findExistingTask(name: string, orgId: string) {
        const task = await prisma.task.findFirst({ where: { title: name, orgId: orgId } });
        return task ? new Task(task) : null;
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
    async find(filter: Partial<TaskProps>, skip: number, take: number) {
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
