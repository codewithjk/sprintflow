import { useState } from "react";
import { orgAPI } from "./orgAPI";
import { UserDTO } from "../../../../../../libs/shared/types/src";


export function useMember() {
    const [members, setMembers] = useState<UserDTO[]>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

     const [total, setTotal] = useState(0);
     const [page, setPage] = useState(1); 
     const [pageSize, setPageSize] = useState(10); 

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
            setMembers(res.data.members);
              setTotal(res.data.total);
      setPage(res.data.page);
      setPageSize(res.data.pageSize);
        } catch (error: any) {
            const message = error?.response?.data?.message || 'Failed to send invitation';
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }


    return {
        total,
        page,
        pageSize,
        members,
        loading,
        error,
        inviteNewMember,
        getAllMembers,
    };
}
