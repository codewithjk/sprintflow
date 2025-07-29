import { useState } from "react";
import { orgAPI } from "./orgAPI";
import { UserProps } from "../../../../../../libs/domain/entities/user.entity";


export function useMember() {
    const [members, setMembers] = useState<UserProps[]>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inviteNewMember = async (data: { name: string, email: string }) => {
        setLoading(true);
        setError(null);
        try {
            return await orgAPI.createInvitation(data);
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Failed to send invitation';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const getAllMembers = async (params: { page: number, limit: number }) => {
        setLoading(true);
        setError(null);
        try {
            const res = await orgAPI.getAllMembers(params);
            console.log(res)
            setMembers(res.data.members);
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Failed to send invitation';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }


    return {
        members,
        loading,
        error,
        inviteNewMember,
        getAllMembers,
    };
}
