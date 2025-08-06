import { Task } from "../../../../../../libs/domain/entities/task.entity";
import { UserProps } from "../../../../../../libs/domain/entities/user.entity";
import axios from "../../../utils/axiosInstance";



export const adminAPI = {
  getAllUsers: (filters: Partial<UserProps> & {page:number,limit:number} ) => {
    return axios.get('/admin/users', {params:filters});
   },
  getAllOrganization: (filters: Partial<Task> & {page:number,limit:number} ) => {
  return axios.get('/admin/organizations', { params: filters });
  },
  
    
}
