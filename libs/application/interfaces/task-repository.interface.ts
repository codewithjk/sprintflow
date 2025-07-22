import { Task } from "../../domain/entities/task.entity";


export interface ITaskRepository {
  create(task: Partial<Task>): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  update(id : string,task: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<void>;
  search(search: string, authorId: string, skip: number, take: number): Promise<{ tasks: Partial<Task>[]; total: number; page: number; pageSize: number; }>;
  findExistingTask(name: string, orgId: string): Promise<Task | null>;
}
