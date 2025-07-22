import { ITaskRepository } from "../../interfaces/task-repository.interface";


export class SearchTaskUseCase {
  constructor(private readonly taskRepo: ITaskRepository) {}

  async execute({ search,orgId, page ,limit }:{search:string,orgId:string,page:number,limit:number}) {
    const skip = (page - 1) * limit;
    return this.taskRepo.search(search,orgId, skip, limit);
  }
}
