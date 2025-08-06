
import { ITaskRepository } from "../../interfaces/task-repository.interface";
import { ForbiddenError, NotFoundError } from "../../../shared/errors/app-error";
import { Messages } from "../../../shared/constants/messages";
import { TaskProps } from "../../../domain/entities/task.entity";




export class UpdateTaskUseCase {
    constructor(
        private readonly taskRepo: ITaskRepository,
    ) { }

    async execute({ id, data, updaterId }: { id: string; data: Partial<TaskProps>, updaterId: string }) {
        const task = await this.taskRepo.findById(id);
        if (!task) {
            throw new NotFoundError(Messages.TASK_NOT_FOUND);
        }

        const isAssigned = task.assignedTO(updaterId);
        const isOwned = task.ownedBy(updaterId);
        //check if organization have the access to update 
         if (!isAssigned && !isOwned) {
    throw new ForbiddenError(Messages.TASK_UPDATE_NOT_ALLOWED);
  }
        // if (!task.ownedBy(orgId)) throw new ForbiddenError(Messages.FORBIDDEN);
        //todo : if any changes to be made to attachment under this task, do here.
        const updatedTask = await this.taskRepo.update(id, data);
        return updatedTask.toDTO();
    }
}
