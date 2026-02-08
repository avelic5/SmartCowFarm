import React, { createContext, useContext, useState, useEffect } from 'react';
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthContext.tsx - dodaj ovo
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

  useEffect(() => {
    const ucuvaniToken = localStorage.getItem('token');
    const ucuvaniKorisnik = localStorage.getItem('korisnik');

    if (ucuvaniToken && ucuvaniKorisnik) {
      try {
        setToken(ucuvaniToken);
        setKorisnik(JSON.parse(ucuvaniKorisnik));

        // Postavi default header za axios
        api.defaults.headers.common['Authorization'] = `Bearer ${ucuvaniToken}`;
      } catch (error) {
        ocistiPodatke();
      }
    }

    setIsLoading(false);
  }, []);

  const ocistiPodatke = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('korisnik');

    // Ukloni Authorization header iz axios
    delete api.defaults.headers.common['Authorization'];

    setToken(null);
    setKorisnik(null);
  };

  const prijava = async (email: string, lozinka: string) => {
    try {
      const isEmail = email.includes('@');

      const requestBody = isEmail
        ? { Email: email, Lozinka: lozinka }  // Veliko E za Email
        : { KorisnickoIme: email, Lozinka: lozinka }; // Ili korisničko ime

      const response = await api.post('/Korisnik/autentifikuj', requestBody);

      const podaci: PrijavaOdgovor = response.data;
      // Sačuvaj u localStorage
      localStorage.setItem('token', podaci.token);
      localStorage.setItem('korisnik', JSON.stringify(podaci.korisnik));

      // Postavi state
      setToken(podaci.token);
      setKorisnik(podaci.korisnik);
      api.defaults.headers.common['Authorization'] = `Bearer ${podaci.token}`;

    } catch (error: any) {
      const backendMessage = error.response?.data?.poruka ||
        error.response?.data?.message ||
        error.message ||
        'Greška pri prijavi';

      // Ako je 401, očisti lokalne podatke
      if (error.response?.status === 401) {
        ocistiPodatke();
      }

      throw new Error(backendMessage);;
    }
  };

  const odjava = () => {
    ocistiPodatke();
  };

  const azurirajToken = (noviToken: string) => {
    localStorage.setItem('token', noviToken);
    setToken(noviToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${noviToken}`;
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