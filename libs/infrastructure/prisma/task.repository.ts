

import prisma from './client';
import { Task } from '../../domain/entities/task.entity';
import { ITaskRepository } from '../../application/interfaces/task-repository.interface';


export class PrismaTaskRepository implements ITaskRepository {
    async create(task: Task): Promise<Task> {
        const data = task.toDTO();
        const created = await prisma.task.create({ data });
        return new Task({ ...created });
    }

    async findById(id: string): Promise<Task | null> {
        const task = await prisma.task.findUnique({ where: { id } });
        return task ? new Task({ ...task }) : null;
    }

    async update(id:string ,task: Task): Promise<Task> {
        const updated = await prisma.task.update({
            where: { id: task.id },
            data: task.toDTO(),
        });
        return new Task({ ...updated });
    }

    async delete(id: string): Promise<void> {
        await prisma.task.delete({ where: { id } });
    }

    async findExistingTask(name: string,orgId:string) {
    const task = await prisma.task.findFirst({ where: { title:name,authorId: orgId } });
    return task ? new Task(task) : null;
  }

    async search(search: string, authorId: string, skip: number, take: number) {
        const [tasks, total] = await Promise.all([
            prisma.task.findMany({
                where: {
                    title: {
                        contains: search,
                        mode: 'insensitive',
                    },
                    authorId,
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
                   authorId
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
}
