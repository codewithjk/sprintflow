
import axios from "axios";


import { SERVER_URL } from "../app/constants/env.constant";
import { store } from "../app/store/store";
import { logout } from "../app/features/auth/authSlice";
const axiosInstance = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true
}
);


let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

//handle logout and prevent infinite loops
const handleLogout = () => {
    
    const role = store.getState().auth.user?.role; //todo: clear project and tasks also
    store.dispatch(logout())
    // if (window.location.pathname !== "/login") {
    //     window.location.href = "/login"
    // }
    if (role === 'organization') {
        window.location.href = '/org/login';
    } else {
        window.location.href = '/login';
    }
};

// handle adding a new access token to queued requests
const subscribeTokenRefresh = (callback: () => void) => {
    refreshSubscribers.push(callback)
}

//Execute queued requests after refresh
const onRefreshSuccess = () => {
    refreshSubscribers.forEach((callback) => callback());
    refreshSubscribers = []
}

//handling the api request
axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

//Handle expired tokens and refresh logic
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        //prevent infinity retry loop
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => resolve(axiosInstance(originalRequest)));
                });
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                await axios.post(`${SERVER_URL}auth/refresh`, {}, { withCredentials: true });
                isRefreshing = false;
                onRefreshSuccess();
                return axiosInstance(originalRequest);
            } catch (error) {
                isRefreshing = false;
                refreshSubscribers = [];
                handleLogout();
                return Promise.reject(error)

            }
        }
        return Promise.reject(error)
    }

)

export default axiosInstance;