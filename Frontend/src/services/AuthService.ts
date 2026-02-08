// src/services/authService.ts
import api from "../utils/api";

export interface UserData {
  idKorisnika: number;
  ime: string;
  prezime: string;
  email: string;
  korisnickoIme: string;
  statusNaloga: string;
  telefon: string;
  radnoMjesto: string;
  datumZaposljenja: string;
  odjel: string;
}

export interface LoginResponse {
  poruka: string;
  token: string;
  istice: string;
  korisnik: UserData;
}

export interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  data?: any;
  params?: any;
}

export class AuthService {
  private static readonly TOKEN_KEY = "token";
  private static readonly USER_KEY = "korisnik";

  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.post("/Korisnik/autentifikuj", {
        email,
        lozinka: password,
      });

      const data: LoginResponse = response.data;

      // Sačuvaj token i korisnika
      this.setToken(data.token);
      this.setUser(data.korisnik);

      // Postavi default Authorization header za buduće zahtjeve
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      return data;
    } catch (error: any) {
      if (error.response?.data?.poruka) {
        throw new Error(error.response.data.poruka);
      }
      throw new Error("Greška pri prijavi. Provjeri konekciju sa serverom.");
    }
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    // Ukloni Authorization header
    delete api.defaults.headers.common["Authorization"];
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getUser(): UserData | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    // Ažuriraj axios header
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  static setUser(user: UserData): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Helper metode koje koriste axios api
  static async get<T>(url: string, config?: FetchOptions): Promise<T> {
    const response = await api.get<T>(url, config);
    return response.data;
  }

  static async post<T>(
    url: string,
    data?: any,
    config?: FetchOptions,
  ): Promise<T> {
    const response = await api.post<T>(url, data, config);
    return response.data;
  }

  static async put<T>(
    url: string,
    data?: any,
    config?: FetchOptions,
  ): Promise<T> {
    const response = await api.put<T>(url, data, config);
    return response.data;
  }

  static async delete<T>(url: string, config?: FetchOptions): Promise<T> {
    const response = await api.delete<T>(url, config);
    return response.data;
  }

  // Metoda za refresh tokena (ako endpoint postoji)
  static async refreshToken(): Promise<string> {
    try {
      const response = await api.post("/Korisnik/refresh");
      const noviToken = response.data.token;
      this.setToken(noviToken);
      return noviToken;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  // Metoda za promjenu lozinke
  static async promjeniLozinku(
    id: number,
    staraLozinka: string,
    novaLozinka: string,
  ): Promise<void> {
    await api.put(`/Korisnik/${id}/promjeniLozinku`, {
      staraLozinka,
      novaLozinka,
    });
  }

  // Metoda za ažuriranje kontakata
  static async azurirajKontakt(
    id: number,
    email?: string,
    telefon?: string,
  ): Promise<void> {
    await api.put(`/Korisnik/${id}/azurirajKontakt`, {
      email,
      telefon,
    });
  }

  // Metoda za dobijanje korisnika po ID
  static async getKorisnik(id: number): Promise<UserData> {
    const response = await api.get(`/Korisnik/${id}`);
    return response.data;
  }

  // Metoda za dobijanje svih korisnika (samo za admina)
  static async getSviKorisnici(): Promise<UserData[]> {
    const response = await api.get("/Korisnik");
    return response.data;
  }
}
