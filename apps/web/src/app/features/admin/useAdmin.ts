


import { useState } from 'react';
import { Organization, OrgProps } from '../../../../../../libs/domain/entities/organization.entity';
import { UserProps } from '../../../../../../libs/domain/entities/user.entity';
import { adminAPI } from './adminAPI';


export function useAdmin() {

    const [users, setUsers] = useState<UserProps[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [fetchUsersLoading, setFetchUsersLoading] = useState<boolean>(false);
    const [fetchOrganizationsLoading, setFetchOrganizationLoading] = useState<boolean>(false);
    const [fetchUsersError, setFetchUsersError] = useState<string | null>(null);
    const [fetchOrganizationsError, setFetchOrganizationError] = useState<string | null>(null);

    const fetchUsers = async (filters: Partial<UserProps> & { page: number; limit: number }) => {
        setFetchUsersLoading(true);
        try {
            const res = await adminAPI.getAllUsers(filters); // replace with your actual API method
            setUsers(res.data.users);
        } catch (error: any) {
            setFetchUsersError(error?.response?.data?.message || "Failed to fetch users.");
        } finally {
            setFetchUsersLoading(false);
        }
    };

    const fetchOrganizations = async (filters: Partial<OrgProps> & { page: number; limit: number }) => {
        setFetchOrganizationLoading(true);
        try {
            const res = await adminAPI.getAllOrganization(filters); // replace with your actual API method
            setOrganizations(res.data.orgs);
        } catch (error: any) {
            setFetchOrganizationError(error?.response?.data?.message || "Failed to fetch organization users.");
        } finally {
            setFetchOrganizationLoading(false);
        }
    };


    return {
        users,
        organizations,
        fetchUsersError,
        fetchOrganizationsError,
        fetchUsersLoading,
        fetchOrganizationsLoading,
        fetchUsers,
        fetchOrganizations
    };
}
