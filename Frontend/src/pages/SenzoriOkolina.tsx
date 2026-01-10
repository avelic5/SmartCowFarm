import { useEffect, useMemo, useState } from 'react';
import { Thermometer, Droplets, Wind, AlertTriangle, CloudSun } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { api } from '../api';
import type { OcitanjeSenzoraDto, SenzorDto } from '../api/dto';

type SensorCard = {
  name: string;
  value: string;
  status: 'dobro' | 'upozorenje' | 'kritično';
  updated: string;
};

function minutesAgo(ts: string): string {
  const t = new Date(ts).getTime();
  if (Number.isNaN(t)) return '';
  const diff = Date.now() - t;
  const mins = Math.max(0, Math.floor(diff / 60000));
  if (mins === 0) return 'prije <1 min';
  return `prije ${mins} min`;
}

export function SenzoriOkolina() {
  const { isDarkMode } = useSettings();
  const cardBg = isDarkMode ? '#0f1727' : '#ffffff';
  const cardBorder = isDarkMode ? '#1c2436' : '#e5e7eb';
  const cardText = isDarkMode ? '#e7eefc' : '#0f1727';
  const subText = isDarkMode ? '#b9c7e3' : '#4b5563';

  const [senzori, setSenzori] = useState<SenzorDto[]>([]);
  const [ocitanja, setOcitanja] = useState<OcitanjeSenzoraDto[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [s, o] = await Promise.all([api.senzori.list(), api.ocitanjaSenzora.list()]);
        if (cancelled) return;
        setSenzori(s);
        setOcitanja(o);
      } catch (e) {
        console.error(e);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const lastReadingBySensor = useMemo(() => {
    const map: Record<number, OcitanjeSenzoraDto> = {};
    for (const o of ocitanja) {
      const existing = map[o.idSenzora];
      if (!existing || (existing.timestamp ?? '') < (o.timestamp ?? '')) map[o.idSenzora] = o;
    }
    return map;
  }, [ocitanja]);

  const sensorCards = useMemo((): SensorCard[] => {
    return senzori.map((s) => {
      const r = lastReadingBySensor[s.idSenzora];
      const valueNum = r ? Number(r.vrijednost) : NaN;

      let status: SensorCard['status'] = 'dobro';
      if (r && !Number.isNaN(valueNum)) {
        const critical = valueNum < Number(s.pragCriticalMin) || valueNum > Number(s.pragCriticalMax);
        const warn = valueNum < Number(s.pragNormalnoMin) || valueNum > Number(s.pragNormalnoMax);
        status = critical ? 'kritično' : warn ? 'upozorenje' : 'dobro';
      }

      const value = r && !Number.isNaN(valueNum)
        ? `${valueNum.toFixed(2)} ${s.jedinicaMjere}`
        : 'N/A';

      const updated = r ? minutesAgo(r.timestamp) : '';

      return {
        name: s.naziv,
        value,
        status,
        updated,
      };
    });
  }, [lastReadingBySensor, senzori]);

  const criticalCount = sensorCards.filter((c) => c.status === 'kritično').length;
  const warnCount = sensorCards.filter((c) => c.status === 'upozorenje').length;

  const avgValue = useMemo(() => {
    const values = sensorCards
      .map((c) => Number(c.value.split(' ')[0]))
      .filter((v) => !Number.isNaN(v));
    if (!values.length) return null;
    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  }, [sensorCards]);

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Senzori i okolina</h1>
        <p className={`mt-1 mb-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-600'}`}>Uslovi u staji, upozorenja i vanjski meteo podaci</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div
          className="rounded-xl border p-4 shadow-sm"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center border text-white"
              style={{
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#0f1727',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.25)' : '#0f1727',
              }}
            >
              <Thermometer className="w-5 h-5" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: subText }}>Prosječna temperatura</p>
              <p className="text-2xl font-semibold" style={{ color: cardText }}>{avgValue != null ? avgValue.toFixed(2) : 'N/A'}</p>
              <p className="text-xs" style={{ color: subText }}>Prosjek zadnjih očitanja</p>
            </div>
          </div>
        </div>
        <div
          className="rounded-xl border p-4 shadow-sm"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center border text-white"
              style={{
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#0f1727',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.25)' : '#0f1727',
              }}
            >
              <Droplets className="w-5 h-5" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: subText }}>Prosječna vlažnost</p>
              <p className="text-2xl font-semibold" style={{ color: cardText }}>N/A</p>
              <p className="text-xs" style={{ color: subText }}>Nema standardizovanih podataka</p>
            </div>
          </div>
        </div>
        <div
          className="rounded-xl border p-4 shadow-sm"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center border text-white"
              style={{
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#0f1727',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.25)' : '#0f1727',
              }}
            >
              <Wind className="w-5 h-5" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: subText }}>CO₂ prosjek</p>
              <p className="text-2xl font-semibold" style={{ color: cardText }}>N/A</p>
              <p className="text-xs" style={{ color: subText }}>Nema standardizovanih podataka</p>
            </div>
          </div>
        </div>
        <div
          className="rounded-xl border p-4 shadow-sm"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center border text-white"
              style={{
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#0f1727',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.25)' : '#0f1727',
              }}
            >
              <AlertTriangle className="w-5 h-5" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: subText }}>Aktivna upozorenja</p>
              <p className="text-2xl font-semibold" style={{ color: cardText }}>{criticalCount} kritična</p>
              <p className="text-xs" style={{ color: subText }}>{warnCount} upozorenja</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mt-4 md:mt-6">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Zone u staji</h3>
            <span className="text-sm text-gray-500">Real-time</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {sensorCards.map((z) => (
              <div key={z.name} className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{z.name}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${z.status === 'dobro' ? 'bg-green-50 text-green-700' : z.status === 'upozorenje' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                    {z.status}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-700">
                  <span className="inline-flex items-center gap-1"><Thermometer className="w-4 h-4" /> {z.value}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>Posljednje ažuriranje</span>
                  <span>{z.updated || '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-xl border p-6 shadow-sm"
          style={{ backgroundColor: cardBg, borderColor: cardBorder, color: cardText }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: cardText }}>Vanjski uslovi</h3>
            <CloudSun className="w-5 h-5" style={{ color: '#ffffff' }} />
          </div>
          <div className="space-y-3 text-sm" style={{ color: subText }}>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2"><Thermometer className="w-4 h-4" /> Senzora</span>
              <span className="font-semibold" style={{ color: cardText }}>{senzori.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2"><Wind className="w-4 h-4" /> Očitanja</span>
              <span className="font-semibold" style={{ color: cardText }}>{ocitanja.length}</span>
            </div>
          </div>
          <div
            className="mt-5 rounded-lg p-4 text-xs leading-relaxed"
            style={{
              backgroundColor: isDarkMode ? '#132035' : '#e5f2ff',
              color: isDarkMode ? '#fdfaf2' : '#0f1727',
              border: isDarkMode ? '1px solid #20304a' : '1px solid #cde4ff',
            }}
          >
            Napomena: Pragovi se uzimaju iz definicije senzora.
          </div>
        </div>
      </div>
    </div>
  );
}

