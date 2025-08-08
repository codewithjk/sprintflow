


import { useState } from 'react';
import { Organization, OrgProps } from '../../../../../../libs/domain/entities/organization.entity';
import { UserProps } from '../../../../../../libs/domain/entities/user.entity';
import { adminAPI } from './adminAPI';
import { StripeCharge, StripeSubscription } from '../../../../../../libs/shared/types/src';


export function useAdmin() {

    const [users, setUsers] = useState<UserProps[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [fetchUsersLoading, setFetchUsersLoading] = useState<boolean>(false);
    const [fetchOrganizationsLoading, setFetchOrganizationLoading] = useState<boolean>(false);
    const [fetchUsersError, setFetchUsersError] = useState<string | null>(null);
    const [fetchOrganizationsError, setFetchOrganizationError] = useState<string | null>(null);


    const [subscriptions, setSubscriptions] = useState<StripeSubscription[]>([]);
    const [charges, setCharges] = useState<StripeCharge[]>([]);
    const [fetchSubscriptionsLoading, setFetchSubscriptionsLoading] = useState(false);
    const [fetchChargesLoading, setFetchChargesLoading] = useState(false);
    const [fetchSubscriptionsError, setFetchSubscriptionsError] = useState<string | null>(null);
    const [fetchChargesError, setFetchChargesError] = useState<string | null>(null);


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

    // 🔁 Fetch paginated Stripe subscriptions
    const fetchSubscriptions = async (limit: number, starting_after?: string) => {
        setFetchSubscriptionsLoading(true);
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
        try {
            const res = await adminAPI.getCharges(limit, starting_after);
            setCharges(res.data.charges);
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
