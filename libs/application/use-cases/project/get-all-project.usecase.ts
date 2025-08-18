import { ProjectDTO } from "../../../shared/types/src";
import { IProjectRepository } from "../../interfaces/project-repository.interface";

export class GetAllProjectsUseCase {
  constructor(private readonly projectRepo: IProjectRepository) {}

  async execute(filter:Partial<ProjectDTO>,page:number,limit:number) {
    const skip = (page - 1) * limit;
    return this.projectRepo.find(filter, skip, limit);
  }
}