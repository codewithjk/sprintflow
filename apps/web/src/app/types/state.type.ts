import { User } from "../../../../../libs/shared/types/src";

//redux initial states
export interface AuthState{
    user: User | null;
    isLoading: boolean;
    error: string | null;
}