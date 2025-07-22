import { Messages } from "../../../shared/constants/messages";
import { ForbiddenError, NotFoundError, } from "../../../shared/errors/app-error";
import { IProjectRepository } from "../../interfaces/project-repository.interface";



export class DeleteProjectUseCase {
    constructor(
        private readonly projectRepo: IProjectRepository,
    ) { }

    async execute({ id, orgId }: { id: string; orgId: string }) {
        const project = await this.projectRepo.findById(id);
        if (!project) {
            throw new NotFoundError(Messages.PROJECT_NOT_FOUND);
        }
        //check for, is the same organization that created this project
   
        if (!project.ownedBy(orgId)) throw new ForbiddenError(Messages.FORBIDDEN);
        //todo : delete tasks under that project.
        await this.projectRepo.delete(id);

    }
}
