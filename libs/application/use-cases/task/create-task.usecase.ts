import { Task, TaskProps } from "../../../domain/entities/task.entity";
import { Messages } from "../../../shared/constants/messages";
import { ConflictError } from "../../../shared/errors/app-error";
import { ITaskRepository } from "../../interfaces/task-repository.interface";


export class CreateTaskUseCase {
    constructor(private readonly taskRepo: ITaskRepository) { }

    async execute(data: TaskProps): Promise<Task> {
        const existing = await this.taskRepo.findExistingTask(data.title,data.orgId);
        if (existing) throw new ConflictError(Messages.TASK_ALREADY_EXISTS);
        return await this.taskRepo.create(data);
    }
}
