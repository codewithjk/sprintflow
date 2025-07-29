
import { ITaskRepository } from "../../interfaces/task-repository.interface";
import { ForbiddenError, NotFoundError } from "../../../shared/errors/app-error";
import { Messages } from "../../../shared/constants/messages";
import { TaskProps } from "../../../domain/entities/task.entity";




export class UpdateTaskUseCase {
    constructor(
        private readonly taskRepo: ITaskRepository,
    ) { }

    async execute({ id, data, orgId }: { id: string; data: Partial<TaskProps>, orgId: string }) {
        const task = await this.taskRepo.findById(id);
        if (!task) {
            throw new NotFoundError(Messages.TASK_NOT_FOUND);
        }
        //check if organization have the access to update 
        if (!task.ownedBy(orgId)) throw new ForbiddenError(Messages.FORBIDDEN);
        //todo : if any changes to be made to attachment under this task, do here.
        const updatedTask = await this.taskRepo.update(id, data);
        return updatedTask.toDTO();
    }
}
