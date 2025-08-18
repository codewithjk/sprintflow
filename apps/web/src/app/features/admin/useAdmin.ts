import { useState } from 'react';
import { adminAPI } from './adminAPI';
import { OrganizationDTO, StripeCharge, StripeSubscription, UserDTO } from '../../../../../../libs/shared/types/src';
import { UserStatus } from '../../../../../../libs/domain/enums/user.enums';



export function useAdmin() {

    const [users, setUsers] = useState<UserDTO[]>([]);
    const [organizations, setOrganizations] = useState<OrganizationDTO[]>([]);
    const [fetchUsersLoading, setFetchUsersLoading] = useState<boolean>(false);

    const [fetchOrganizationsLoading, setFetchOrganizationLoading] = useState<boolean>(false);
    const [fetchUsersError, setFetchUsersError] = useState<string | null>(null);
    const [fetchOrganizationsError, setFetchOrganizationError] = useState<string | null>(null);

    const [updateUsersLoading, setUpdateUsersLoading] = useState<boolean>(false);
    const [updateUsersError, setUpdateUsersError] = useState<string | null>(null);



    const [subscriptions, setSubscriptions] = useState<StripeSubscription[]>([]);
    const [charges, setCharges] = useState<StripeCharge[]>([]);
    const [fetchSubscriptionsLoading, setFetchSubscriptionsLoading] = useState(false);
    const [fetchChargesLoading, setFetchChargesLoading] = useState(false);
    const [fetchSubscriptionsError, setFetchSubscriptionsError] = useState<string | null>(null);
    const [fetchChargesError, setFetchChargesError] = useState<string | null>(null);


    const fetchUsers = async (filters: Partial<UserDTO> & { page: number; limit: number }) => {
        setFetchUsersLoading(true);
        setFetchUsersError(null)
        try {
            const res = await adminAPI.getAllUsers(filters); 
            setUsers(res.data.users);
        } catch (error: any) {
            setFetchUsersError(error?.response?.data?.message || "Failed to fetch users.");
        } finally {
            setFetchUsersLoading(false);
        }
    };

    const updateUserStatus = async (userId: string, status: UserStatus) => {
        setUpdateUsersLoading(true);
        setUpdateUsersError(null);
        try {
            const response = await adminAPI.updateUserStatus(userId, status);
            const updatedUser = response.data.user;
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === updatedUser.id ? updatedUser : user
                )
            );
        } catch (error: any) {
            setUpdateUsersError(error?.response?.data?.message || 'Failed to update charges.');
        } finally {
            setUpdateUsersLoading(false)
        }
    }

    const fetchOrganizations = async (filters: Partial<OrganizationDTO> & { page: number; limit: number }) => {
        setFetchOrganizationLoading(true);
        setFetchOrganizationError(null);
        try {
            const res = await adminAPI.getAllOrganization(filters); 
            setOrganizations(res.data.orgs);
        } catch (error: any) {
            setFetchOrganizationError(error?.response?.data?.message || "Failed to fetch organization users.");
        } finally {
            setFetchOrganizationLoading(false);
        }
    };


    const fetchSubscriptions = async (limit: number, starting_after?: string) => {
        setFetchSubscriptionsLoading(true);
        setFetchSubscriptionsError(null)
        try {
            const res = await adminAPI.getSubscriptions(limit, starting_after);
            setSubscriptions(res.data.subscriptions);
        } catch (error: any) {
            setFetchSubscriptionsError(error?.response?.data?.message || 'Failed to fetch subscriptions.');
        } finally {
            setFetchSubscriptionsLoading(false);
        }
    };

    // 🔁 Fetch paginated Stripe charges
    const fetchCharges = async (limit: number, starting_after?: string) => {
        setFetchChargesLoading(true);
        setFetchChargesError(null);
        try {
            const res = await adminAPI.getCharges(limit, starting_after);
            setCharges(res.data.charges);
            return {
                hasMore: res.data.hasMore,
                lastId: res.data.lastId,
            };
        } catch (error: any) {
            setFetchChargesError(error?.response?.data?.message || 'Failed to fetch charges.');
        } finally {
            setFetchChargesLoading(false);
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
        fetchOrganizations,

        updateUserStatus,
        updateUsersError,
        updateUsersLoading,

        subscriptions,
        charges,
        fetchSubscriptionsLoading,
        fetchChargesLoading,
        fetchSubscriptionsError,
        fetchChargesError,
        fetchSubscriptions,
        fetchCharges,
    };
}
