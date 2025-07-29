
import { ITaskRepository } from "../../interfaces/task-repository.interface";

export class GetTaskByProjectUseCase {
  constructor(
    private readonly taskRepo: ITaskRepository,
  ) {}
    async execute(projectId :string,page:number,limit:number) {
        const skip = (page - 1) * limit;
        return this.taskRepo.find({ projectId }, skip, limit);
  }
}
