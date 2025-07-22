import { IProjectRepository } from "../../interfaces/project-repository.interface";


export class SearchProjectsUseCase {
  constructor(private readonly projectRepo: IProjectRepository) {}

  async execute({ search,orgId, page ,limit }:{search:string,orgId:string,page:number,limit:number}) {
    const skip = (page - 1) * limit;
    return this.projectRepo.searchProjects(search,orgId, skip, limit);
  }
}
