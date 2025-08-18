
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { projectAPI } from "./projectAPI";
import { createProjectThunk, deleteProjectThunk, fetchProjectsThunk, updateProjectThunk } from "./projectSlice";
import { CreateProjectDTO, ProjectDTO, UpdateProjectDTO } from "../../../../../../libs/shared/types/src";



export function useProject() {
    const dispatch = useAppDispatch();
    const { projects, isLoading, createError, fetchError ,deleteLoading,updateLoading ,createLoading} = useAppSelector(state => state.project);
    const [project, setProject] = useState<ProjectDTO | null>(null);

    const getAllProjects = async ({orgId} :{orgId:string})=>{
        await dispatch(fetchProjectsThunk({orgId}))
    }
    const createProject = async (data: CreateProjectDTO) => {
       return await dispatch(createProjectThunk(data)).unwrap();
    }
    const updateProject = async (id:string,data: UpdateProjectDTO) => {
       return await dispatch(updateProjectThunk({ id, data })).unwrap();
    }
    const deleteProject = async (id:string) => {
        return await dispatch(deleteProjectThunk(id)).unwrap();
    }

    const fetchProjects = async (filter: Partial<ProjectDTO> & {limit:number,page:number}) => {
        return projectAPI.getAllProjects(filter)
    }
    const getProjectById = async (id: string) => {
        const res = await projectAPI.getProjectById(id);
        setProject(res.data.project);
    }

    return {projects, project,isLoading  , createLoading,deleteLoading,updateLoading,createError,fetchError,getAllProjects, fetchProjects ,createProject ,getProjectById ,updateProject,deleteProject} 
}

