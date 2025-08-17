
import { useState } from "react";
import { Project, ProjectProps } from "../../../../../../libs/domain/entities/project.entity";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { projectAPI } from "./projectAPI";
import { createProjectThunk, deleteProjectThunk, fetchProjectsThunk, updateProjectThunk } from "./projectSlice";



export function useProject() {
    const dispatch = useAppDispatch();
    const { projects, isLoading, createError, fetchError ,deleteLoading,updateLoading ,createLoading} = useAppSelector(state => state.project);
    const [project, setProject] = useState<Project | null>(null);

    const getAllProjects = async ({orgId} :{orgId:string})=>{
        await dispatch(fetchProjectsThunk({orgId}))
    }
    const createProject = async (data: Partial<ProjectProps>) => {
       return await dispatch(createProjectThunk(data)).unwrap();
    }
    const updateProject = async (id:string,data: Partial<ProjectProps>) => {
       return await dispatch(updateProjectThunk({ id, data })).unwrap();
    }
    const deleteProject = async (id:string) => {
        return await dispatch(deleteProjectThunk(id)).unwrap();
    }

    const fetchProjects = async (filter: Partial<Project> & {limit:number,page:number}) => {
        return projectAPI.getAllProjects(filter)
    }
    const getProjectById = async (id: string) => {
        const res = await projectAPI.getProjectById(id);
        setProject(res.data.project);
    }

    return {projects, project,isLoading  , createLoading,deleteLoading,updateLoading,createError,fetchError,getAllProjects, fetchProjects ,createProject ,getProjectById ,updateProject,deleteProject} 
}

