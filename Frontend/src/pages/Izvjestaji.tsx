import { useMemo, useState } from 'react';
import { Calendar, Download, FileText, Filter, LineChart as LineIcon, Printer, Share2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';

const milkTrend = [
  { date: '11.11', liters: 2860 },
  { date: '18.11', liters: 2940 },
  { date: '25.11', liters: 3015 },
  { date: '02.12', liters: 3090 },
  { date: '07.12', liters: 3185 },
];

const topCows = [
  { name: 'Slavica (BOS-001)', avg: 32.5 },
  { name: 'Milica (BOS-002)', avg: 29.8 },
  { name: 'Ruža (BOS-003)', avg: 30.8 },
  { name: 'Daisy (C002)', avg: 28.3 },
  { name: 'Bella (C001)', avg: 32.5 },
];

const recentReports = [
  { title: 'Mjesecni izvještaj proizvodnje', date: '07.12.2025', size: '2.4 MB', type: 'PDF' },
  { title: 'Zdravlje i tretmani - novembar', date: '30.11.2025', size: '1.2 MB', type: 'PDF' },
  { title: 'Senzori i okolina - Q4', date: '25.11.2025', size: '1.9 MB', type: 'CSV' },
  { title: 'Produktivnost zadataka', date: '20.11.2025', size: '1.1 MB', type: 'PDF' },
];

const tableRows = [
  { id: 'R-2025-12-01', naziv: 'Produkcija mlijeka – novembar', period: '01–30.11.2025', status: 'Spremno', tip: 'PDF', trend: '+4.8%' },
  { id: 'R-2025-11-28', naziv: 'Zdravlje i tretmani – Q4', period: '01.10–28.11.2025', status: 'Spremno', tip: 'PDF', trend: '+2.1%' },
  { id: 'R-2025-11-25', naziv: 'Senzori i okolina – Q4', period: '01.10–25.11.2025', status: 'Spremno', tip: 'CSV', trend: 'Stabilno' },
  { id: 'R-2025-11-20', naziv: 'Produktivnost zadataka – novembar', period: '01–20.11.2025', status: 'Spremno', tip: 'PDF', trend: '+1.4%' },
];

export function Izvjestaji() {
  const [range, setRange] = useState('last-30');
  const [type, setType] = useState('milk');
  const { krave } = useData();
  const { isDarkMode } = useSettings();

  const panelBg = isDarkMode ? '#0f1727' : '#ffffff';
  const panelBorder = isDarkMode ? '#1c2436' : '#e5e7eb';
  const panelText = isDarkMode ? '#e7eefc' : '#0f1727';
  const subText = isDarkMode ? '#b9c7e3' : '#4b5563';

  const healthSplit = useMemo(() => ([
    { name: 'Zdrave', value: krave.filter(k => k.status === 'zdrava').length, color: '#10b981' },
    { name: 'Manji problemi', value: krave.filter(k => k.status === 'praćenje').length, color: '#f59e0b' },
    { name: 'Na liječenju', value: krave.filter(k => k.status === 'lijecenje').length, color: '#ef4444' },
  ]), [krave]);

  const ukupnoZdravlje = useMemo(
    () => healthSplit.reduce((sum, item) => sum + item.value, 0),
    [healthSplit]
  );

  const kpi = useMemo(() => ([
    { label: 'Ukupna proizvodnja', value: '93.6k L', delta: '+8.5%', deltaClass: isDarkMode ? 'text-emerald-300' : 'text-emerald-700' },
    { label: 'Prosjek po grlu', value: '31.8 L', delta: 'Odlično', deltaClass: isDarkMode ? 'text-blue-200' : 'text-blue-700' },
    { label: 'Kvalitet mlijeka', value: '96.8 /100', delta: 'Stabilno', deltaClass: isDarkMode ? 'text-emerald-200' : 'text-emerald-700' },
    { label: 'Zdravstveni score', value: '92 /100', delta: 'Uzlazno', deltaClass: isDarkMode ? 'text-purple-200' : 'text-purple-700' },
  ]), [isDarkMode]);

  return (
    <div className="p-6 md:p-8 space-y-10">
      {/* Header + actions */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Izvještaji</h1>
          <p className={`mt-1 ${isDarkMode ? 'text-slate-200' : 'text-gray-600'}`}>Pregled, izvoz i print ključnih metrika farme</p>
        </div>
        <div className="flex flex-wrap gap-3 mb-4">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
            <Share2 className="w-4 h-4" /> Podijeli
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white shadow-md hover:bg-green-500">
            <Printer className="w-4 h-4" /> Print verzija
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        className="grid gap-4 rounded-xl border p-6 shadow-sm md:grid-cols-3"
        style={{ borderColor: panelBorder, backgroundColor: panelBg, color: panelText }}
      >
        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: subText }}>Tip izvještaja</label>
          <select
            className="w-full rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            style={{
              color: isDarkMode ? '#e7eefc' : '#0f1727',
              backgroundColor: isDarkMode ? '#111a2a' : '#ffffff',
              border: `1px solid ${isDarkMode ? '#2c3447' : '#e5e7eb'}`,
            }}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="milk" className={isDarkMode ? 'bg-[#111a2a] text-[#e7eefc]' : ''}>Proizvodnja mlijeka</option>
            <option value="health" className={isDarkMode ? 'bg-[#111a2a] text-[#e7eefc]' : ''}>Zdravlje i tretmani</option>
            <option value="sensors" className={isDarkMode ? 'bg-[#111a2a] text-[#e7eefc]' : ''}>Senzori i okolina</option>
            <option value="tasks" className={isDarkMode ? 'bg-[#111a2a] text-[#e7eefc]' : ''}>Produktivnost zadataka</option>
            <option value="annual" className={isDarkMode ? 'bg-[#111a2a] text-[#e7eefc]' : ''}>Godišnji pregled</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" style={{ color: subText }}>Period</label>
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{
              border: `1px solid ${isDarkMode ? '#2c3447' : '#e5e7eb'}`,
              backgroundColor: isDarkMode ? '#111a2a' : '#ffffff',
            }}
          >
            <Calendar className="w-4 h-4" style={{ color: subText }} />
            <select
              className="w-full bg-transparent focus:outline-none"
              style={{ color: isDarkMode ? '#e7eefc' : '#0f1727' }}
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="last-7">Posljednjih 7 dana</option>
              <option value="last-30">Posljednjih 30 dana</option>
              <option value="last-90">Posljednjih 90 dana</option>
              <option value="ytd">Godina do danas</option>
              <option value="custom">Prilagođeni raspon</option>
            </select>
          </div>
        </div>

        <div className="space-y-3 md:pt-6">
          <div className="flex flex-wrap gap-2 text-sm" style={{ color: subText }}>
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 border"
              style={{
                backgroundColor: isDarkMode ? '#182235' : '#f1f5f9',
                borderColor: isDarkMode ? '#2c3447' : '#e5e7eb',
                color: isDarkMode ? '#e7eefc' : '#0f1727',
              }}
            >
              <Filter className="w-4 h-4" /> Zona B1/B2
            </span>
            <span
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 border"
              style={{
                backgroundColor: isDarkMode ? '#182235' : '#f1f5f9',
                borderColor: isDarkMode ? '#2c3447' : '#e5e7eb',
                color: isDarkMode ? '#e7eefc' : '#0f1727',
              }}
            >
              Grupa: Muža
            </span>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2"
            style={{
              borderColor: isDarkMode ? '#2c3447' : '#e5e7eb',
              backgroundColor: isDarkMode ? '#182235' : '#f8fafc',
              color: isDarkMode ? '#e7eefc' : '#0f1727',
            }}
          >
            <LineIcon className="w-4 h-4" /> Generiši pregled
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mt-4 mb-6">
        {kpi.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border p-4 shadow-sm"
            style={{ backgroundColor: panelBg, borderColor: panelBorder }}
          >
            <p className="text-sm" style={{ color: subText }}>{item.label}</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-semibold" style={{ color: panelText }}>{item.value}</span>
              <span className={`text-sm ${item.deltaClass ?? ''}`} style={{ color: item.deltaClass ? undefined : subText }}>
                {item.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3 mt-2">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Trend proizvodnje (sedmični)</h3>
              <p className="text-sm text-gray-600">Litara po sedmici, zadnjih 5 sedmica</p>
            </div>
            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">+8.5%</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={milkTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
              <Line type="monotone" dataKey="liters" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribucija zdravlja stada</h3>
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
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-sm">
            {healthSplit.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: item.color }}></span>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary charts */}
      <div className="grid gap-6 lg:grid-cols-2 mt-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top krave po prosjeku</h3>
            <span className="text-sm text-gray-500">Litara/dan</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCows}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
              <YAxis stroke="#6b7280" />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
              <Bar dataKey="avg" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Brzi sažetak</h3>
            <span className="text-sm text-gray-500">Automatska analiza</span>
          </div>
          <ul className="space-y-3 text-sm text-gray-700">
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

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm mt-4 mb-4">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Posljednji generisani izvještaji</h3>
            <p className="text-sm text-gray-600">Spremni za preuzimanje ili štampu</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 hover:bg-gray-50">
            <FileText className="w-4 h-4" /> Novi izvještaj
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Naziv</th>
                <th className="px-6 py-3 font-medium">Period</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Trend</th>
                <th className="px-6 py-3 font-medium text-right">Akcije</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableRows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-900">{row.id}</td>
                  <td className="px-6 py-3 text-gray-900">{row.naziv}</td>
                  <td className="px-6 py-3 text-gray-600">{row.period}</td>
                  <td className="px-6 py-3">
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">{row.status}</span>
                  </td>
                  <td className="px-6 py-3 text-right text-gray-900">{row.trend}</td>
                  <td className="px-6 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button className="rounded-lg border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-50">PDF</button>
                      <button className="rounded-lg border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-50">CSV</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent downloads */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Brzi pristup</h3>
          <span className="text-sm text-gray-500">Najnoviji exporti</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recentReports.map((r) => (
            <div key={r.title} className="rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{r.title}</p>
                    <p className="text-xs text-gray-500">{r.date}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{r.type}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
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
