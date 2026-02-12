import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '@/utils/api';

interface Korisnik {
  IdKorisnika: number;
  Ime: string;
  Prezime: string;
  Email: string;
  KorisnickoIme: string;
  StatusNaloga: string;
  Telefon: string | null;
  RadnoMjesto: string;
  Odjel: string | null;
  DatumZaposlenja: string | null;
  Uloga: string;
}

interface PrijavaOdgovor {
  Poruka: string;
  Token: string;
  Istice: string;
  Korisnik: Korisnik;
}

interface AuthContextType {
  korisnik: Korisnik | null;
  token: string | null;
  prijava: (email: string, lozinka: string) => Promise<void>;
  odjava: () => Promise<void>;
  isLoading: boolean;
  jeAutentifikovan: boolean;
  azurirajToken: (noviToken: string) => void;
}

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth mora biti korišten unutar AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [korisnik, setKorisnik] = useState<Korisnik | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  
  const jeTokenIstekao = (token: string): boolean => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  const kolikoDoIsteka = (token: string): number => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      console.log("DO ISTEKA: ",Math.max(0, decoded.exp - currentTime)/60);
      return Math.max(0, decoded.exp - currentTime);
    } catch (error) {
      return 0;
    }
  };

  
  const ocistiPodatke = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('korisnik');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setKorisnik(null);
  };

  const izlogujKorisnika = () => {
    ocistiPodatke();
    if (window.location.pathname !== '/prijava') {
      window.location.href = '/prijava';
    }
  };

  
  const otvoriSesiju = (noviToken: string, noviKorisnik: Korisnik) => {
    localStorage.setItem('token', noviToken);
    localStorage.setItem('korisnik', JSON.stringify(noviKorisnik));
    setToken(noviToken);
    setKorisnik(noviKorisnik);
    api.defaults.headers.common['Authorization'] = `Bearer ${noviToken}`;
  };

  const osvjeziToken = async (): Promise<string | null> => {
    try {
      const trenutniToken = localStorage.getItem('token');
      if (!trenutniToken) return null;

      const response = await api.post('/Korisnik/refresh', null, {
        headers: { 'Authorization': `Bearer ${trenutniToken}` }
      });

      const noviToken = response.data.Token;
      const ucuvaniKorisnik = localStorage.getItem('korisnik');
      
      if (ucuvaniKorisnik && noviToken) {
        otvoriSesiju(noviToken, JSON.parse(ucuvaniKorisnik));
        return noviToken;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    const inicijalnoUcitavanje = async () => {
      const ucuvaniToken = localStorage.getItem('token');
      const ucuvaniKorisnik = localStorage.getItem('korisnik');

      if (ucuvaniToken && ucuvaniKorisnik) {
        try {
          if (jeTokenIstekao(ucuvaniToken)) {
            
            const noviToken = await osvjeziToken();
            
            if (!noviToken) {
              izlogujKorisnika();
            }
          } else {
            otvoriSesiju(ucuvaniToken, JSON.parse(ucuvaniKorisnik));
            
            // Postavi timer za automatski logout tačno kada token istekne
            const sekundiDoIsteka = kolikoDoIsteka(ucuvaniToken) * 1000;
            if (sekundiDoIsteka > 0) {
              setTimeout(() => {
                izlogujKorisnika();
              }, sekundiDoIsteka);
            }
          }
        } catch (error) {
          izlogujKorisnika();
        }
      }

      setIsLoading(false);
    };

    inicijalnoUcitavanje();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const trenutniToken = localStorage.getItem('token');
      
      if (trenutniToken) {
        if (jeTokenIstekao(trenutniToken)) {
          const noviToken = await osvjeziToken();
          if (!noviToken) {
            izlogujKorisnika();
          }
        }
      }
    }, 30000); 

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let jeRefresovan = false;

    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

  
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (jeRefresovan) {
            return Promise.reject(error);
          }

          jeRefresovan = true;

          try {
            const noviToken = await osvjeziToken();

            if (noviToken) {
              originalRequest.headers['Authorization'] = `Bearer ${noviToken}`;
              jeRefresovan = false;
              return api(originalRequest);
            }
          } catch (refreshError) {
            return null;
          }

          jeRefresovan = false;
          izlogujKorisnika();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);
  
  useEffect(() => {
    const handleBeforeUnload = () => {
      const trenutniToken = localStorage.getItem('token');
      if (trenutniToken && jeTokenIstekao(trenutniToken)) {
        ocistiPodatke();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);
  
  useEffect(() => {
    if (token) {
      const sekundiDoIsteka = kolikoDoIsteka(token) * 1000;
      
      if (sekundiDoIsteka > 0) {
        const timeoutId = setTimeout(() => {
          izlogujKorisnika();
        }, sekundiDoIsteka);

        return () => clearTimeout(timeoutId);
      } else {
        izlogujKorisnika();
      }
    }
  }, [token]);
  
  const prijava = async (email: string, lozinka: string) => {
    try {
      const isEmail = email.includes('@');
      const requestBody = isEmail
        ? { Email: email, Lozinka: lozinka }
        : { KorisnickoIme: email, Lozinka: lozinka };

      const response = await api.post('/Korisnik/autentifikuj', requestBody);
      const podaci: PrijavaOdgovor = response.data;
      
      otvoriSesiju(podaci.token, podaci.korisnik);
      
      const sekundiDoIsteka = kolikoDoIsteka(podaci.token) * 1000;
      setTimeout(() => {
        izlogujKorisnika();
      }, sekundiDoIsteka);
      
    } catch (error: any) {
      const backendMessage = error.response?.data?.poruka ||
        error.response?.data?.message ||
        error.message ||
        'Greška pri prijavi';

      if (error.response?.status === 401) {
        ocistiPodatke();
      }

      throw new Error(backendMessage);
    }
  };

  const odjava = async () => {
    try {
      await api.post('/Korisnik/odjava');
    } catch (error) {
      return null;
    } finally {
      izlogujKorisnika();
    }
  };

  const azurirajToken = (noviToken: string) => {
    const ucuvaniKorisnik = localStorage.getItem('korisnik');
    if (ucuvaniKorisnik) {
      otvoriSesiju(noviToken, JSON.parse(ucuvaniKorisnik));
    }
  };

  const jeAutentifikovan = !!token && !!korisnik;

  return (
    <AuthContext.Provider value={{
      korisnik,
      token,
      prijava,
      odjava,
      isLoading,
      jeAutentifikovan,
      azurirajToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
};