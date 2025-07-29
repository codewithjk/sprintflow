import { useState } from "react";
import { orgAPI } from "./orgAPI";


export function useInvitations() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createInvitation = async (data: { name: string, email: string }) => {
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


  return {

    loading,
    error,
    createInvitation,
  };
}
