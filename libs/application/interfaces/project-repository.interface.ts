import { CreateProjectDTO, ProjectDTO, UpdateProjectDTO } from "../../shared/types/src";

export interface IProjectRepository {
  create(data: CreateProjectDTO): Promise<ProjectDTO>;
  update(id: string, data:UpdateProjectDTO): Promise<ProjectDTO>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<ProjectDTO | null>;
  searchProjects(search: string,orgId:string, skip: number, take: number): Promise<{ projects: Partial<ProjectDTO>[]; total: number; page: number; pageSize: number; }>;
  findExistingProject(name: string, orgId: string): Promise<ProjectDTO | null>;
  find(filter : Partial<ProjectDTO>, skip: number, take: number) : Promise<{ projects: Partial<ProjectDTO>[]; total: number; page: number; pageSize: number; }>;
}