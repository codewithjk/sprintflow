import { Task } from "../../../domain/entities/task.entity";
import { ITaskRepository } from "../../interfaces/task-repository.interface";


export class GetAllTasksUseCase {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute(filter:Partial<Task>,page:number,limit:number) {
    const skip = (page - 1) * limit;
    return this.taskRepo.find(filter, skip, limit);
  }
}