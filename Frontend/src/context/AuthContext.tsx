import { createContext, useContext, useState, ReactNode } from 'react';
import { Korisnik } from '../types';
import { api } from '../api';

function mapUloga(radnoMjesto: string | undefined): Korisnik['uloga'] {
  const v = (radnoMjesto ?? '').toLowerCase();
  if (v.includes('admin')) return 'administrator';
  if (v.includes('men')) return 'menadžer';
  if (v.includes('vet') || v.includes('veter')) return 'veterinar';
  return 'radnik';
}

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
    const emailNorm = (email ?? '').trim().toLowerCase();
    const lozinkaNorm = (lozinka ?? '').trim();

    if (!emailNorm || !lozinkaNorm) {
      throw new Error('Unesite email i lozinku.');
    }

    const korisnici = await api.korisnici.list();
    const match = korisnici.find((k) => {
      const emailValue = ((k as any).email ?? (k as any).Email ?? '') as string;
      return emailValue.trim().toLowerCase() === emailNorm;
    });
    if (!match) throw new Error('Neispravan email ili lozinka.');

    const stored = String((match as any).hashLozinke ?? (match as any).HashLozinke ?? '').trim();
    if (stored && stored !== lozinkaNorm) {
      throw new Error('Neispravan email ili lozinka.');
    }

    const ui: Korisnik = {
      id: String((match as any).idKorisnika ?? (match as any).IdKorisnika),
      ime:
        `${String((match as any).ime ?? (match as any).Ime ?? '')} ${String((match as any).prezime ?? (match as any).Prezime ?? '')}`.trim() ||
        String((match as any).korisnickoIme ?? (match as any).KorisnickoIme ?? email),
      email: ((match as any).email ?? (match as any).Email) as any,
      uloga: mapUloga(((match as any).radnoMjesto ?? (match as any).RadnoMjesto) as any),
      aktivan: true,
      datum_kreiranja: ((match as any).datumZaposlenja ?? (match as any).DatumZaposlenja) as any,
    };

    setKorisnik(ui);
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
