import { createContext, useContext, useState, ReactNode } from 'react';
import { Krava, ProdukcijaMlijeka, ZdravstveniZapis, Upozorenje, Zadatak } from '../types';

interface DataContextType {
  krave: Krava[];
  produkcijaMlijeka: ProdukcijaMlijeka[];
  zdravstveniZapisi: ZdravstveniZapis[];
  upozorenja: Upozorenje[];
  zadaci: Zadatak[];
  dodajKravu: (krava: Omit<Krava, 'id'>) => void;
  ažurirajKravu: (id: string, krava: Partial<Krava>) => void;
  obrišiKravu: (id: string) => void;
  dodajProdukciju: (produkcija: Omit<ProdukcijaMlijeka, 'id'>) => void;
  dodajZdravstveniZapis: (zapis: Omit<ZdravstveniZapis, 'id'>) => void;
  označiUpozorenjeKaoPročitano: (id: string) => void;
  ažurirajZadatak: (id: string, zadatak: Partial<Zadatak>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock podaci
const mockKrave: Krava[] = [
  {
    id: '1',
    identifikacioniBroj: 'BOS-001',
    ime: 'Slavica',
    starost: 4,
    pasmina: 'Holštajn',
    status: 'zdrava',
    datumRodjenja: '2020-03-15',
    tezina: 650,
    prosjecnaProdukcija: 32.5,
    zadnjaProdukcija: 34.2,
    zadnjiPregled: '2025-11-28',
  },
  {
    id: '2',
    identifikacioniBroj: 'BOS-002',
    ime: 'Milica',
    starost: 3,
    pasmina: 'Simentalac',
    status: 'zdrava',
    datumRodjenja: '2021-05-20',
    tezina: 580,
    prosjecnaProdukcija: 28.3,
    zadnjaProdukcija: 29.1,
  },
  {
    id: '3',
    identifikacioniBroj: 'BOS-003',
    ime: 'Ruža',
    starost: 5,
    pasmina: 'Holštajn',
    status: 'praćenje',
    datumRodjenja: '2019-08-10',
    tezina: 670,
    prosjecnaProdukcija: 30.8,
    zadnjaProdukcija: 26.5,
    zadnjiPregled: '2025-12-01',
  },
];

const mockUpozorenja: Upozorenje[] = [
  {
    id: '1',
    tip: 'kritično',
    naslov: 'Visoka temperatura u zoni C2',
    poruka: 'Temperatura u zoni C2 je dostigla 24.3°C što premašuje preporučeni limit',
    datum: new Date().toISOString(),
    pročitano: false,
  },
  {
    id: '2',
    tip: 'upozorenje',
    naslov: 'Pad proizvodnje - Ruža',
    poruka: 'Krava Ruža (BOS-003) pokazuje smanjenje proizvodnje od 14% u posljednjih 3 dana',
    datum: new Date().toISOString(),
    kravaId: '3',
    pročitano: false,
  },
];

const mockZadaci: Zadatak[] = [
  {
    id: '1',
    naslov: 'Vakcinacija - Grupa A',
    opis: 'Godišnja vakcinacija za krave u grupi A',
    prioritet: 'visok',
    status: 'novo',
    rokIzvršenja: '2025-12-10',
  },
  {
    id: '2',
    naslov: 'Provjera senzora - Zona B',
    opis: 'Rutinska provjera senzora temperature i vlažnosti',
    prioritet: 'srednji',
    status: 'u-toku',
    rokIzvršenja: '2025-12-08',
  },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [krave, setKrave] = useState<Krava[]>(mockKrave);
  const [produkcijaMlijeka, setProdukcijaMlijeka] = useState<ProdukcijaMlijeka[]>([]);
  const [zdravstveniZapisi, setZdravstveniZapisi] = useState<ZdravstveniZapis[]>([]);
  const [upozorenja, setUpozorenja] = useState<Upozorenje[]>(mockUpozorenja);
  const [zadaci, setZadaci] = useState<Zadatak[]>(mockZadaci);

  const dodajKravu = (krava: Omit<Krava, 'id'>) => {
    const novaKrava: Krava = {
      ...krava,
      id: Date.now().toString(),
    };
    setKrave([...krave, novaKrava]);
  };

  const ažurirajKravu = (id: string, promjene: Partial<Krava>) => {
    setKrave(krave.map(k => k.id === id ? { ...k, ...promjene } : k));
  };

  const obrišiKravu = (id: string) => {
    setKrave(krave.filter(k => k.id !== id));
  };

  const dodajProdukciju = (produkcija: Omit<ProdukcijaMlijeka, 'id'>) => {
    const novaProdukcija: ProdukcijaMlijeka = {
      ...produkcija,
      id: Date.now().toString(),
    };
    setProdukcijaMlijeka([...produkcijaMlijeka, novaProdukcija]);
  };

  const dodajZdravstveniZapis = (zapis: Omit<ZdravstveniZapis, 'id'>) => {
    const noviZapis: ZdravstveniZapis = {
      ...zapis,
      id: Date.now().toString(),
    };
    setZdravstveniZapisi([...zdravstveniZapisi, noviZapis]);
  };

  const označiUpozorenjeKaoPročitano = (id: string) => {
    setUpozorenja(upozorenja.map(u => u.id === id ? { ...u, pročitano: true } : u));
  };

  const ažurirajZadatak = (id: string, promjene: Partial<Zadatak>) => {
    setZadaci(zadaci.map(z => z.id === id ? { ...z, ...promjene } : z));
  };

  return (
    <DataContext.Provider
      value={{
        krave,
        produkcijaMlijeka,
        zdravstveniZapisi,
        upozorenja,
        zadaci,
        dodajKravu,
        ažurirajKravu,
        obrišiKravu,
        dodajProdukciju,
        dodajZdravstveniZapis,
        označiUpozorenjeKaoPročitano,
        ažurirajZadatak,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData mora biti korišten unutar DataProvider');
  }
  return context;
}
