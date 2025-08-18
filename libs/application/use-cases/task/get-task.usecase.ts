import { Task } from "../../../domain/entities/task.entity";
import { Messages } from "../../../shared/constants/messages";
import { NotFoundError } from "../../../shared/errors/app-error";
import { ITaskRepository } from "../../interfaces/task-repository.interface";

export class GetTaskUseCase {
  constructor(
    private readonly taskRepo: ITaskRepository,
  ) {}
    async execute(id: string) {
      const taskDTO = await this.taskRepo.findById(id);
      if (!taskDTO) throw new NotFoundError(Messages.TASK_NOT_FOUND);
      const task = new Task(taskDTO);
      return task.toDTO();
  }
}
