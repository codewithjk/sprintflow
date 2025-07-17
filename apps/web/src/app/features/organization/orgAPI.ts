import axios from '../../../utils/axiosInstance';

export const orgAPI = {

    getOrganizations: (params: { search?: string; page?: number; limit?: number }) =>
        axios.get('/org', { params })
};
