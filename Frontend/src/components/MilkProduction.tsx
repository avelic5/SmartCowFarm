import { useEffect, useMemo, useState } from 'react';
import { Filter, Download, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Page } from '../App';
import { api } from '../api';
import type { MuzaDto, KravaDto } from '../api/dto';

interface MilkProductionProps {
  onNavigate: (page: Page) => void;
}

export function MilkProduction({ onNavigate }: MilkProductionProps) {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedCow, setSelectedCow] = useState('all');
  const [muze, setMuze] = useState<MuzaDto[] | null>(null);
  const [krave, setKrave] = useState<KravaDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([api.muze.list(), api.krave.list()])
      .then(([m, k]) => { if (mounted) { setMuze(m); setKrave(k); }})
      .catch(e => setError(e?.message || 'Greška pri učitavanju muža.'));
    return () => { mounted = false; };
  }, []);

  const cowLabel = useMemo(() => {
    const map = new Map<number, string>();
    (krave || []).forEach(k => map.set(k.idKrave, `${k.oznakaKrave}`));
    return map;
  }, [krave]);

  const filteredSessions = useMemo(() => {
    let sessions = (muze || []).slice();
    if (selectedCow !== 'all') {
      const id = Number(selectedCow);
      sessions = sessions.filter(s => s.idKrave === id);
    }
    return sessions.sort((a, b) => a.datum.localeCompare(b.datum));
  }, [muze, selectedCow]);

  const trendData = useMemo(() => {
    const totals = new Map<string, number>();
    (filteredSessions).forEach(s => {
      const day = s.datum.split('T')[0] || s.datum;
      totals.set(day, (totals.get(day) || 0) + (s.kolicinaLitara || 0));
    });
    return Array.from(totals.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([date, total]) => ({ date, total }));
  }, [filteredSessions]);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Milk Production</h2>
          <p className="text-gray-600">Track and analyze milk production data</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Export Data
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="custom">Custom range</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedCow}
              onChange={(e) => setSelectedCow(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Cows</option>
              {(krave || []).map(k => (
                <option key={k.idKrave} value={k.idKrave}>{k.oznakaKrave}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-gray-600 mb-1">Today's Total</p>
          <h3 className="text-gray-900 mb-2">{trendData.reduce((s, d) => s + d.total, 0).toFixed(0)} L</h3>
          <p className="text-green-600">+4.8% vs yesterday</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-gray-600 mb-1">Avg per Cow</p>
          <h3 className="text-gray-900 mb-2">32.7 L</h3>
          <p className="text-green-600">Above target</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-gray-600 mb-1">Sessions Today</p>
          <h3 className="text-gray-900 mb-2">196</h3>
          <p className="text-gray-600">2 sessions/cow</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-gray-600 mb-1">Avg Quality Score</p>
          <h3 className="text-gray-900 mb-2">96/100</h3>
          <p className="text-green-600">Excellent</p>
        </div>
      </div>

      {/* Production Trend Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-gray-900 mb-6">Production Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 4 }}
              name="Total Liters"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Milking Sessions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Recent Milking Sessions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Date/Time</th>
                <th className="px-6 py-3 text-left text-gray-700">Cow</th>
                <th className="px-6 py-3 text-left text-gray-700">Quantity (L)</th>
                <th className="px-6 py-3 text-left text-gray-700">Duration (min)</th>
                <th className="px-6 py-3 text-left text-gray-700">Avg Flow (L/min)</th>
                <th className="px-6 py-3 text-left text-gray-700">Temp (°C)</th>
                <th className="px-6 py-3 text-left text-gray-700">Station</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {error && (<tr><td className="px-6 py-4 text-red-600" colSpan={7}>{error}</td></tr>)}
              {(filteredSessions || []).map((m) => (
                <tr key={m.idMuze} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{`${m.datum} ${m.vrijemePocetka}`}</td>
                  <td className="px-6 py-4 text-gray-900">{cowLabel.get(m.idKrave) || m.idKrave}</td>
                  <td className="px-6 py-4 text-gray-900">{m.kolicinaLitara}</td>
                  <td className="px-6 py-4 text-gray-600">{m.vrijemeZavrsretka && m.vrijemePocetka ? '' : '—'}</td>
                  <td className="px-6 py-4 text-gray-600">{m.prosjecanProtokLMin ?? m.prosjecanProtokLMin}</td>
                  <td className="px-6 py-4 text-gray-600">{m.temperaturaMlijeka ?? '—'}</td>
                  <td className="px-6 py-4 text-gray-600">{m.nacinUnosa ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
