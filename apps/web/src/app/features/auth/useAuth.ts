//useAuth.ts
import { loginThunk, logout } from './authSlice';
import { authAPI } from './authAPI';
import { RootState } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { CreateOrganizationDTO, LoginDTO, SignupDTO } from '../../../../../../libs/shared/types/src';

export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);

  const login = async (data: LoginDTO , role: 'user' | 'super_admin' | 'organization' ) => {
    await dispatch(loginThunk({...data,role}));
  };

  const signup = async (data: SignupDTO & { role: 'user' | 'super_admin' | 'organization' }) => {
    const { role, ...rest } = data;
    if (role === 'user') return authAPI.signupUser(rest);
    return authAPI.signupOrganization(rest);
  };

  const verifyOtp = async (data: { email: string; otp: string }) => {
    return authAPI.verifyOtp(data);
  };

  const verifyOrganization = async (data: CreateOrganizationDTO, otp: string) => {
    return authAPI.verifyOrg(data,otp)
  }

  const logOut = async () => {
    await authAPI.logout();
    dispatch(logout());
  };
 
  return { ...auth, login, signup, verifyOtp, logOut,verifyOrganization,  };
}