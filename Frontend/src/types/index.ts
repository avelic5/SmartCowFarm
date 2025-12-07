// Tipovi podataka za aplikaciju

export interface Krava {
  id: string;
  identifikacioniBroj: string;
  ime: string;
  starost: number;
  pasmina: string;
  status: 'zdrava' | 'lijecenje' | 'praćenje';
  datumRodjenja: string;
  tezina: number;
  prosjecnaProdukcija: number;
  zadnjaProdukcija?: number;
  zadnjiPregled?: string;
  zadnjeVakcinisanje?: string;
  napomene?: string;
}

export interface ProdukcijaMlijeka {
  id: string;
  kravaId: string;
  datum: string;
  litri: number;
  jutro?: number;
  podne?: number;
  veče?: number;
  kvalitet: 'odlična' | 'dobra' | 'prosječna';
}

export interface ZdravstveniZapis {
  id: string;
  kravaId: string;
  datum: string;
  tip: 'pregled' | 'liječenje' | 'vakcinacija' | 'reprodukcija';
  opis: string;
  veterinar?: string;
  dijagnoza?: string;
  terapija?: string;
  napomena?: string;
}

export interface Upozorenje {
  id: string;
  tip: 'kritično' | 'upozorenje' | 'info';
  naslov: string;
  poruka: string;
  datum: string;
  kravaId?: string;
  pročitano: boolean;
  akcija?: string;
}

export interface Zadatak {
  id: string;
  naslov: string;
  opis: string;
  prioritet: 'visok' | 'srednji' | 'nizak';
  status: 'novo' | 'u-toku' | 'završeno';
  rokIzvršenja: string;
  dodijeljeno?: string;
  kravaId?: string;
}

export interface SenzorskiPodaci {
  zona: string;
  temperatura: number;
  vlažnost: number;
  status: 'dobro' | 'upozorenje' | 'kritično';
  poslednjeAžuriranje?: string;
}

export interface Korisnik {
  id: string;
  ime: string;
  email: string;
  uloga: 'administrator' | 'menadžer' | 'veterinar' | 'radnik';
  aktivan: boolean;
  datum_kreiranja: string;
}

export interface Izvještaj {
  id: string;
  tip: 'proizvodnja' | 'zdravlje' | 'finansije' | 'inventar';
  naziv: string;
  period: string;
  kreiran: string;
  podaci?: any;
}
