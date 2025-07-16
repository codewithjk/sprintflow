
//redux initial states
export interface AuthState{
    user: Object | null;
    isLoading: boolean;
    error: string | null;
}