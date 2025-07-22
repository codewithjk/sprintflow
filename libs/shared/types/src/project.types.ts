

export interface Project{
    id:string
    name:string
    description?:string
    startDate?:Date
    endDate?: Date
    orgId : string
}

export interface CreateProjectDTO{
    name:string
    description: string;
    startDate?:Date
    endDate?: Date
    orgId : string
}

