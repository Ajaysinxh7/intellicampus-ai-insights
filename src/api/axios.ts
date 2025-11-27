import axios, {
    AxiosError,
    AxiosRequestConfig,
    InternalAxiosRequestConfig,
    } from "axios";

    const api = axios.create({
    baseURL: "http://localhost:8083/api",
    withCredentials: true,
    });

    // Request interceptor – attach access token
    api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("accessToken");

        // Fix: ALWAYS use set() instead of manually editing headers
        if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
        }

        return config;
    },
    (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor – refresh token logic
    api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
        };

        if (error.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
            const refreshRes = await axios.post(
            "http://localhost:8080/api/refresh-token",
            {},
            { withCredentials: true }
            );

            const newAccessToken = (refreshRes.data as { accessToken: string })
            .accessToken;

            localStorage.setItem("accessToken", newAccessToken);

            // Fix: use set() again
            originalRequest.headers = originalRequest.headers || {};
            (originalRequest.headers as any).Authorization = `Bearer ${newAccessToken}`;

            return api(originalRequest);
        } catch (refreshErr) {
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
        }
        }

        return Promise.reject(error);
    }
    );

    export default api;
