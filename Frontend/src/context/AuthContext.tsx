import { createContext, useContext, useState, ReactNode } from 'react';
import { Korisnik } from '../types';

interface AuthContextType {
  korisnik: Korisnik | null;
  prijavljenKorisnik: boolean;
  prijava: (email: string, lozinka: string) => Promise<void>;
  odjava: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [korisnik, setKorisnik] = useState<Korisnik | null>(null);

  const prijava = async (email: string, lozinka: string) => {
    // Simulacija prijave - u produkciji ovdje ide API poziv
    const mockKorisnik: Korisnik = {
      id: '1',
      ime: 'Admin Korisnik',
      email: email,
      uloga: 'administrator',
      aktivan: true,
      datum_kreiranja: new Date().toISOString(),
    };
    setKorisnik(mockKorisnik);
  };

  const odjava = () => {
    setKorisnik(null);
  };

  return (
    <AuthContext.Provider
      value={{
        korisnik,
        prijavljenKorisnik: !!korisnik,
        prijava,
        odjava,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth mora biti korišten unutar AuthProvider');
  }
  return context;
}
