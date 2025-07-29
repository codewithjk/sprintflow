import { Project } from '../../../../../../libs/domain/entities/project.entity';
import axios from '../../../utils/axiosInstance';

export const projectAPI = {
    create: (data : Partial<Project>) => axios.post('/project/',data),

    getAllProjects: (params: Partial<Project> & {limit:number,page:number} ) =>
        axios.get('/project/', { params }),
    getProjectById: (id: string) =>
        axios.get(`/project/${id}`),
};
