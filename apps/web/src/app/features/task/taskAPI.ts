import { CreateTaskDTO, TaskDTO, UpdateTaskDTO } from "../../../../../../libs/shared/types/src";
import axios from "../../../utils/axiosInstance";



export const taskAPI = {
  create: (data:CreateTaskDTO) => {
    return axios.post('/task', data);
   },
  searchTasks: (filters: Partial<TaskDTO> & {page:number,limit:number} ) => {
  return axios.get('/task', { params: filters });
  },
  update: (taskId:string,data:UpdateTaskDTO) => {
    return axios.put(`/task/${taskId}`, data);
  },
  delete: (taskId: string)=>{
    return axios.delete(`/task/${taskId}`)
  }
    
}



