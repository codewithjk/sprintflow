import { CreateTaskDTO, TaskDTO, UpdateTaskDTO } from "../../shared/types/src";

export interface ITaskRepository {
  create(task: CreateTaskDTO): Promise<TaskDTO>;
  findById(id: string): Promise<TaskDTO | null>;
  update(id : string,task: UpdateTaskDTO): Promise<TaskDTO>;
  delete(id: string): Promise<void>;
  search(search: string, authorId: string, skip: number, take: number): Promise<{ tasks: Partial<TaskDTO>[]; total: number; page: number; pageSize: number; }>;
  findExistingTask(name: string, orgId: string): Promise<TaskDTO | null>;
  find(filter : Partial<TaskDTO>, skip: number, take: number) : Promise<{ tasks: Partial<TaskDTO>[]; total: number; page: number; pageSize: number; }>;
}
