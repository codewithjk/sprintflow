import { Task } from "../../../../../../libs/domain/entities/task.entity";
import { UserProps } from "../../../../../../libs/domain/entities/user.entity";
import { UserStatus } from "../../../../../../libs/domain/enums/user.enums";
import axios from "../../../utils/axiosInstance";



export const adminAPI = {
  getAllUsers: (filters: Partial<UserProps> & {page:number,limit:number} ) => {
    return axios.get('/admin/users', {params:filters});
  },
  updateUserStatus: (userId: string, status:UserStatus ) => {
    return axios.patch(`/admin/users/${userId}/status`, {status});
   },
  getAllOrganization: (filters: Partial<Task> & {page:number,limit:number} ) => {
  return axios.get('/admin/organizations', { params: filters });
  },
  getSubscriptions: (limit: number, starting_after?: string) =>
    axios.get('/admin/subscriptions', {
      params: { limit, starting_after },
    }),

  getCharges: (limit: number, starting_after?: string) =>
    axios.get('/admin/charges', {
      params: { limit, starting_after },
    }),
  
    
}
