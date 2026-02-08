import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { Krava, ProdukcijaMlijeka, ZdravstveniZapis, Upozorenje, Zadatak } from '../types';
import { api } from '../api';
import type { KravaDto, UpozorenjeDto, ZadatakDto } from '../api/dto';
import {
  mapKravaDtoToUi,
  mapMuzaDtoToUi,
  mapUpozorenjeDtoToUi,
  mapZadatakDtoToUi,
  mapZdravstveniSlucajToUi,
  mapUiStatusToBackend,
  mapUiStatusToBackendTask,
} from '../api/mappers';
import { useAuth } from './AuthContext';

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
  označiSvaUpozorenjaKaoPročitana: () => void;
  ažurirajZadatak: (id: string, zadatak: Partial<Zadatak>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

function todayIsoDate(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getReadAlertIds(): Set<string> {
  try {
    const raw = localStorage.getItem('readAlertIds');
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.map(String));
  } catch {
    return new Set();
  }
}

function setReadAlertIds(ids: Set<string>) {
  try {
    localStorage.setItem('readAlertIds', JSON.stringify(Array.from(ids)));
  } catch {
    return;
  }
}

function buildKravaDtoFromUi(base: KravaDto | undefined, ui: Partial<Krava>, id?: number): KravaDto {
  const nowDate = todayIsoDate();

  return {
    idKrave: id ?? base?.idKrave ?? 0,
    oznakaKrave: ui.identifikacioniBroj ?? base?.oznakaKrave ?? '',
    rasa: ui.pasmina ?? base?.rasa ?? '',
    datumRodjenja: ui.datumRodjenja ?? base?.datumRodjenja ?? nowDate,
    datumDolaska: base?.datumDolaska ?? nowDate,
    porijekloTip: base?.porijekloTip ?? 'Nepoznato',
    idMajke: base?.idMajke ?? null,
    trenutniStatus: mapUiStatusToBackend(
      ui.status ??
      mapKravaDtoToUi(
        base ?? {
          idKrave: 0,
          oznakaKrave: '',
          rasa: '',
          datumRodjenja: nowDate,
          datumDolaska: nowDate,
          porijekloTip: 'Nepoznato',
          trenutniStatus: 'PodNadzorom',
          pocetnaTezina: 0,
          trenutnaProcijenjenaTezina: 0,
          opisIzgleda: '',
          prosjecnaDnevnaProizvodnjaL: 0,
          napomene: '',
        },
      ).status,
    ),
    pocetnaTezina: ui.tezina ?? base?.pocetnaTezina ?? 0,
    trenutnaProcijenjenaTezina: ui.tezina ?? base?.trenutnaProcijenjenaTezina ?? base?.pocetnaTezina ?? 0,
    opisIzgleda: ui.ime ?? base?.opisIzgleda ?? '',
    prosjecnaDnevnaProizvodnjaL: ui.prosjecnaProdukcija ?? base?.prosjecnaDnevnaProizvodnjaL ?? 0,
    napomene: ui.napomene ?? base?.napomene ?? '',
  };
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [krave, setKrave] = useState<Krava[]>([]);
  const [produkcijaMlijeka, setProdukcijaMlijeka] = useState<ProdukcijaMlijeka[]>([]);
  const [zdravstveniZapisi, setZdravstveniZapisi] = useState<ZdravstveniZapis[]>([]);
  const [upozorenja, setUpozorenja] = useState<Upozorenje[]>([]);
  const [zadaci, setZadaci] = useState<Zadatak[]>([]);

  const [kraveDto, setKraveDto] = useState<Record<string, KravaDto>>({});
  const [zadaciDto, setZadaciDto] = useState<Record<string, ZadatakDto>>({});
  const [upozorenjaDto, setUpozorenjaDto] = useState<Record<string, UpozorenjeDto>>({});
  const [readAlertIds, setReadAlertIdsState] = useState<Set<string>>(() => getReadAlertIds());

  const readAlertIdsMemo = useMemo(() => readAlertIds, [readAlertIds]);

  const { token } = useAuth();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken && !token) {
      return;
    }

    // Koristi token iz localStorage ako context token nije dostupan
    const effectiveToken = token || storedToken;
    if (!effectiveToken) {
      return;
    }

    // Takođe provjeri da li je token validan (barem 10 karaktera)
    if (effectiveToken.length < 10) {
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
  

        const results = await Promise.allSettled([
          api.krave.list(),
          api.muze.list(),
          api.upozorenja.list(),
          api.zadaci.list(),
          api.zdravstveniSlucajevi.list(),
        ]);

        const kraveRes = results[0].status === 'fulfilled' ? results[0].value : [];
        const muzeRes = results[1].status === 'fulfilled' ? results[1].value : [];
        const upozRes = results[2].status === 'fulfilled' ? results[2].value : [];
        const zadaciRes = results[3].status === 'fulfilled' ? results[3].value : [];
        const slucajeviRes = results[4].status === 'fulfilled' ? results[4].value : [];

        for (const r of results) {
          if (r.status === 'rejected') console.error('API greška:', r.reason);
        }

        if (cancelled) {
          return;
        }

        const kraveMap: Record<string, KravaDto> = {};
        const kraveUi = kraveRes.map((k) => {
          kraveMap[String(k.idKrave)] = k;
          return mapKravaDtoToUi(k);
        });

        const zadaciMap: Record<string, ZadatakDto> = {};
        const zadaciUi = zadaciRes.map((z) => {
          zadaciMap[String(z.idZadatka)] = z;
          return mapZadatakDtoToUi(z);
        });

        const upozMap: Record<string, UpozorenjeDto> = {};
        const upozUi = upozRes.map((u) => {
          upozMap[String(u.idUpozorenja)] = u;
          return mapUpozorenjeDtoToUi(u, readAlertIdsMemo.has(String(u.idUpozorenja)));
        });

        const muzeUi = muzeRes.map(mapMuzaDtoToUi);
        const slucajeviUi = slucajeviRes.map(mapZdravstveniSlucajToUi);

        setKrave(kraveUi);
        setKraveDto(kraveMap);
        setZadaci(zadaciUi);
        setZadaciDto(zadaciMap);
        setUpozorenja(upozUi);
        setUpozorenjaDto(upozMap);
        setProdukcijaMlijeka(muzeUi);
        setZdravstveniZapisi(slucajeviUi);
      } catch (e) {
      }
    };

    load();

    return () => {

      cancelled = true;
    };
  }, [token, readAlertIdsMemo]);

  const dodajKravu = (krava: Omit<Krava, 'id'>) => {
    const run = async () => {
      const dto = buildKravaDtoFromUi(undefined, krava);
      const created = await api.krave.create({
        oznakaKrave: dto.oznakaKrave,
        rasa: dto.rasa,
        datumRodjenja: dto.datumRodjenja,
        datumDolaska: dto.datumDolaska,
        porijekloTip: dto.porijekloTip,
        idMajke: dto.idMajke ?? null,
        trenutniStatus: dto.trenutniStatus,
        pocetnaTezina: dto.pocetnaTezina,
        trenutnaProcijenjenaTezina: dto.trenutnaProcijenjenaTezina,
        opisIzgleda: dto.opisIzgleda,
        prosjecnaDnevnaProizvodnjaL: dto.prosjecnaDnevnaProizvodnjaL,
        napomene: dto.napomene,
      });

      setKrave((prev) => {
        const next = prev.filter((x) => x.id !== String(created.idKrave));
        next.push(mapKravaDtoToUi(created));
        return next;
      });

      setKraveDto((prev) => ({ ...prev, [String(created.idKrave)]: created }));
    };

    run().catch((e) => console.error(e));
  };

  const ažurirajKravu = (id: string, promjene: Partial<Krava>) => {
    const run = async () => {
      const numericId = Number(id);
      const base = kraveDto[id];
      const dto = buildKravaDtoFromUi(base, promjene, numericId);

      await api.krave.update(numericId, dto);

      setKrave((prev) => prev.map((k) => (k.id === id ? { ...k, ...promjene } : k)));
      setKraveDto((prev) => ({ ...prev, [id]: dto }));
    };

    run().catch((e) => console.error(e));
  };

  const obrišiKravu = (id: string) => {
    const run = async () => {
      await api.krave.delete(Number(id));
      setKrave((prev) => prev.filter((k) => k.id !== id));
      setKraveDto((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    };

    run().catch((e) => console.error(e));
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
    setUpozorenja((prev) => prev.map((u) => (u.id === id ? { ...u, pročitano: true } : u)));
    setReadAlertIdsState((prev) => {
      const next = new Set(prev);
      next.add(id);
      setReadAlertIds(next);
      return next;
    });
  };

  const označiSvaUpozorenjaKaoPročitana = () => {
    setUpozorenja((prev) => prev.map((u) => ({ ...u, pročitano: true })));
    setReadAlertIdsState((prev) => {
      const next = new Set(prev);
      for (const u of upozorenja) next.add(u.id);
      setReadAlertIds(next);
      return next;
    });
  };

  const ažurirajZadatak = (id: string, promjene: Partial<Zadatak>) => {
    const run = async () => {
      const base = zadaciDto[id];
      if (!base) {
        setZadaci((prev) => prev.map((z) => (z.id === id ? { ...z, ...promjene } : z)));
        return;
      }

      const nextDto: ZadatakDto = {
        ...base,
        statusZadatka: promjene.status ? mapUiStatusToBackendTask(promjene.status) : base.statusZadatka,
      };

      await api.zadaci.update(Number(id), nextDto);

      setZadaci((prev) => prev.map((z) => (z.id === id ? { ...z, ...promjene } : z)));
      setZadaciDto((prev) => ({ ...prev, [id]: nextDto }));
    };

    run().catch((e) => console.error(e));
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
        označiSvaUpozorenjaKaoPročitana,
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
