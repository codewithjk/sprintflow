import { Project } from "../../../domain/entities/project.entity";
import { Messages } from "../../../shared/constants/messages";
import { NotFoundError } from "../../../shared/errors/app-error";
import { IProjectRepository } from "../../interfaces/project-repository.interface";

export class GetProjectUseCase {
  constructor(
    private readonly projectRepo: IProjectRepository,
  ) {}
    async execute(id: string) {
      const projectDTO = await this.projectRepo.findById(id);
      if (!projectDTO) throw new NotFoundError(Messages.PROJECT_NOT_FOUND);
      const project = new Project(projectDTO);
      return project.toDTO();
  }
}
