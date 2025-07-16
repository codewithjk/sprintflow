
import { loginThunk, logout } from './authSlice';
import { authAPI } from './authAPI';
import { RootState } from '../../store/store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

export function useAuth() {
    const dispatch = useAppDispatch();
  const auth = useAppSelector((state: RootState) => state.auth);

  const login = async (data: { email: string; password: string }) => {
    await dispatch(loginThunk(data));
  };

  const signup = async (data: { name: string; email: string; password: string }) => {
    return authAPI.signup(data);
  };

  const verifyOtp = async (data: { email: string; otp: string }) => {
    return authAPI.verifyOtp(data);
  };

  const logoutUser = async () => {
    await authAPI.logout();
    dispatch(logout());
  };

  return { ...auth, login, signup, verifyOtp, logoutUser };
}
