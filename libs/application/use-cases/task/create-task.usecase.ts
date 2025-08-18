import { Messages } from "../../../shared/constants/messages";
import { ConflictError } from "../../../shared/errors/app-error";
import { CreateTaskDTO, TaskDTO } from "../../../shared/types/src";
import { ITaskRepository } from "../../interfaces/task-repository.interface"

export class CreateTaskUseCase {
    constructor(private readonly taskRepo: ITaskRepository) { }

    async execute(data: CreateTaskDTO): Promise<TaskDTO> {
        const existing = await this.taskRepo.findExistingTask(data.title,data.orgId);
        if (existing) throw new ConflictError(Messages.TASK_ALREADY_EXISTS);
        return await this.taskRepo.create(data);
    }
}
