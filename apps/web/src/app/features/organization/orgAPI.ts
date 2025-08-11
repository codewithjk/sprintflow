import { OrgProps } from '../../../../../../libs/domain/entities/organization.entity';
import { UserProps } from '../../../../../../libs/domain/entities/user.entity';
import axios from '../../../utils/axiosInstance';

export const orgAPI = {

    //for searching the org in signup of user
    getOrganizations: (params: { search?: string; page?: number; limit?: number }) =>
        axios.get('/org', { params }),
    createInvitation: ({ name, email }: { name: string, email: string }) =>
        axios.post('/org/invite', { email, name }),
    getAllMembers: (params: { page: number, limit: number }) => 
        axios.get('/org/members', { params }),
    getOrgById: (id:string) => axios.get(`/org/${id}`),
    updateOrg: (id:string, data :Partial<OrgProps>) => axios.put(`/org/${id}`, data),
    updateMember: (id: string, data: Partial<UserProps>) => axios.put(`/org/members/${id}`, data),
    
    fileUpload:(formData:FormData) => axios.post(`/upload`,formData,{headers:{"Content-Type": "multipart/form-data",}})
};
