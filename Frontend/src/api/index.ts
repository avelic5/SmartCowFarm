import { apiFetch } from './http';
import type {
  KravaDto,
  KorisnikDto,
  MuzaDto,
  OcitanjeSenzoraDto,
  SenzorDto,
  TerapijaAplikacijeDto,
  TerapijaDto,
  UpozorenjeDto,
  ZadatakDto,
  ZdravstveniSlucajDto,
} from './dto';

export const api = {
  krave: {
    list: () => apiFetch<KravaDto[]>('/api/Krava'),
    get: (id: number) => apiFetch<KravaDto>(`/api/Krava/${id}`),
    create: (payload: Omit<KravaDto, 'idKrave'>) => apiFetch<KravaDto>('/api/Krava', { method: 'POST', body: JSON.stringify(payload) }),
    update: (id: number, payload: KravaDto) => apiFetch<void>(`/api/Krava/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
    delete: (id: number) => apiFetch<void>(`/api/Krava/${id}`, { method: 'DELETE' }),
  },
  muze: {
    list: () => apiFetch<MuzaDto[]>('/api/Muza'),
  },
  upozorenja: {
    list: () => apiFetch<UpozorenjeDto[]>('/api/Upozorenje'),
    update: (id: number, payload: UpozorenjeDto) =>
      apiFetch<void>(`/api/Upozorenje/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  },
  zadaci: {
    list: () => apiFetch<ZadatakDto[]>('/api/Zadatak'),
    update: (id: number, payload: ZadatakDto) => apiFetch<void>(`/api/Zadatak/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  },
  korisnici: {
    list: () => apiFetch<KorisnikDto[]>('/api/Korisnik'),
    get: (id: number) => apiFetch<KorisnikDto>(`/api/Korisnik/${id}`),
  },
  senzori: {
    list: () => apiFetch<SenzorDto[]>('/api/Senzor'),
  },
  ocitanjaSenzora: {
    list: () => apiFetch<OcitanjeSenzoraDto[]>('/api/OcitanjeSenzora'),
  },
  zdravstveniSlucajevi: {
    list: () => apiFetch<ZdravstveniSlucajDto[]>('/api/ZdravstveniSlucaj'),
  },
  terapije: {
    list: () => apiFetch<TerapijaDto[]>('/api/Terapija'),
  },
  terapijeAplikacije: {
    list: () => apiFetch<TerapijaAplikacijeDto[]>('/api/TerapijaAplikacije'),
  },
};
