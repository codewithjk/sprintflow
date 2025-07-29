import { Project } from "../../../domain/entities/project.entity";
import { IProjectRepository } from "../../interfaces/project-repository.interface";


export class GetAllProjectsUseCase {
  constructor(private readonly projectRepo: IProjectRepository) {}

  async execute(filter:Partial<Project>,page:number,limit:number) {
    const skip = (page - 1) * limit;
    return this.projectRepo.find(filter, skip, limit);
  }
}