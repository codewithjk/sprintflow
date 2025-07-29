import { Task, TaskProps } from "../../../../../../libs/domain/entities/task.entity";
import axios from "../../../utils/axiosInstance";



export const taskAPI = {
  create: (data:Partial<TaskProps>) => {
    return axios.post('/task', data);
   },
  searchTasks: (filters: Partial<Task> & {page:number,limit:number} ) => {
  return axios.get('/task', { params: filters });
  },
  update: (taskId:string,data:Partial<TaskProps>) => {
    return axios.put(`/task/${taskId}`, data);
  },
  delete: (taskId: string)=>{
    return axios.delete(`/task/${taskId}`)
  }
    
}



