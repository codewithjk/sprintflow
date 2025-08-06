//useAuth.ts
import { loginThunk, logout, verifyInvitationThunk,refreshAuthThunk, profileUpdateThunk } from './authSlice';
import { authAPI } from './authAPI';
import { RootState } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { CreateOrganizationDTO, LoginDTO, SignupDTO } from '../../../../../../libs/shared/types/src';
import { UserProps } from '../../../../../../libs/domain/entities/user.entity';
import { OrgProps } from '../../../../../../libs/domain/entities/organization.entity';
import { orgAPI } from '../organization/orgAPI';

export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);

  const login = async (data: LoginDTO , role: 'user' | 'super_admin' | 'organization' ) => {
    await dispatch(loginThunk({...data,role})).unwrap();
  };

  const verifyInvitation =async (token: string) => {
    await dispatch(verifyInvitationThunk(token));
  }

  const signup = async (data: SignupDTO & { role: 'user' | 'super_admin' | 'organization' }) => {
    const { role, ...rest } = data;
    if (role === 'user') return authAPI.signupUser(rest);
    return authAPI.signupOrganization(rest);
  };

  const verifyOtp = async (data: { email: string; otp: string,name:string,password:string,orgId:string }) => {
    return authAPI.verifyOtp(data);
  };

  const verifyOrganization = async (data: CreateOrganizationDTO, otp: string) => {
    return authAPI.verifyOrg(data,otp)
  }

  const profileUpdate = async (id:string,data: Partial<UserProps> | Partial <OrgProps>,role: 'user' | 'super_admin' | 'organization') => {
     await dispatch(profileUpdateThunk({data,role,id})).unwrap();
  }

  const logOut = async () => {
    await authAPI.logout();
    dispatch(logout());
  };

  const logOutOrganization = async () => {
    //todo : make a api call 
    dispatch(logout());
  }

  const refreshAuth = async ({ id, role }: { id: string, role: 'user' | 'super_admin' | 'organization'  }) => {
    await dispatch(refreshAuthThunk({id,role}))
  }
 
  return { ...auth, login, signup, verifyOtp, logOut,verifyOrganization, verifyInvitation, refreshAuth,logOutOrganization ,profileUpdate };
}