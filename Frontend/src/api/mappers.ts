import type {
  KravaDto,
  MuzaDto,
  NivoUpozorenja,
  Prioritet,
  StatusZadatka,
  StatusZdravlja,
  UpozorenjeDto,
  ZadatakDto,
  ZdravstveniSlucajDto,
} from './dto';
import type { Krava, ProdukcijaMlijeka, Upozorenje, Zadatak, ZdravstveniZapis } from '../types';

function yearsSince(dateIso: string): number {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return 0;
  const diff = Date.now() - date.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25)));
}

export function mapStatusZdravljaToUi(status: StatusZdravlja): Krava['status'] {
  switch (status) {
    case 'Aktivna':
      return 'zdrava';
    case 'PodNadzorom':
      return 'praćenje';
    case 'Neaktivna':
      return 'lijecenje';
    case 'Prodana':
      return 'praćenje';
    default:
      return 'praćenje';
  }
}

export function mapUiStatusToBackend(status: Krava['status']): StatusZdravlja {
  switch (status) {
    case 'zdrava':
      return 'Aktivna';
    case 'praćenje':
      return 'PodNadzorom';
    case 'lijecenje':
      return 'Neaktivna';
    default:
      return 'PodNadzorom';
  }
}

export function mapKravaDtoToUi(dto: KravaDto): Krava {
  return {
    id: String(dto.idKrave),
    identifikacioniBroj: dto.oznakaKrave,
    ime: dto.opisIzgleda?.trim() ? dto.opisIzgleda : dto.oznakaKrave,
    starost: yearsSince(dto.datumRodjenja),
    pasmina: dto.rasa,
    status: mapStatusZdravljaToUi(dto.trenutniStatus),
    datumRodjenja: dto.datumRodjenja,
    tezina: Number(dto.trenutnaProcijenjenaTezina ?? dto.pocetnaTezina ?? 0),
    prosjecnaProdukcija: Number(dto.prosjecnaDnevnaProizvodnjaL ?? 0),
    napomene: dto.napomene ?? '',
  };
}

export function mapMuzaDtoToUi(dto: MuzaDto): ProdukcijaMlijeka {
  const hour = Number((dto.vrijemePocetka ?? '').slice(0, 2));
  const isMorning = !Number.isNaN(hour) && hour >= 0 && hour < 10;
  const isNoon = !Number.isNaN(hour) && hour >= 10 && hour < 16;

  const litri = Number(dto.kolicinaLitara ?? 0);

  return {
    id: String(dto.idMuze),
    kravaId: String(dto.idKrave),
    datum: dto.datum,
    litri,
    jutro: isMorning ? litri : undefined,
    podne: isNoon ? litri : undefined,
    veče: !Number.isNaN(hour) && !isMorning && !isNoon ? litri : undefined,
    kvalitet: 'dobra',
  };
}

export function mapNivoUpozorenjaToUi(nivo: NivoUpozorenja): Upozorenje['tip'] {
  switch (nivo) {
    case 'Kriticno':
      return 'kritično';
    case 'Upozorenje':
      return 'upozorenje';
    case 'Status':
      return 'info';
    default:
      return 'info';
  }
}

export function mapUpozorenjeDtoToUi(dto: UpozorenjeDto, isRead: boolean): Upozorenje {
  return {
    id: String(dto.idUpozorenja),
    tip: mapNivoUpozorenjaToUi(dto.nivoUpozorenja),
    naslov: dto.razlogAktiviranja || `Upozorenje #${dto.idUpozorenja}`,
    poruka: dto.opis,
    datum: dto.vrijemeDetekcije,
    kravaId: dto.idKrave != null ? String(dto.idKrave) : undefined,
    pročitano: isRead,
  };
}

export function mapPrioritetToUi(p: Prioritet): Zadatak['prioritet'] {
  switch (p) {
    case 'Visok':
    case 'Kritican':
      return 'visok';
    case 'Srednji':
      return 'srednji';
    case 'Nizak':
      return 'nizak';
    default:
      return 'srednji';
  }
}

export function mapUiPrioritetToBackend(p: Zadatak['prioritet']): Prioritet {
  switch (p) {
    case 'visok':
      return 'Visok';
    case 'srednji':
      return 'Srednji';
    case 'nizak':
      return 'Nizak';
    default:
      return 'Srednji';
  }
}

export function mapStatusZadatkaToUi(s: StatusZadatka): Zadatak['status'] {
  switch (s) {
    case 'Kreiran':
      return 'novo';
    case 'Obrada':
      return 'u-toku';
    case 'Zavrsen':
    case 'Otkazan':
      return 'završeno';
    default:
      return 'novo';
  }
}

export function mapUiStatusToBackendTask(s: Zadatak['status']): StatusZadatka {
  switch (s) {
    case 'novo':
      return 'Kreiran';
    case 'u-toku':
      return 'Obrada';
    case 'završeno':
      return 'Zavrsen';
    default:
      return 'Kreiran';
  }
}

export function mapZadatakDtoToUi(dto: ZadatakDto): Zadatak {
  return {
    id: String(dto.idZadatka),
    naslov: dto.nazivZadatka,
    opis: dto.opis,
    prioritet: mapPrioritetToUi(dto.prioritet),
    status: mapStatusZadatkaToUi(dto.statusZadatka),
    rokIzvršenja: dto.rokIzvrsenja,
    dodijeljeno: dto.idIzvrsilac != null ? `Korisnik #${dto.idIzvrsilac}` : undefined,
    kravaId: dto.idKrave != null ? String(dto.idKrave) : undefined,
  };
}

export function mapZdravstveniSlucajToUi(dto: ZdravstveniSlucajDto): ZdravstveniZapis {
  return {
    id: String(dto.idSlucaja),
    kravaId: String(dto.idKrave),
    datum: dto.datumOtvaranja,
    tip: 'liječenje',
    opis: dto.opisSimptoma || dto.razlogOtvaranja,
    dijagnoza: dto.dijagnoza,
    napomena: dto.napomene,
  };
}
