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
  {
    id: '4',
    identifikacioniBroj: 'BOS-004',
    ime: 'Jasna',
    starost: 4,
    pasmina: 'Holštajn',
    status: 'zdrava',
    datumRodjenja: '2020-09-02',
    tezina: 640,
    prosjecnaProdukcija: 31.2,
    zadnjaProdukcija: 33.0,
  },
  {
    id: '5',
    identifikacioniBroj: 'BOS-005',
    ime: 'Nada',
    starost: 6,
    pasmina: 'Simentalac',
    status: 'zdrava',
    datumRodjenja: '2018-12-14',
    tezina: 690,
    prosjecnaProdukcija: 29.5,
    zadnjaProdukcija: 30.1,
  },
  {
    id: '6',
    identifikacioniBroj: 'BOS-006',
    ime: 'Iva',
    starost: 2,
    pasmina: 'Holštajn',
    status: 'praćenje',
    datumRodjenja: '2023-03-21',
    tezina: 520,
    prosjecnaProdukcija: 24.0,
    zadnjaProdukcija: 22.8,
    zadnjiPregled: '2025-11-30',
  },
  {
    id: '7',
    identifikacioniBroj: 'BOS-007',
    ime: 'Vesna',
    starost: 3,
    pasmina: 'Holštajn',
    status: 'lijecenje',
    datumRodjenja: '2022-01-11',
    tezina: 600,
    prosjecnaProdukcija: 26.7,
    zadnjaProdukcija: 18.4,
    zadnjiPregled: '2025-12-02',
    zadnjeVakcinisanje: '2025-09-15',
    napomene: 'Antibiotska terapija - 5 dana',
  },
  {
    id: '8',
    identifikacioniBroj: 'BOS-008',
    ime: 'Sara',
    starost: 4,
    pasmina: 'Simentalac',
    status: 'zdrava',
    datumRodjenja: '2020-07-18',
    tezina: 630,
    prosjecnaProdukcija: 30.4,
    zadnjaProdukcija: 31.0,
  },
  {
    id: '9',
    identifikacioniBroj: 'BOS-009',
    ime: 'Ljilja',
    starost: 5,
    pasmina: 'Holštajn',
    status: 'praćenje',
    datumRodjenja: '2019-06-07',
    tezina: 655,
    prosjecnaProdukcija: 27.9,
    zadnjaProdukcija: 25.3,
  },
  {
    id: '10',
    identifikacioniBroj: 'BOS-010',
    ime: 'Anka',
    starost: 3,
    pasmina: 'Holštajn',
    status: 'zdrava',
    datumRodjenja: '2021-10-29',
    tezina: 610,
    prosjecnaProdukcija: 29.1,
    zadnjaProdukcija: 30.0,
  },
  {
    id: '11',
    identifikacioniBroj: 'BOS-011',
    ime: 'Mira',
    starost: 6,
    pasmina: 'Simentalac',
    status: 'zdrava',
    datumRodjenja: '2018-05-05',
    tezina: 700,
    prosjecnaProdukcija: 28.8,
    zadnjaProdukcija: 29.2,
  },
  {
    id: '12',
    identifikacioniBroj: 'BOS-012',
    ime: 'Katja',
    starost: 4,
    pasmina: 'Holštajn',
    status: 'zdrava',
    datumRodjenja: '2020-02-12',
    tezina: 645,
    prosjecnaProdukcija: 31.7,
    zadnjaProdukcija: 32.4,
  },
  {
    id: '13',
    identifikacioniBroj: 'BOS-013',
    ime: 'Ena',
    starost: 2,
    pasmina: 'Simentalac',
    status: 'zdrava',
    datumRodjenja: '2023-08-30',
    tezina: 510,
    prosjecnaProdukcija: 23.5,
    zadnjaProdukcija: 24.1,
  },
  {
    id: '14',
    identifikacioniBroj: 'BOS-014',
    ime: 'Dora',
    starost: 5,
    pasmina: 'Holštajn',
    status: 'zdrava',
    datumRodjenja: '2019-04-08',
    tezina: 675,
    prosjecnaProdukcija: 30.2,
    zadnjaProdukcija: 29.8,
  },
  {
    id: '15',
    identifikacioniBroj: 'BOS-015',
    ime: 'Lana',
    starost: 3,
    pasmina: 'Holštajn',
    status: 'zdrava',
    datumRodjenja: '2021-12-22',
    tezina: 605,
    prosjecnaProdukcija: 27.4,
    zadnjaProdukcija: 28.0,
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
