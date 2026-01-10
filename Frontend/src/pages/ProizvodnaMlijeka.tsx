import { useMemo } from 'react';
import { TrendingUp, Droplet, Milk, Gauge } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { useSettings } from '../context/SettingsContext';
import { useData } from '../context/DataContext';

function parseIsoDate(value: string): number {
  const t = new Date(value).getTime();
  return Number.isNaN(t) ? 0 : t;
}

function dayLabel(iso: string): string {
  return iso.length >= 10 ? `${iso.slice(8, 10)}.${iso.slice(5, 7)}` : iso;
}

function weekKey(d: Date): string {
  const year = d.getFullYear();
  const jan4 = new Date(year, 0, 4);
  const jan4Day = (jan4.getDay() + 6) % 7;
  const week1Start = new Date(jan4);
  week1Start.setDate(jan4.getDate() - jan4Day);
  const diffDays = Math.floor((d.getTime() - week1Start.getTime()) / (1000 * 60 * 60 * 24));
  const week = Math.floor(diffDays / 7) + 1;
  return `${year}-W${String(week).padStart(2, '0')}`;
}

export function ProizvodnaMlijeka() {
  const { isDarkMode } = useSettings();
  const { produkcijaMlijeka, krave } = useData();

  const cardBg = isDarkMode ? '#0f1727' : '#ffffff';
  const cardBorder = isDarkMode ? '#1c2436' : '#e5e7eb';
  const cardText = isDarkMode ? '#e7eefc' : '#0f1727';
  const subText = isDarkMode ? '#b9c7e3' : '#4b5563';
  const badgeText = isDarkMode ? '#9ad8a8' : '#0f766e';

  const now = useMemo(() => Date.now(), []);

  const last30 = useMemo(() => {
    const cutoff = now - 30 * 24 * 60 * 60 * 1000;
    return produkcijaMlijeka.filter((p) => parseIsoDate(p.datum) >= cutoff);
  }, [now, produkcijaMlijeka]);

  const total30 = useMemo(() => last30.reduce((sum, p) => sum + (Number(p.litri) || 0), 0), [last30]);
  const cowsCount = krave.length || 1;
  const avgPerCow = total30 / cowsCount;

  const weekly = useMemo(() => {
    const byWeek: Record<string, number> = {};
    for (const p of last30) {
      const dt = new Date(p.datum);
      if (Number.isNaN(dt.getTime())) continue;
      const key = weekKey(dt);
      byWeek[key] = (byWeek[key] ?? 0) + (Number(p.litri) || 0);
    }

    return Object.entries(byWeek)
      .sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0))
      .slice(-5)
      .map(([key, litri]) => ({
        label: key,
        litri,
      }));
  }, [last30]);

  const sessions = useMemo(() => {
    const totals = { Jutro: 0, Podne: 0, 'Večer': 0 } as Record<string, number>;
    const counts = { Jutro: 0, Podne: 0, 'Večer': 0 } as Record<string, number>;

    for (const p of last30) {
      if (typeof p.jutro === 'number') {
        totals.Jutro += p.jutro;
        counts.Jutro += 1;
      } else if (typeof p.podne === 'number') {
        totals.Podne += p.podne;
        counts.Podne += 1;
      } else if (typeof p.veče === 'number') {
        totals['Večer'] += p.veče;
        counts['Večer'] += 1;
      }
    }

    return [
      { session: 'Jutro', avg: counts.Jutro ? totals.Jutro / counts.Jutro : 0 },
      { session: 'Podne', avg: counts.Podne ? totals.Podne / counts.Podne : 0 },
      { session: 'Večer', avg: counts['Večer'] ? totals['Večer'] / counts['Večer'] : 0 },
    ];
  }, [last30]);

  const cowTable = useMemo(() => {
    const byCow: Record<string, { sum: number; n: number }> = {};
    for (const p of last30) {
      const id = p.kravaId;
      const entry = (byCow[id] ??= { sum: 0, n: 0 });
      entry.sum += Number(p.litri) || 0;
      entry.n += 1;
    }

    const cowNameById: Record<string, { oznaka: string; ime: string }> = {};
    for (const k of krave) cowNameById[k.id] = { oznaka: k.identifikacioniBroj, ime: k.ime };

    return Object.entries(byCow)
      .map(([kravaId, v]) => {
        const meta = cowNameById[kravaId];
        return {
          id: meta?.oznaka ?? `#${kravaId}`,
          ime: meta?.ime ?? `Krava #${kravaId}`,
          prosjek: v.n ? v.sum / v.n : 0,
          kvalitet: '—',
          trend: '—',
        };
      })
      .sort((a, b) => b.prosjek - a.prosjek)
      .slice(0, 10);
  }, [krave, last30]);

  const kpi = useMemo(() => ([
    { icon: Milk, label: 'Ukupno (30d)', value: `${(total30 / 1000).toFixed(1)}k L`, badge: `${last30.length} muža` },
    { icon: Droplet, label: 'Prosjek po grlu', value: `${avgPerCow.toFixed(1)} L`, badge: `Ukupno krava: ${krave.length}` },
    { icon: Gauge, label: 'Kvalitet mlijeka', value: '—', badge: 'Nema podataka' },
    { icon: TrendingUp, label: 'Trend sedmica', value: weekly.length ? `${weekly[weekly.length - 1].litri.toFixed(0)} L` : '—', badge: 'Posljednjih 5 sedmica' },
  ]), [avgPerCow, krave.length, last30.length, total30, weekly]);

  return (
    <div className="p-6 md:p-8 space-y-8" style={{ color: cardText }}>
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Proizvodnja mlijeka</h1>
        <p className={`mt-1 mb-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-600'}`}>Evidencija, trendovi i raspodjela po sesijama</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        {kpi.map(({ icon: Icon, label, value, badge }) => (
          <div
            key={label}
            className="rounded-xl border p-5 shadow-lg"
            style={{ backgroundColor: cardBg, borderColor: cardBorder, color: cardText }}
          > 
            <div className="flex items-center gap-3 p-4">
              <div
                className="h-12 w-12 rounded-lg flex items-center justify-center border text-white"
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
                <p className="text-xs mt-1 leading-tight" style={{ color: badgeText }}>{badge}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-4">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Sedmični trend</h3>
              <p className="text-sm text-gray-600">Litara po sedmici (posljednjih 5)</p>
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">+8.5%</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={weekly}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
              <Line type="monotone" dataKey="litri" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sesije po danu</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sessions}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="session" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
              <Bar dataKey="avg" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-3 text-sm text-gray-600">Prosjek litara po muži za sesiju (30 dana).</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Top krave (posljednjih 30 dana)</h3>
            <p className="text-sm text-gray-600">Prosječni litri po grlu i ocjena kvaliteta</p>
          </div>
          <span className="text-sm text-gray-500">Sortirano po prosjeku</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Ime</th>
                <th className="px-6 py-3 font-medium text-right">Prosjek (L)</th>
                <th className="px-6 py-3 font-medium text-right">Kvalitet</th>
                <th className="px-6 py-3 font-medium text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cowTable.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-900">{row.id}</td>
                  <td className="px-6 py-3 text-gray-900">{row.ime}</td>
                  <td className="px-6 py-3 text-right text-gray-900">{row.prosjek.toFixed(1)}</td>
                  <td className="px-6 py-3 text-right text-green-600">{row.kvalitet}</td>
                  <td className="px-6 py-3 text-right text-gray-900">{row.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

