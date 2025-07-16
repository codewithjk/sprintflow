
import axios from '../../../utils/axiosInstance';

export const authAPI = {
  signup: (data: { email: string; name: string; password: string }) =>
    axios.post('/auth/signup', data),

  verifyOtp: (data: { email: string; otp: string }) =>
    axios.post('/auth/verify', data),

  login: (data: { email: string; password: string }) =>
    axios.post('/auth/login', data),

  logout: () => axios.post('/auth/logout'),
};
