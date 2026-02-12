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
  AzurirajKorisnikaDto,
  NoviKorisnikDto,
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
    detalji: (id: number) => apiFetch<KorisnikDto>(`/Korisnik/${id}`),
    kreiraj: (data: NoviKorisnikDto) => {
      return apiFetch<KorisnikDto>("/Korisnik", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    azuriraj: (id: number, data: AzurirajKorisnikaDto) => {
      return apiFetch<KorisnikDto>(`/Korisnik/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    promjeniLozinku: (id: number, data: { novaLozinka: string }) => {
      return apiFetch(`/Korisnik/${id}/promjeniLozinku`, {
        method: "PUT",
        body: JSON.stringify({
          NovaLozinka: data.novaLozinka,
        }),
      });
    },
    obrisi: (id: number) => {
      return apiFetch(`/Korisnik/${id}`, {
        method: "DELETE",
      });
    },
    deaktiviraj: (id: number) => {
      return apiFetch(`/Korisnik/${id}/deaktivirajNalog`, {
        method: "PUT",
      });
    },
    aktiviraj: (id: number) => {
      return apiFetch(`/Korisnik/${id}/aktivirajNalog`, {
        method: "PUT",
      });
    },
    suspenduj: (id: number) => {
      return apiFetch(`/Korisnik/${id}/suspendujNalog`, {
        method: "PUT",
      });
    },
    dohvatiStatus: (id: number) => {
      return apiFetch<{ statusNaloga: string; statusNalogaId: number }>(
        `/Korisnik/${id}/status`,
      );
    },
    azurirajKontakt: (id: number, data: { email: string; telefon: string }) => {
      return apiFetch(`/Korisnik/${id}/azurirajKontakt`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
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
