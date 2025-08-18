import { Project } from "../../../domain/entities/project.entity";
import { Messages } from "../../../shared/constants/messages";
import { ForbiddenError, NotFoundError, } from "../../../shared/errors/app-error";
import { IProjectRepository } from "../../interfaces/project-repository.interface";



export class DeleteProjectUseCase {
    constructor(
        private readonly projectRepo: IProjectRepository,
    ) { }

    async execute({ id, orgId }: { id: string; orgId: string }) {
        const projectDTO = await this.projectRepo.findById(id);
        if (!projectDTO) {
            throw new NotFoundError(Messages.PROJECT_NOT_FOUND);
        }

        const project = new Project(projectDTO);
   
        if (!project.ownedBy(orgId)) throw new ForbiddenError(Messages.FORBIDDEN);
        await this.projectRepo.delete(id);

    }
}
