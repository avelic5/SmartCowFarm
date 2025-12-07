import { Milk, Activity, AlertTriangle, CheckSquare, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Page } from '../App';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

const milkProductionData = [
  { date: 'Dec 1', liters: 2850 },
  { date: 'Dec 2', liters: 2920 },
  { date: 'Dec 3', liters: 2780 },
  { date: 'Dec 4', liters: 2950 },
  { date: 'Dec 5', liters: 3100 },
  { date: 'Dec 6', liters: 3050 },
  { date: 'Dec 7', liters: 3200 },
];

const healthStatusData = [
  { name: 'Healthy', value: 112, color: '#10b981' },
  { name: 'Minor Issues', value: 8, color: '#f59e0b' },
  { name: 'Treatment', value: 3, color: '#ef4444' },
];

const barnZones = [
  { zone: 'A1', temp: 18.5, humidity: 65, status: 'good' },
  { zone: 'A2', temp: 19.2, humidity: 68, status: 'good' },
  { zone: 'B1', temp: 22.1, humidity: 72, status: 'warning' },
  { zone: 'B2', temp: 18.8, humidity: 64, status: 'good' },
  { zone: 'C1', temp: 17.9, humidity: 66, status: 'good' },
  { zone: 'C2', temp: 24.3, humidity: 78, status: 'critical' },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="p-8 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 mb-1">Total Cows</p>
              <h3 className="text-gray-900 mb-2">123</h3>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+2 this month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Milk className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 mb-1">Milking Cows</p>
              <h3 className="text-gray-900 mb-2">98</h3>
              <div className="flex items-center gap-1 text-gray-600">
                <span>79.7% of herd</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 mb-1">Milk Today (L)</p>
              <h3 className="text-gray-900 mb-2">3,200</h3>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+4.8% vs yesterday</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-600 mb-1">Active Alerts</p>
              <h3 className="text-gray-900 mb-2">7</h3>
              <div className="flex items-center gap-1 text-amber-600">
                <span>2 critical</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Milk Production Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h3 className="text-gray-900 mb-1">Daily Milk Production</h3>
            <p className="text-gray-600">Last 7 days</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={milkProductionData}>
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
                dataKey="liters" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Health Status Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h3 className="text-gray-900 mb-1">Health Status</h3>
            <p className="text-gray-600">Current distribution</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={healthStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {healthStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {healthStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-gray-700">{item.name}</span>
                </div>
                <span className="text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Barn Zones & Sensors */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="mb-6">
          <h3 className="text-gray-900 mb-1">Barn Zones & Sensor Status</h3>
          <p className="text-gray-600">Real-time environmental monitoring</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {barnZones.map((zone) => (
            <div 
              key={zone.zone}
              className={`p-4 rounded-lg border-2 ${
                zone.status === 'good' ? 'border-green-200 bg-green-50' :
                zone.status === 'warning' ? 'border-amber-200 bg-amber-50' :
                'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-900">Zone {zone.zone}</span>
                <div className={`w-2 h-2 rounded-full ${
                  zone.status === 'good' ? 'bg-green-500' :
                  zone.status === 'warning' ? 'bg-amber-500' :
                  'bg-red-500'
                }`}></div>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-gray-600">Temp</p>
                  <p className="text-gray-900">{zone.temp}°C</p>
                </div>
                <div>
                  <p className="text-gray-600">Humidity</p>
                  <p className="text-gray-900">{zone.humidity}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => onNavigate('alerts')}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Recent Alerts</h3>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-gray-600 mb-2">2 critical alerts require attention</p>
          <span className="text-green-600">View all alerts →</span>
        </button>

        <button 
          onClick={() => onNavigate('tasks')}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Open Tasks</h3>
            <CheckSquare className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-gray-600 mb-2">12 tasks pending completion</p>
          <span className="text-green-600">Manage tasks →</span>
        </button>

        <button 
          onClick={() => onNavigate('cows')}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Cow Management</h3>
            <Milk className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-gray-600 mb-2">View and manage all cows</p>
          <span className="text-green-600">View cows →</span>
        </button>
      </div>
    </div>
  );
}
