
import { RootState } from '../store/store';
import { useAppSelector } from '../store/hooks';


export function useRole() {
  const role = useAppSelector((state: RootState) => state.auth.user?.role);

  const isAdmin = role === 'super_admin';
  const isUser = role === 'user';
  const isOrganization = role === 'organization';

  const hasPermission = (allowedRoles: string[]) => {
    return allowedRoles.includes(role || '');
  };

  return {
    role,
    isAdmin,
    isUser,
    isOrganization,
    hasPermission,
  };
}
