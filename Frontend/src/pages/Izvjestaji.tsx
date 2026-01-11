import { useMemo, useState } from 'react';
import { Calendar, Download, FileText, Filter, LineChart as LineIcon, Printer, Share2, Search } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';

function formatDdMm(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function formatDdMmYyyy(date: Date): string {
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
}

function dateToLocalMidnightMs(isoDate: string): number {
  const t = new Date(`${isoDate}T00:00:00`).getTime();
  return Number.isNaN(t) ? NaN : t;
}

function weekStartMondayMs(d: Date): number {
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday.getTime();
}

export function Izvjestaji() {
  const [range, setRange] = useState('last-30');
  const [type, setType] = useState('monthly-prod'); // Postavljamo default na Mjesečni izvještaj
  const [selectedEntity, setSelectedEntity] = useState(''); // Novi state za Cow ID ili drugi specifični entitet

  const { krave, produkcijaMlijeka } = useData();
  const { isDarkMode } = useSettings();

  const healthSplit = useMemo(() => ([
    { name: 'Zdrave', value: krave.filter(k => k.status === 'zdrava').length, color: '#10b981' },
    { name: 'Manji problemi', value: krave.filter(k => k.status === 'praćenje').length, color: '#f59e0b' },
    { name: 'Na liječenju', value: krave.filter(k => k.status === 'lijecenje').length, color: '#ef4444' },
  ]), [krave]);

  const ukupnoZdravlje = useMemo(
    () => healthSplit.reduce((sum, item) => sum + item.value, 0),
    [healthSplit]
  );

  const rangeWindow = useMemo(() => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);

    if (range === 'last-90') {
      start.setDate(end.getDate() - 89);
    } else if (range === 'ytd') {
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
    } else {
      start.setDate(end.getDate() - 29);
    }

    start.setHours(0, 0, 0, 0);
    return { startMs: start.getTime(), endMs: end.getTime() };
  }, [range]);

  const productionInRange = useMemo(() => {
    return produkcijaMlijeka.filter((p) => {
      const t = dateToLocalMidnightMs(p.datum);
      if (Number.isNaN(t)) return false;
      return t >= rangeWindow.startMs && t <= rangeWindow.endMs;
    });
  }, [produkcijaMlijeka, rangeWindow]);

  const productionPrevRange = useMemo(() => {
    const windowDays = Math.max(1, Math.round((rangeWindow.endMs - rangeWindow.startMs) / (24 * 60 * 60 * 1000)) + 1);
    const prevEndMs = rangeWindow.startMs - 1;
    const prevStartMs = prevEndMs - (windowDays - 1) * 24 * 60 * 60 * 1000;

    return produkcijaMlijeka.filter((p) => {
      const t = dateToLocalMidnightMs(p.datum);
      if (Number.isNaN(t)) return false;
      return t >= prevStartMs && t <= prevEndMs;
    });
  }, [produkcijaMlijeka, rangeWindow]);

  const totals = useMemo(() => {
    const total = productionInRange.reduce((sum, p) => sum + (Number(p.litri) || 0), 0);
    const totalPrev = productionPrevRange.reduce((sum, p) => sum + (Number(p.litri) || 0), 0);

    const cowSet = new Set(productionInRange.map((p) => p.kravaId));
    const cowCount = cowSet.size || krave.length || 1;
    const avgPerCow = total / cowCount;

    const healthy = krave.filter((k) => k.status === 'zdrava').length;
    const healthScore = krave.length ? Math.round((healthy / krave.length) * 100) : 0;

    const deltaPct = totalPrev > 0 ? ((total - totalPrev) / totalPrev) * 100 : total > 0 ? 100 : 0;
    return { total, totalPrev, avgPerCow, healthScore, deltaPct };
  }, [krave, productionInRange, productionPrevRange]);

  const totalLabel = useMemo(() => {
    if (totals.total >= 10000) return `${(totals.total / 1000).toFixed(1)}k L`;
    return `${Math.round(totals.total)} L`;
  }, [totals.total]);

  const deltaLabel = useMemo(() => {
    if (totals.totalPrev === 0) return totals.total > 0 ? '+N/A' : 'N/A';
    const sign = totals.deltaPct >= 0 ? '+' : '';
    return `${sign}${totals.deltaPct.toFixed(1)}%`;
  }, [totals.deltaPct, totals.total, totals.totalPrev]);

  const milkTrend = useMemo(() => {
    const buckets: Record<number, number> = {};
    for (const p of productionInRange) {
      const t = dateToLocalMidnightMs(p.datum);
      if (Number.isNaN(t)) continue;
      const wk = weekStartMondayMs(new Date(t));
      buckets[wk] = (buckets[wk] ?? 0) + (Number(p.litri) || 0);
    }
    return Object.entries(buckets)
      .map(([k, liters]) => {
        const d = new Date(Number(k));
        return { date: formatDdMm(d), liters };
      })
      .sort((a, b) => (a.date > b.date ? 1 : -1))
      .slice(-5);
  }, [productionInRange]);

  const topCows = useMemo(() => {
    const totalsByCow: Record<string, { liters: number; days: Set<string> }> = {};
    for (const p of productionInRange) {
      const id = p.kravaId;
      if (!totalsByCow[id]) totalsByCow[id] = { liters: 0, days: new Set() };
      totalsByCow[id].liters += Number(p.litri) || 0;
      totalsByCow[id].days.add(p.datum);
    }

    return Object.entries(totalsByCow)
      .map(([kravaId, v]) => {
        const cow = krave.find((k) => k.id === kravaId);
        const days = Math.max(1, v.days.size);
        const avg = v.liters / days;
        return {
          name: cow ? `${cow.ime} (${cow.identifikacioniBroj})` : `Krava #${kravaId}`,
          avg: Number.isFinite(avg) ? Number(avg.toFixed(1)) : 0,
        };
      })
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 5);
  }, [krave, productionInRange]);

  const tableRows = useMemo(() => {
    const now = new Date();
    const dateId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const periodText = `${formatDdMm(new Date(rangeWindow.startMs))}–${formatDdMm(new Date(rangeWindow.endMs))}`;

    const cowLabel = (() => {
      const cow = krave.find((k) => k.id === selectedEntity);
      if (!cow) return 'Karton krave';
      return `Karton krave (${cow.identifikacioniBroj})`;
    })();

    const trend = totals.totalPrev > 0 ? deltaLabel : 'N/A';

    return [
      { id: `R-${dateId}-01`, naziv: cowLabel, period: 'Tekući datum', status: 'Spremno', tip: 'PDF', trend: 'N/A' },
      { id: `R-${dateId}-02`, naziv: 'Mjesečni izvještaj proizvodnje', period: periodText, status: 'Spremno', tip: 'PDF', trend },
      { id: `R-${dateId}-03`, naziv: 'Izvještaj zdravlja i tretmana', period: periodText, status: 'Spremno', tip: 'PDF', trend: 'N/A' },
      { id: `R-${dateId}-04`, naziv: 'Senzori i okolina', period: periodText, status: 'Spremno', tip: 'CSV', trend: 'N/A' },
    ];
  }, [deltaLabel, krave, rangeWindow, selectedEntity, totals.totalPrev]);

  const recentReports = useMemo(() => {
    const today = new Date();
    const baseDate = formatDdMmYyyy(today);
    const cow = krave.find((k) => k.id === selectedEntity);

    return [
      { title: cow ? `Karton krave (${cow.identifikacioniBroj})` : 'Karton krave', date: baseDate, size: '—', type: 'PDF' },
      { title: 'Mjesečni izvještaj proizvodnje', date: baseDate, size: '—', type: 'PDF' },
      { title: 'Zdravlje i tretmani', date: baseDate, size: '—', type: 'PDF' },
      { title: 'Senzori i okolina', date: baseDate, size: '—', type: 'CSV' },
    ];
  }, [krave, selectedEntity]);

  const kpi = useMemo(() => {
    const avgLabel = `${totals.avgPerCow.toFixed(1)} L`;
    const healthLabel = `${totals.healthScore} /100`;

    return [
      { label: 'Ukupna proizvodnja', value: totalLabel, delta: deltaLabel, deltaClass: isDarkMode ? 'text-emerald-300' : 'text-emerald-700' },
      { label: 'Prosjek po grlu', value: avgLabel, delta: krave.length ? 'Stanje' : 'N/A', deltaClass: isDarkMode ? 'text-blue-200' : 'text-blue-700' },
      { label: 'Kvalitet mlijeka', value: 'N/A', delta: 'N/A', deltaClass: isDarkMode ? 'text-emerald-200' : 'text-emerald-700' },
      { label: 'Zdravstveni score', value: healthLabel, delta: 'N/A', deltaClass: isDarkMode ? 'text-purple-200' : 'text-purple-700' },
    ];
  }, [deltaLabel, isDarkMode, krave.length, totalLabel, totals.avgPerCow, totals.healthScore]);

  return (
    <div className="p-6 md:p-8 space-y-10">
      {/* Header + actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Izvještaji</h1>
          <p className="mt-1 text-gray-600 dark:text-slate-300">Pregled, izvoz i print ključnih metrika farme</p>
        </div>
        <div className="flex flex-wrap gap-3 mb-4">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800/60">
            <Share2 className="w-4 h-4" /> Podijeli
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-200 dark:hover:bg-slate-800/60">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white shadow-md hover:bg-green-600 transition-colors">
            <Printer className="w-4 h-4" /> Print verzija
          </button>
        </div>
      </div>

      {/* Filters (REORGANIZOVANO) */}
      <div
        className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4 text-gray-900 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100" // Dodan space-y-4 za razmak između filtera i akcija
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Kolona 1: Tip izvještaja (Uvijek prisutno) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Tip izvještaja</label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100"
              value={type}
              onChange={(e) => { 
                setType(e.target.value); 
                setSelectedEntity(''); // Reset entity on type change
              }}
            >
              <option value="monthly-prod">Mjesečni izvještaj proizvodnje</option>
              <option value="cow-card">Karton krave (Individualni dosje)</option>
              <option value="health">Zdravlje i tretmani (Veterina)</option>
            </select>
          </div>

          {/* Kolona 2: Dinamički input (Krava ID ili Period) */}
          <div className="space-y-2">
            {type === 'cow-card' ? (
              <>
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Krava ID / Oznaka</label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100">
                  <Search className="w-4 h-4 text-gray-400 dark:text-slate-400" />
                  <select
                    className="w-full bg-transparent text-gray-900 focus:outline-none dark:text-slate-100"
                    value={selectedEntity}
                    onChange={(e) => setSelectedEntity(e.target.value)}
                  >
                    <option value="">Odaberi kravu...</option>
                    {krave.map((k) => (
                      <option key={k.id} value={k.id}>{k.identifikacioniBroj} ({k.ime})</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Period</label>
                <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100">
                  <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-400" />
                  <select
                    className="w-full bg-transparent text-gray-900 focus:outline-none dark:text-slate-100"
                    value={range}
                    onChange={(e) => setRange(e.target.value)}
                  >
                    <option value="last-30">Posljednjih 30 dana</option>
                    <option value="last-90">Posljednjih 90 dana</option>
                    <option value="ytd">Godina do danas</option>
                    <option value="custom">Prilagođeni raspon</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Kolona 3: Dodatni Filteri (Grupa / Zona, samo za grupne izvještaje) */}
          {type !== 'cow-card' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600 dark:text-slate-300">Grupa / Zona</label>
              <select
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100"
              >
                <option value="all">Sve životinje</option>
                <option value="grupa-a">Grupa A (Muža)</option>
                <option value="zona-b1">Zona B1</option>
                <option value="zona-b2">Zona B2</option>
              </select>
            </div>
          )}
        </div>

        {/* Akciona dugmad (Uvijek u posebnom redu) */}
        <div className="pt-4 flex justify-end gap-3 border-t border-gray-200 dark:border-slate-700">
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-gray-700 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:bg-slate-800/50"
            >
              <Filter className="w-4 h-4" /> Prilagođeni filteri
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white shadow-md hover:bg-green-600 transition-colors"
            >
              <LineIcon className="w-4 h-4" /> Generiši pregled
            </button>
        </div>
      </div>

      {/* Ostatak koda ostaje nepromijenjen */}
      
      {/* KPI cards (Relevantni za sve izvještaje) */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mt-4 mb-6">
        {kpi.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/50"
          >
            <p className="text-sm text-gray-600 dark:text-slate-300">{item.label}</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-semibold text-gray-900 dark:text-slate-100">{item.value}</span>
              <span className={`text-sm ${item.deltaClass ?? ''}`}>
                {item.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row (Vizualizacija koja podržava izvještaje) */}
      <div className="grid gap-6 lg:grid-cols-3 mt-2">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Trend proizvodnje (sedmični)</h3>
              <p className="text-sm text-gray-600 dark:text-slate-300">Litara po sedmici, zadnjih 5 sedmica</p>
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">+8.5%</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={milkTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e5e7eb'} />
              <XAxis dataKey="date" stroke={isDarkMode ? '#b9c7e3' : '#6b7280'} />
              <YAxis stroke={isDarkMode ? '#b9c7e3' : '#6b7280'} />
              <Tooltip 
                contentStyle={{ 
                  background: isDarkMode ? '#0f1727' : '#fff', 
                  border: `1px solid ${isDarkMode ? '#1c2436' : '#e5e7eb'}`, 
                  borderRadius: 8,
                  color: isDarkMode ? '#e7eefc' : '#0f1727',
                }}
              />
              <Line type="monotone" dataKey="liters" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-slate-100">Distribucija zdravlja stada</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={healthSplit} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4}>
                {healthSplit.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => {
                  const broj = Number(value);
                  const procenat = ukupnoZdravlje > 0 ? Math.round((broj / ukupnoZdravlje) * 100) : 0;
                  return [`${broj} (${procenat}%)`, name as string];
                }}
                contentStyle={{ 
                  background: isDarkMode ? '#0f1727' : '#fff', 
                  border: `1px solid ${isDarkMode ? '#1c2436' : '#e5e7eb'}`, 
                  borderRadius: 8,
                  color: isDarkMode ? '#e7eefc' : '#0f1727',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-sm">
            {healthSplit.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: item.color }}></span>
                  <span className="text-gray-700 dark:text-slate-300">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-slate-100">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary charts */}
      <div className="grid gap-6 lg:grid-cols-2 mt-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Top krave po prosjeku</h3>
            <span className="text-sm text-gray-500 dark:text-slate-400">Litara/dan</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCows}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#334155' : '#e5e7eb'} />
              <XAxis dataKey="name" stroke={isDarkMode ? '#b9c7e3' : '#6b7280'} tick={{ fontSize: 12 }} />
              <YAxis stroke={isDarkMode ? '#b9c7e3' : '#6b7280'} />
              <Tooltip 
                contentStyle={{ 
                  background: isDarkMode ? '#0f1727' : '#fff', 
                  border: `1px solid ${isDarkMode ? '#1c2436' : '#e5e7eb'}`, 
                  borderRadius: 8,
                  color: isDarkMode ? '#e7eefc' : '#0f1727',
                }}
              />
              <Bar dataKey="avg" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Brzi sažetak</h3>
            <span className="text-sm text-gray-500 dark:text-slate-400">Automatska analiza</span>
          </div>
          <ul className="space-y-3 text-sm text-gray-700 dark:text-slate-200">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-green-500"></span>
              Proizvodnja je +8.5% u odnosu na prethodni period, uz stabilan kvalitet (96.8/100).
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-blue-500"></span>
              Top 3 krave (Slavica, Bella, Ruža) generišu 42% ukupnog prinosa – preporuka: pratiti njihovu ishranu.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-amber-500"></span>
              Zdravstvena struktura: 8 manjih slučajeva, 3 na liječenju – plan kontrolnog pregleda za grupu C.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-purple-500"></span>
              Preporuka za naredni izvještaj: dodati korelaciju senzora (temperatura/vlažnost) sa padom proizvodnje u zoni C2.
            </li>
          </ul>
        </div>
      </div>

      {/* Table (Najnoviji generisani izvještaji) */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm mt-4 mb-4 dark:border-slate-700 dark:bg-slate-900/50">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-slate-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Posljednji generisani izvještaji</h3>
            <p className="text-sm text-gray-600 dark:text-slate-300">Spremni za preuzimanje ili štampu</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:bg-slate-800/50">
            <FileText className="w-4 h-4" /> Novi izvještaj
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 text-left dark:bg-slate-950/40 dark:text-slate-300">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Naziv</th>
                <th className="px-6 py-3 font-medium">Period</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Trend</th>
                <th className="px-6 py-3 font-medium text-right">Akcije</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {tableRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-slate-950/40">
                  <td className="px-6 py-3 text-gray-900 dark:text-slate-100">{row.id}</td>
                  <td className="px-6 py-3 text-gray-900 dark:text-slate-100">{row.naziv}</td>
                  <td className="px-6 py-3 text-gray-600 dark:text-slate-300">{row.period}</td>
                  <td className="px-6 py-3">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">{row.status}</span>
                  </td>
                  <td className="px-6 py-3 text-right text-gray-900 dark:text-slate-100">{row.trend}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button className="rounded-lg border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/50">PDF</button>
                      {row.tip === 'CSV' && (
                        <button className="rounded-lg border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/50">CSV</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent downloads (Brzi pristup) */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Brzi pristup</h3>
          <span className="text-sm text-gray-500 dark:text-slate-400">Najnoviji exporti</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recentReports.map((r) => (
            <div key={r.title} className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-sm dark:border-slate-700 dark:hover:shadow-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center dark:bg-slate-950/40 dark:text-blue-300">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-slate-100">{r.title}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{r.date}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-slate-400">{r.type}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-slate-300">
                <span>{r.size}</span>
                <button className="text-green-600 hover:text-green-700">Preuzmi</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

