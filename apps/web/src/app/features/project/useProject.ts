
import { useState } from "react";
import { Project, ProjectProps } from "../../../../../../libs/domain/entities/project.entity";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { projectAPI } from "./projectAPI";
import { createProjectThunk, fetchProjectsThunk } from "./projectSlice";



export function useProject() {
    const dispatch = useAppDispatch();
    const { projects, isLoading, createError, fetchError } = useAppSelector(state => state.project);
    const [project, setProject] = useState<Project | null>(null);

    const getAllProjects = async ({orgId} :{orgId:string})=>{
        await dispatch(fetchProjectsThunk({orgId}))
    }
    const createProject = async (data: Partial<ProjectProps>) => {
       return await dispatch(createProjectThunk(data)).unwrap();
    }
    const fetchProjects = async (filter: Partial<Project> & {limit:number,page:number}) => {
        return projectAPI.getAllProjects(filter)
    }
    const getProjectById = async (id: string) => {
        console.log(id)
        const res = await projectAPI.getProjectById(id);
        console.log(res)
        setProject(res.data.project);
    }

    return {projects, project,isLoading,createError,fetchError,getAllProjects, fetchProjects ,createProject ,getProjectById}
}

