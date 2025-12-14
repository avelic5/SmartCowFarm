import { TrendingUp, Droplet, Milk, Gauge } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import { useSettings } from '../context/SettingsContext';

const weekly = [
  { label: '11.11', litri: 2860 },
  { label: '18.11', litri: 2940 },
  { label: '25.11', litri: 3015 },
  { label: '02.12', litri: 3090 },
  { label: '07.12', litri: 3185 },
];

const sessions = [
  { session: 'Jutro', avg: 14.2 },
  { session: 'Podne', avg: 10.8 },
  { session: 'Večer', avg: 11.4 },
];

const cowTable = [
  { id: 'BOS-001', ime: 'Slavica', prosjek: 32.5, kvalitet: '97', trend: '+6%' },
  { id: 'BOS-002', ime: 'Milica', prosjek: 29.8, kvalitet: '95', trend: '+3%' },
  { id: 'BOS-003', ime: 'Ruža', prosjek: 30.8, kvalitet: '96', trend: '+4%' },
  { id: 'C004', ime: 'Rosie', prosjek: 30.8, kvalitet: '97', trend: '+5%' },
  { id: 'C005', ime: 'Clover', prosjek: 26.1, kvalitet: '93', trend: '−2%' },
];

export function ProizvodnaMlijeka() {
  const { isDarkMode } = useSettings();

  const cardBg = isDarkMode ? '#0f1727' : '#ffffff';
  const cardBorder = isDarkMode ? '#1c2436' : '#e5e7eb';
  const cardText = isDarkMode ? '#e7eefc' : '#0f1727';
  const subText = isDarkMode ? '#b9c7e3' : '#4b5563';
  const badgeText = isDarkMode ? '#9ad8a8' : '#0f766e';

  const kpi = [
    { icon: Milk, label: 'Ukupno (30d)', value: '93.6k L', badge: '+8.5% vs prethodni period' },
    { icon: Droplet, label: 'Prosjek po grlu', value: '31.8 L', badge: 'Target 30 L' },
    { icon: Gauge, label: 'Kvalitet mlijeka', value: '96.8 /100', badge: 'Stabilno' },
    { icon: TrendingUp, label: 'Trend sedmica', value: '+8.5%', badge: 'Posljednjih 5 sedmica' },
  ];

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
          <p className="mt-3 text-sm text-gray-600">Večernja muža je +5% u odnosu na prošli mjesec; jutarnja nosi 45% volumena.</p>
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
