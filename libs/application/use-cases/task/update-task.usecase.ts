
import { ITaskRepository } from "../../interfaces/task-repository.interface";
import { ForbiddenError, NotFoundError } from "../../../shared/errors/app-error";
import { Messages } from "../../../shared/constants/messages";
import { UpdateTaskDTO } from "../../../shared/types/src";
import { Task } from "../../../domain/entities/task.entity";




export class UpdateTaskUseCase {
    constructor(
        private readonly taskRepo: ITaskRepository,
    ) { }

    async execute({ id, data, updaterId }: { id: string; data: UpdateTaskDTO, updaterId: string }) {
        const taskDTO = await this.taskRepo.findById(id);
        if (!taskDTO) {
            throw new NotFoundError(Messages.TASK_NOT_FOUND);
        }
        const task = new Task(taskDTO);
        const isAssigned = task.assignedTO(updaterId);
        const isOwned = task.ownedBy(updaterId);

        //check if organization have the access to update 
        if (!isAssigned && !isOwned) {
            throw new ForbiddenError(Messages.TASK_UPDATE_NOT_ALLOWED);
        }

        const updatedTaskDTO = await this.taskRepo.update(id, data);
        const updatedTask = new Task(updatedTaskDTO);
        return updatedTask.toDTO();
    }
}
