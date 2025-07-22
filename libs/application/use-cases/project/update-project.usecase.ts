
import { Project } from "../../../domain/entities/project.entity";
import { Messages } from "../../../shared/constants/messages";
import { ForbiddenError, NotFoundError } from "../../../shared/errors/app-error";
import { IProjectRepository } from "../../interfaces/project-repository.interface";



export class UpdateProjectUseCase {
    constructor(
        private readonly projectRepo: IProjectRepository,
    ) { }

    async execute({ id, data, orgId }: { id: string; data: Partial<Project>, orgId: string }) {
        const project = await this.projectRepo.findById(id);
        if (!project) {
            throw new NotFoundError(Messages.PROJECT_NOT_FOUND);
        }
        //check if organization have the access to update 
        if (!project.ownedBy(orgId)) throw new ForbiddenError(Messages.FORBIDDEN);
        //todo : if any changes to be made to tasks under this project, do here.
        const updatedProject = await this.projectRepo.update(id, data);
        return updatedProject.toDTO();
    }
}
