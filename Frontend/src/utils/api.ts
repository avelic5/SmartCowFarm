import axios from "axios";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_LOCAL_BACKEND_URL;

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor za dodavanje tokena u zahtjeve
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor za rukovanje greškama
// api.ts - MODIFIKUJ error interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {

    // AŽURIRAJ ERROR OBJECT SA BACKEND PORUKOM
    if (error.response?.data) {
      // Backende vraća "Poruka" (sa velikim P)
      const backendMessage =
        error.response.data.Poruka ||
        error.response.data.message ||
        error.response.data.Message;

      if (backendMessage) {
        // Kreiraj novi error sa backend porukom
        error.message = backendMessage;

        // Dodaj custom property za lakši pristup
        error.backendMessage = backendMessage;
      }
    }

    // Ako je 401 Unauthorized
    if (error.response?.status === 401) {
      // Očisti token samo ako NIJE login endpoint
      if (!error.config?.url?.includes("/autentifikuj")) {
        localStorage.removeItem("token");
        localStorage.removeItem("korisnik");

        // Redirektaj na login samo ako nismo već na login stranici
        if (!window.location.pathname.includes("/prijava")) {
          window.location.href = "/prijava";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
