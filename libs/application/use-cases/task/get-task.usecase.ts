import { Messages } from "../../../shared/constants/messages";
import { NotFoundError } from "../../../shared/errors/app-error";
import { ITaskRepository } from "../../interfaces/task-repository.interface";

export class GetTaskUseCase {
  constructor(
    private readonly taskRepo: ITaskRepository,
  ) {}
    async execute(id: string) {
        //todo : check by swapping the organization (send request from different organizations)
      const task = await this.taskRepo.findById(id);
      if (!task) throw new NotFoundError(Messages.TASK_NOT_FOUND);
      return task.toDTO();
  }
}
