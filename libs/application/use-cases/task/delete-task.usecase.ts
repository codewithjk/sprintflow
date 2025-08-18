import { Task } from "../../../domain/entities/task.entity";
import { Messages } from "../../../shared/constants/messages";
import { ForbiddenError, NotFoundError } from "../../../shared/errors/app-error";
import { ITaskRepository } from "../../interfaces/task-repository.interface";


export class DeleteTaskUseCase {
    constructor(
        private readonly taskRepo: ITaskRepository,
    ) { }

    async execute({ id, orgId }: { id: string; orgId: string }) {
        const taskDTO = await this.taskRepo.findById(id);
        if (!taskDTO) {
            throw new NotFoundError(Messages.TASK_NOT_FOUND);
        }
        const task = new Task(taskDTO);
        //check for, is the same organization that created this task
        if (!task.ownedBy(orgId)) throw new ForbiddenError(Messages.FORBIDDEN);
        //todo : delete attachments under that task.
        await this.taskRepo.delete(id);

    }
}
