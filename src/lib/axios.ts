import axios from "axios";

function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() ?? "";
    
    return "";
}

const api = axios.create({
    baseURL: "http://localhost:8000/api",
    withCredentials: true,
    headers: {
        Accept: "application/json"
    }
});

api.interceptors.request.use(config => {
    const token = getCookie("auth_token");
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            try { document.cookie = "auth_token=;path=/;max-age=0"; } catch {}
        }
        return Promise.reject(error);
    }
);

export default api;