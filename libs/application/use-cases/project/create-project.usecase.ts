
import { ConflictError } from "../../../shared/errors/app-error";
import { Messages } from "../../../shared/constants/messages";
import { CreateProjectDTO } from "../../../shared/types/src";
import { IProjectRepository } from "../../interfaces/project-repository.interface";
import { Project } from "../../../domain/entities/project.entity";

export class CreateProjectUseCase {
    constructor(private readonly projectRepo: IProjectRepository) { }

    async execute(data: CreateProjectDTO) {
        const existing = await this.projectRepo.findExistingProject(data.name, data.orgId);
        if (existing) throw new ConflictError(Messages.PROJECT_ALREADY_EXISTS);
        const projectDTO = await this.projectRepo.create(data);
        const project = new Project(projectDTO);
        return project.toDTO();
    }
}
