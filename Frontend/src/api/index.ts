import { apiFetch } from "./http";
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
  GenerisiIzvjestajDto,
} from "./dto";

export const api = {
  krave: {
    list: () => apiFetch<KravaDto[]>("/Krava"),
    get: (id: number) => apiFetch<KravaDto>(`/Krava/${id}`),
    create: (payload: Omit<KravaDto, "idKrave">) =>
      apiFetch<KravaDto>("/Krava", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    update: (id: number, payload: KravaDto) =>
      apiFetch<void>(`/Krava/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    delete: (id: number) =>
      apiFetch<void>(`/Krava/${id}`, { method: "DELETE" }),
  },
  muze: {
    list: () => apiFetch<MuzaDto[]>("/Muza"),
  },
  upozorenja: {
    list: () => apiFetch<UpozorenjeDto[]>("/Upozorenje"),
    update: (id: number, payload: UpozorenjeDto) =>
      apiFetch<void>(`/Upozorenje/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
  },
  zadaci: {
    list: () => apiFetch<ZadatakDto[]>("/api/Zadatak"),
    update: (id: number, payload: ZadatakDto) =>
      apiFetch<void>(`/Zadatak/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
  },
  korisnici: {
    list: () => apiFetch<KorisnikDto[]>("/Korisnik"),
    get: (id: number) => apiFetch<KorisnikDto>(`/Korisnik/${id}`),
  },
  senzori: {
    list: () => apiFetch<SenzorDto[]>("/Senzor"),
  },
  ocitanjaSenzora: {
    list: () => apiFetch<OcitanjeSenzoraDto[]>("/OcitanjeSenzora"),
  },
  zdravstveniSlucajevi: {
    list: () => apiFetch<ZdravstveniSlucajDto[]>("/ZdravstveniSlucaj"),
  },
  terapije: {
    list: () => apiFetch<TerapijaDto[]>("/Terapija"),
  },
  terapijeAplikacije: {
    list: () => apiFetch<TerapijaAplikacijeDto[]>("/TerapijaAplikacije"),
  },
  izvjestaji: {
    // 1. Generiši mjesečni izvještaj proizvodnje
    mjesecnaProizvodnja: (payload: GenerisiIzvjestajDto) =>
      apiFetch<Blob>("/Izvjestaji/mjesecnaProizvodnja", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    // 2. Generiši karton krave
    kartonKrave: (kravaId: number) =>
      apiFetch<Blob>(`/Izvjestaji/kartonKrave/${kravaId}`, {
        method: "POST",
      }),

    // 3. Generiši zdravstveni izvještaj
    zdravstveniIzvjestaj: (payload: GenerisiIzvjestajDto) =>
      apiFetch<Blob>("/Izvjestaji/zdravstveniIzvjestaj", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    // 4. Generiši izvještaj senzora
    izvjestajSenzora: (payload: GenerisiIzvjestajDto) =>
      apiFetch<Blob>("/Izvjestaji/izvjestajSenzora", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
};
