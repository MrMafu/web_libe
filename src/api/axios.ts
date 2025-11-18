import axios, { AxiosError } from "axios";

/**
 * Ambil cookie berdasarkan nama
 */
function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? "";
  return "";
}

/**
 * Buat instance axios untuk API Laravel
 */
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // bisa ganti ke process.env.NEXT_PUBLIC_API_URL
  withCredentials: false, // pakai token Bearer, bukan cookie Sanctum
  headers: {
    Accept: "application/json",
  },
});

/**
 * Tambah interceptor supaya semua request kirim token Bearer otomatis
 */
api.interceptors.request.use((config) => {
  const token = getCookie("auth_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Tangani response & error dengan lebih aman
 */
api.interceptors.response.use(
  (response) => {
    // Laravel ApiResponse sukses biasanya di dalam .data
    return response.data ?? response;
  },
  (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      // hapus cookie token jika expired / unauthorized
      try {
        document.cookie = "auth_token=;path=/;max-age=0";
      } catch {}
    }

    const message =
      (error.response?.data?.message as string) ||
      error.message ||
      "Request failed";

    return Promise.reject({
      status: error.response?.status,
      message,
      data: error.response?.data,
    });
  }
);

export default api;
