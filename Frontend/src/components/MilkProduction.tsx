import { useState } from 'react';
import { Filter, Download, Calendar } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Page } from '../App';

interface MilkProductionProps {
  onNavigate: (page: Page) => void;
}

const trendData = [
  { date: 'Nov 30', total: 2780 },
  { date: 'Dec 1', total: 2850 },
  { date: 'Dec 2', total: 2920 },
  { date: 'Dec 3', total: 2780 },
  { date: 'Dec 4', total: 2950 },
  { date: 'Dec 5', total: 3100 },
  { date: 'Dec 6', total: 3050 },
  { date: 'Dec 7', total: 3200 },
];

const sessions = [
  { id: 1, dateTime: '2025-12-07 06:15', cow: 'Bella (C001)', quantity: 17.3, duration: 8.5, avgFlow: 2.04, temp: 37.2, station: 'Station 1' },
  { id: 2, dateTime: '2025-12-07 06:22', cow: 'Daisy (C002)', quantity: 14.8, duration: 7.8, avgFlow: 1.90, temp: 37.1, station: 'Station 2' },
  { id: 3, dateTime: '2025-12-07 06:28', cow: 'Rosie (C004)', quantity: 16.2, duration: 8.1, avgFlow: 2.00, temp: 37.3, station: 'Station 1' },
  { id: 4, dateTime: '2025-12-07 06:35', cow: 'Buttercup (C006)', quantity: 15.5, duration: 7.9, avgFlow: 1.96, temp: 37.2, station: 'Station 3' },
  { id: 5, dateTime: '2025-12-07 16:30', cow: 'Bella (C001)', quantity: 16.9, duration: 8.2, avgFlow: 2.06, temp: 37.1, station: 'Station 1' },
  { id: 6, dateTime: '2025-12-07 16:38', cow: 'Daisy (C002)', quantity: 13.9, duration: 7.5, avgFlow: 1.85, temp: 37.0, station: 'Station 2' },
];

export function MilkProduction({ onNavigate }: MilkProductionProps) {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedCow, setSelectedCow] = useState('all');

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
              <option value="C001">Bella (C001)</option>
              <option value="C002">Daisy (C002)</option>
              <option value="C004">Rosie (C004)</option>
              <option value="C006">Buttercup (C006)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-gray-600 mb-1">Today's Total</p>
          <h3 className="text-gray-900 mb-2">3,200 L</h3>
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
              {sessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{session.dateTime}</td>
                  <td className="px-6 py-4 text-gray-900">{session.cow}</td>
                  <td className="px-6 py-4 text-gray-900">{session.quantity}</td>
                  <td className="px-6 py-4 text-gray-600">{session.duration}</td>
                  <td className="px-6 py-4 text-gray-600">{session.avgFlow}</td>
                  <td className="px-6 py-4 text-gray-600">{session.temp}</td>
                  <td className="px-6 py-4 text-gray-600">{session.station}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
