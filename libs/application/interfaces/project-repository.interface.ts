import { Project } from "../../domain/entities/project.entity";
import { CreateProjectDTO } from "../../shared/types/src";


export interface IProjectRepository {
  create(data: CreateProjectDTO): Promise<Project>;
  update(id: string, data: Partial<Project>): Promise<Project>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Project | null>;
  searchProjects(search: string,orgId:string, skip: number, take: number): Promise<{ projects: Partial<Project>[]; total: number; page: number; pageSize: number; }>;
  findExistingProject(name: string, orgId: string): Promise<Project | null>;

}