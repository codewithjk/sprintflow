
import { useEffect, useState } from 'react';
import debounce from 'lodash.debounce';
import { orgAPI } from './orgAPI';
import { setUser } from '../auth/authSlice';
import { useDispatch } from 'react-redux';
import { UpdateOrganizationDTO, UpdateUserDTO } from '../../../../../../libs/shared/types/src';

export function useOrganizations() {
  const [search, setSearch] = useState('');
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch()
  

  const fetchOrgs = async (searchValue: string) => {
    setLoading(true);
    try {
      const res = await orgAPI.getOrganizations({ search: searchValue, limit: 5 });
      setOrgs(res.data.orgs);
    } catch (err) {
      console.error('Failed to fetch orgs', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async ({ id, role ,data}: { id: string, role: 'user' | 'super_admin' | 'organization',data:Partial<UpdateOrganizationDTO> | Partial<UpdateUserDTO> }) => {
  
      try {
        let res;
  
        if (role === 'user') {
          res = await orgAPI.updateMember(id, data);
         
          dispatch(setUser(res.data.user))
          return res.data.user;
        }
        else if (role === "organization") {
          res = await orgAPI.updateOrg(id, data);

          dispatch(setUser(res.data.org))
          return res.data.org;
        }
  
      } catch (err: any) {
        throw new Error(err)
      }
    }

  const debouncedFetch = debounce(fetchOrgs, 400);

    useEffect(() => {
        const searchValue = search.trim();
    if (searchValue) {
      debouncedFetch(searchValue);
    } else {
      setOrgs([]);
    }
    return () => debouncedFetch.cancel();
  }, [search]);

  return {
    search,
    setSearch,
    orgs,
    loading,
    updateProfile
  };
}
