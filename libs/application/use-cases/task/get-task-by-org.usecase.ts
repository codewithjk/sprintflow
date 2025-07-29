
import { ITaskRepository } from "../../interfaces/task-repository.interface";

export class GetTaskByOrgUseCase {
  constructor(
    private readonly taskRepo: ITaskRepository,
  ) {}
    async execute(orgId :string,page:number,limit:number) {
        const skip = (page - 1) * limit;
        return this.taskRepo.find({ orgId }, skip, limit);
  }
}
