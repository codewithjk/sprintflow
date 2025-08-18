import { CreateOrganizationDTO, LoginDTO, SignupDTO } from '../../../../../../libs/shared/types/src';
import axios from '../../../utils/axiosInstance';

export const authAPI = {
  signupUser: (data: SignupDTO) => axios.post('/auth/signup', data),
  signupOrganization: (data: SignupDTO) => axios.post('/auth/org/signup', data),

  loginUser: (data: LoginDTO) => axios.post('/auth/login', data),
  loginAdmin: (data: LoginDTO) => axios.post('/auth/admin/login', data),
  loginOrg: (data: LoginDTO) => axios.post('/auth/org/login', data),

  verifyOtp: (data: { email: string; otp: string }) => axios.post('/auth/verify', data),
  verifyOrg: (formdata: CreateOrganizationDTO, otp: string) => axios.post('/auth/org/verify', { ...formdata, otp }),
  
  verifyInvitation: (data: { token: string }) => axios.post('/auth/verify/invitation', data),
  
  getUser: (id: string) => axios.get(`auth/get-user/${id}`),
  logout: () => axios.post('/auth/logout'),
};
