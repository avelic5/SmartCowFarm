export type StatusZdravlja = 'Aktivna' | 'Neaktivna' | 'PodNadzorom' | 'Prodana';
export type Prioritet = 'Nizak' | 'Srednji' | 'Visok' | 'Kritican';
export type StatusZadatka = 'Kreiran' | 'Obrada' | 'Zavrsen' | 'Otkazan';
export type TipZadatka = string;
export type TipUpozorenja = 'Senzor' | 'Manuelni' | 'Sistemski';
export type NivoUpozorenja = 'Status' | 'Upozorenje' | 'Kriticno';
export type StatusUpozorenja = 'Poslan' | 'U_Obradi' | 'Zavrsen';

export type TipSenzora = 'Temperatura' | 'Pokret' | 'Protok' | 'Okruzenje';
export type StatusOcitavanja = string;

export interface KravaDto {
  idKrave: number;
  oznakaKrave: string;
  rasa: string;
  datumRodjenja: string;
  datumDolaska: string;
  porijekloTip: string;
  idMajke?: number | null;
  trenutniStatus: StatusZdravlja;
  pocetnaTezina: number;
  trenutnaProcijenjenaTezina: number;
  opisIzgleda: string;
  prosjecnaDnevnaProizvodnjaL: number;
  napomene: string;
}

export interface MuzaDto {
  idMuze: number;
  idKrave: number;
  datum: string;
  vrijemePocetka: string;
  vrijemeZavrsretka: string;
  kolicinaLitara: number;
  prosjecanProtokLMin: number;
  temperaturaMlijeka: number;
  nacinUnosa: string;
  oznakaOdstupanja: string;
  napomena: string;
}

export interface UpozorenjeDto {
  idUpozorenja: number;
  tipUpozorenja: TipUpozorenja;
  nivoUpozorenja: NivoUpozorenja;
  opis: string;
  razlogAktiviranja: string;
  vrijemeDetekcije: string;
  idKrave?: number | null;
  idSenzora?: number | null;
  idZadatka?: number | null;
  kanaliSlani: string;
  vrijemePrveReakcije?: string | null;
  idOsobaPreuzela?: number | null;
  statusUpozorenja: StatusUpozorenja;
  napomena: string;
}

export interface ZadatakDto {
  idZadatka: number;
  nazivZadatka: string;
  opis: string;
  prioritet: Prioritet;
  tipZadatka: TipZadatka;
  idKrave?: number | null;
  izvor: string;
  idKreator: number;
  idIzvrsilac?: number | null;
  rokIzvrsenja: string;
  vrijemePocetka?: string | null;
  vrijemeZavrsEtka?: string | null;
  statusZadatka: StatusZadatka;
  utroseniResursiOpis: string;
  napomene: string;
}

export interface SenzorDto {
  idSenzora: number;
  tipSenzora: TipSenzora;
  jedinicaMjere: string;
  naziv: string;
  opis: string;
  pragNormalnoMin: number;
  pragNormalnoMax: number;
  pragCriticalMin: number;
  pragCriticalMax: number;
  datumKalibracije: string;
  status: StatusOcitavanja;
}

export interface OcitanjeSenzoraDto {
  idOcitanja: number;
  idSenzora: number;
  timestamp: string;
  vrijednost: number;
  statusOcitanja: StatusOcitavanja;
  napomena: string;
  idOsobeReagovala?: number | null;
}

export interface KorisnikDto {
  idKorisnika: number;
  ime: string;
  prezime: string;
  radnoMjesto: string;
  korisnickoIme: string;
  hashLozinke: string;
  telefon: string;
  email: string;
  datumZaposlenja: string;
  odjel: string;
  statusNaloga: string;
  napomene: string;
}

export interface ZdravstveniSlucajDto {
  idSlucaja: number;
  idKrave: number;
  datumOtvaranja: string;
  vrijemeOtvaranja: string;
  razlogOtvaranja: string;
  opisSimptoma: string;
  aiTipAnomalije: string;
  aiNivoRizika: string;
  dijagnoza: string;
  statusSlucaja: StatusZdravlja;
  idVeterinara?: number | null;
  datumZatvaranja: string;
  napomene: string;
}

export interface TerapijaDto {
  idTerapije: number;
  idSlucaja: number;
  nazivLijeka: string;
  doza: number;
  jedinicaMjere: string;
  trajanjeDana: number;
  ucestalost: string;
  datumPocetka: string;
  datumKraja: string;
  uputstvo: string;
  napomena: string;
}

export interface TerapijaAplikacijeDto {
  idAplikacije: number;
  idTerapije: number;
  datumVrijeme: string;
  primijenjenaKolicina: number;
  idIzvrsilac: number;
  napomena: string;
}

// DTO tipovi za izvještaje
export interface GenerisiIzvjestajDto {
  odDatum: DateOnly;
  doDatum: DateOnly;
  kravaId?: number;
  grupa?: string;
}

// Tip za DateOnly (ako već nemaš)
export type DateOnly = string; // Format: "YYYY-MM-DD"

// Tipovi za izvještaje (ako su potrebni za TypeScript)
export interface DailyProduction {
  datum: DateOnly;
  kolicina: number;
  prosjekProtoka: number;
}

export interface MonthlyReportData {
  odDatum: DateOnly;
  doDatum: DateOnly;
  dnevnaProizvodnja: DailyProduction[];
  ukupnoProizvodnje: number;
  prosjecnoDnevno: number;
  brojKrava: number;
  prosjecnoPoKravi: number;
}

export interface StatusCount {
  status: string;
  broj: number;
}

export interface HealthReportData {
  odDatum: DateOnly;
  doDatum: DateOnly;
  slucajevi: ZdravstveniSlucajDto[];
  ukupnoSlucajeva: number;
  poStatusu: StatusCount[];
}
