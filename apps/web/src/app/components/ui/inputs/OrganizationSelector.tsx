// features/auth/components/OrganizationSelector.tsx

import { useState } from 'react';
import { useOrganizations } from '../../../features/organization/useOrganization';

export function OrganizationSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string, label: string) => void;
}) {
  const { search, setSearch, orgs, loading } = useOrganizations();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = (org: any) => {
    onChange(org.id, org.name);
    setSearch(org.name);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowDropdown(true);
        }}
        placeholder="Search organization..."
        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {showDropdown && search.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-md max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-2 text-gray-500 text-sm">Loading...</div>
          ) : orgs.length > 0 ? (
            orgs.map((org: any) => (
              <div
                key={org.id}
                onClick={() => handleSelect(org)}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
              >
                {org.name}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-400 text-sm">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
