import { CreateProjectDTO, ProjectDTO, UpdateProjectDTO } from '../../../../../../libs/shared/types/src';
import axios from '../../../utils/axiosInstance';

export const projectAPI = {
    create: (data : Partial<CreateProjectDTO>) => axios.post('/project/',data),

    getAllProjects: (params: Partial<ProjectDTO> & {limit:number,page:number} ) =>
        axios.get('/project/', { params }),
    getProjectById: (id: string) =>
        axios.get(`/project/${id}`),
    updateProject: (id: string,data:UpdateProjectDTO) =>
        axios.put(`/project/${id}`, data),
    deleteProject: (id: string) =>
        axios.delete(`/project/${id}`),
};
