import { Task } from "@prisma/client";
import { ITaskRepository } from "../../interfaces/task-repository.interface";
import { ForbiddenError, NotFoundError } from "../../../shared/errors/app-error";
import { Messages } from "../../../shared/constants/messages";




export class UpdateTaskUseCase {
    constructor(
        private readonly taskRepo: ITaskRepository,
    ) { }

    async execute({ id, data, orgId }: { id: string; data: Partial<Task>, orgId: string }) {
        const task = await this.taskRepo.findById(id);
        if (!task) {
            throw new NotFoundError(Messages.PROJECT_NOT_FOUND);
        }
        //check if organization have the access to update 
        if (!task.ownedBy(orgId)) throw new ForbiddenError(Messages.FORBIDDEN);
        //todo : if any changes to be made to attachment under this task, do here.
        const updatedTask = await this.taskRepo.update(id, data);
        return updatedTask.toDTO();
    }
}
