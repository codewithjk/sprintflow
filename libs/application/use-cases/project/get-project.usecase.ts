import { Messages } from "../../../shared/constants/messages";
import { NotFoundError } from "../../../shared/errors/app-error";
import { IProjectRepository } from "../../interfaces/project-repository.interface";

export class GetProjectUseCase {
  constructor(
    private readonly projectRepo: IProjectRepository,
  ) {}
    async execute(id: string) {
        //todo : check by swapping the organization (send request from different organizations)
      const project = await this.projectRepo.findById(id);
      if (!project) throw new NotFoundError(Messages.PROJECT_NOT_FOUND);
      return project.toDTO();
  }
}
