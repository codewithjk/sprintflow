// libs/hooks/useOrganizations.ts
import { useEffect, useState } from 'react';

import debounce from 'lodash.debounce';
import { orgAPI } from '../organization/orgAPI';

export function useOrganizations() {
  const [search, setSearch] = useState('');
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrgs = async (searchValue: string) => {
    setLoading(true);
    try {
      const res = await orgAPI.getOrganizations({ search: searchValue, limit: 5 });
      console.log(res)
      setOrgs(res.data.orgs);
    } catch (err) {
      console.error('Failed to fetch orgs', err);
    } finally {
      setLoading(false);
    }
  };

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
  };
}
