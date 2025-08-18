

export interface Project{
    id:string
    name:string
    description?:string
    startDate?:Date
    endDate?: Date
    orgId : string
}
// Response
export interface ProjectDTO {
  id: string;
  name: string;
  description: string;
  orgId: string;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateProjectDTO{
    name:string
    description: string;
    startDate?:Date
    endDate?: Date
    orgId : string
}
export interface UpdateProjectDTO{
    name:string
    description: string;
    startDate?:Date
    endDate?: Date
}
