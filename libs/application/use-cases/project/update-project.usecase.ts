
import { Project } from "../../../domain/entities/project.entity";
import { Messages } from "../../../shared/constants/messages";
import { ForbiddenError, NotFoundError } from "../../../shared/errors/app-error";
import { UpdateProjectDTO } from "../../../shared/types/src";
import { IProjectRepository } from "../../interfaces/project-repository.interface";



export class UpdateProjectUseCase {
    constructor(
        private readonly projectRepo: IProjectRepository,
    ) { }

    async execute({ id, data, orgId }: { id: string; data: UpdateProjectDTO, orgId: string }) {
        const projectDTO = await this.projectRepo.findById(id);
        if (!projectDTO) {
            throw new NotFoundError(Messages.PROJECT_NOT_FOUND);
        }
        const project = new Project(projectDTO);
        //check if organization have the access to update 
        if (!project.ownedBy(orgId)) throw new ForbiddenError(Messages.FORBIDDEN);

        const updatedProjectDTO = await this.projectRepo.update(id, data);
        const updatedProject = new Project(updatedProjectDTO);
        return updatedProject.toDTO();
    }
}
