import { useEffect, useMemo, useState } from 'react';
import { HeartPulse, Stethoscope, Syringe, CalendarClock, AlertTriangle, Baby, Pill } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { api } from '../api';
import type { KorisnikDto, TerapijaAplikacijeDto, TerapijaDto, ZdravstveniSlucajDto } from '../api/dto';
import { useData } from '../context/DataContext';

type HealthKpiItem = {
  icon: typeof HeartPulse;
  label: string;
  value: string;
  detail: string;
};

export function ZdravljeReprodukcija() {
  const { isDarkMode } = useSettings();
  const { krave } = useData();
  const cardBg = isDarkMode ? '#0f1727' : '#ffffff';
  const cardBorder = isDarkMode ? '#1c2436' : '#e5e7eb';
  const cardText = isDarkMode ? '#e7eefc' : '#0f1727';
  const subText = isDarkMode ? '#b9c7e3' : '#4b5563';
  const badgeText = isDarkMode ? '#9ad8a8' : '#0f766e';

  const [slucajevi, setSlucajevi] = useState<ZdravstveniSlucajDto[]>([]);
  const [terapije, setTerapije] = useState<TerapijaDto[]>([]);
  const [aplikacije, setAplikacije] = useState<TerapijaAplikacijeDto[]>([]);
  const [korisnici, setKorisnici] = useState<KorisnikDto[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [s, t, a, k] = await Promise.all([
          api.zdravstveniSlucajevi.list(),
          api.terapije.list(),
          api.terapijeAplikacije.list(),
          api.korisnici.list(),
        ]);
        if (cancelled) return;
        setSlucajevi(s);
        setTerapije(t);
        setAplikacije(a);
        setKorisnici(k);
      } catch (e) {
        console.error(e);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cowById = useMemo(() => {
    const map: Record<string, { ime: string; ident: string }> = {};
    for (const c of krave) map[c.id] = { ime: c.ime, ident: c.identifikacioniBroj };
    return map;
  }, [krave]);

  const slucajById = useMemo(() => {
    const map: Record<number, ZdravstveniSlucajDto> = {};
    for (const s of slucajevi) map[s.idSlucaja] = s;
    return map;
  }, [slucajevi]);

  const korisnikById = useMemo(() => {
    const map: Record<number, string> = {};
    for (const k of korisnici) map[k.idKorisnika] = `${k.ime} ${k.prezime}`.trim();
    return map;
  }, [korisnici]);

  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;

  const zdraveKraveCount = krave.filter((k) => k.status === 'zdrava').length;
  const naLijecenjuCount = krave.filter((k) => k.status === 'lijecenje').length;
  const pregledi30dCount = slucajevi.filter((s) => {
    const dt = new Date(s.datumOtvaranja).getTime();
    return !Number.isNaN(dt) && dt >= thirtyDaysAgo;
  }).length;

  const terapijeUTokuCount = terapije.filter((t) => {
    const start = new Date(t.datumPocetka).getTime();
    const end = new Date(t.datumKraja).getTime();
    if (Number.isNaN(start) || Number.isNaN(end)) return false;
    return start <= now && now <= end;
  }).length;

  const zakazaneAplikacijeCount = aplikacije.filter((a) => {
    const dt = new Date(a.datumVrijeme).getTime();
    return !Number.isNaN(dt) && dt > now;
  }).length;

  const healthKpi: HealthKpiItem[] = [
    { icon: HeartPulse, label: 'Zdrave krave', value: String(zdraveKraveCount), detail: '' },
    { icon: Syringe, label: 'Na liječenju', value: String(naLijecenjuCount), detail: '' },
    { icon: Stethoscope, label: 'Pregledi 30d', value: String(pregledi30dCount), detail: '' },
    { icon: Baby, label: 'Repro ciklusi', value: `${terapijeUTokuCount} u toku`, detail: `${zakazaneAplikacijeCount} aplikacija zakazana` },
  ];

  const treatments = useMemo(() => {
    const withDate = terapije
      .map((t) => ({
        dto: t,
        date: new Date(t.datumPocetka).getTime(),
      }))
      .filter((x) => !Number.isNaN(x.date))
      .sort((a, b) => b.date - a.date)
      .slice(0, 6);

    return withDate.map(({ dto: t, date }) => {
      const slucaj = slucajById[t.idSlucaja];
      const cow = slucaj ? cowById[String(slucaj.idKrave)] : undefined;

      const end = new Date(t.datumKraja).getTime();
      const status = !Number.isNaN(end) && end < now ? 'završeno' : date <= now ? 'u toku' : 'praćenje';

      const dd = new Date(date);
      const dateText = `${String(dd.getDate()).padStart(2, '0')}.${String(dd.getMonth() + 1).padStart(2, '0')}`;

      return {
        date: dateText,
        cow: cow ? `${cow.ime} (${cow.ident})` : slucaj ? `Krava #${slucaj.idKrave}` : `Slučaj #${t.idSlucaja}`,
        type: `${t.nazivLijeka} (${t.doza} ${t.jedinicaMjere})`,
        vet: slucaj?.idVeterinara != null ? (korisnikById[slucaj.idVeterinara] ?? `Korisnik #${slucaj.idVeterinara}`) : '—',
        status,
      };
    });
  }, [cowById, korisnikById, now, slucajById, terapije]);

  const reproEvents = useMemo(() => {
    const upcoming = aplikacije
      .map((a) => ({
        dto: a,
        date: new Date(a.datumVrijeme).getTime(),
      }))
      .filter((x) => !Number.isNaN(x.date) && x.date >= now)
      .sort((a, b) => a.date - b.date)
      .slice(0, 5);

    return upcoming.map(({ dto: a, date }) => {
      const terapija = terapije.find((t) => t.idTerapije === a.idTerapije);
      const slucaj = terapija ? slucajById[terapija.idSlucaja] : undefined;
      const cow = slucaj ? cowById[String(slucaj.idKrave)] : undefined;
      const dd = new Date(date);
      const dateText = `${String(dd.getDate()).padStart(2, '0')}.${String(dd.getMonth() + 1).padStart(2, '0')}`;
      const izvrsioc = korisnikById[a.idIzvrsilac] ?? `Korisnik #${a.idIzvrsilac}`;

      return {
        date: dateText,
        cow: cow ? `${cow.ime} (${cow.ident})` : slucaj ? `Krava #${slucaj.idKrave}` : `Terapija #${a.idTerapije}`,
        event: 'Aplikacija terapije',
        note: `${terapija?.nazivLijeka ?? '—'} • ${a.primijenjenaKolicina} • ${izvrsioc}`,
      };
    });
  }, [aplikacije, cowById, korisnikById, now, slucajById, terapije]);

  const risks = useMemo(() => {
    const mapped = slucajevi
      .map((s) => {
        const cow = cowById[String(s.idKrave)];
        const riskText = String(s.aiNivoRizika ?? '').toLowerCase();
        const severity = riskText.includes('krit') || riskText.includes('high') || riskText.includes('visok') ? 'Kritično' : 'Upozorenje';
        const issue = s.aiTipAnomalije?.trim() ? `${s.aiTipAnomalije}: ${s.razlogOtvaranja}` : s.razlogOtvaranja;
        const action = s.dijagnoza?.trim() ? s.dijagnoza : s.napomene?.trim() ? s.napomene : '—';
        return {
          cow: cow ? `${cow.ime} (${cow.ident})` : `Krava #${s.idKrave}`,
          issue: issue || s.opisSimptoma || '—',
          severity,
          action,
        };
      })
      .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'Kritično' ? -1 : 1))
      .slice(0, 6);

    return mapped;
  }, [cowById, slucajevi]);

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Zdravlje i reprodukcija</h1>
        <p className={`mt-1 mb-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-600'}`}>Praćenje tretmana, reproduktivnih ciklusa i rizičnih slučajeva</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        {healthKpi.map(({ icon: Icon, label, value, detail }) => (
          <div
            key={label}
            className="rounded-xl border p-5 shadow-lg"
            style={{ backgroundColor: cardBg, borderColor: cardBorder, color: cardText }}
          >
            <div className="flex items-center gap-3 p-4">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center border text-white"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.15)' : '#0f1727',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.35)' : '#0f1727',
                }}
              >
                <Icon className="h-5 w-5 drop-shadow" style={{ color: '#ffffff', opacity: 1 }} />
              </div>
              <div>
                <p className="text-sm leading-tight" style={{ color: subText }}>{label}</p>
                <p className="text-2xl font-semibold leading-snug" style={{ color: cardText }}>{value}</p>
                <p className="text-xs mt-1 leading-tight" style={{ color: badgeText }}>{detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Zadnji tretmani</h3>
            <span className="text-sm text-gray-500">Hronološki prikaz</span>
          </div>
          <div className="space-y-4">
            {(treatments.length ? treatments : [{ date: '—', cow: 'Nema podataka', type: '—', vet: '—', status: 'praćenje' as const }]).map((item) => (
              <div key={`${item.cow}-${item.date}`} className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarClock className="w-4 h-4" />
                      <span>{item.date}</span>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.status === 'završeno' ? 'bg-green-50 text-green-700' : item.status === 'u toku' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{item.cow}</p>
                  <p className="text-sm text-gray-700">{item.type}</p>
                  <p className="text-xs text-gray-500">Veterinar: {item.vet}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reproduktivni kalendar</h3>
          <div className="space-y-3">
            {(reproEvents.length ? reproEvents : [{ date: '—', cow: 'Nema podataka', event: '—', note: '' }]).map((ev) => (
              <div key={ev.cow} className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="inline-flex items-center gap-2"><Baby className="w-4 h-4" /> {ev.event}</span>
                  <span>{ev.date}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-gray-900">{ev.cow}</p>
                <p className="text-xs text-gray-600">{ev.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Rizici i praćenje</h3>
            <p className="text-sm text-gray-600">Automatski flagovani slučajevi</p>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {(risks.length ? risks : [{ cow: 'Nema podataka', issue: '—', severity: 'Upozorenje', action: '—' }]).map((r) => (
            <div key={r.cow} className="rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <p className="text-sm font-semibold text-gray-900">{r.cow}</p>
              <p className="text-sm text-gray-700 mt-1">{r.issue}</p>
              <p className="text-xs text-gray-500 mt-1">Preporuka: {r.action}</p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">{r.severity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

