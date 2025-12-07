import { Thermometer, Droplets, Wind, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Page } from '../App';

interface SensorsEnvironmentProps {
  onNavigate: (page: Page) => void;
}

const zones = [
  { 
    id: 'A1', 
    name: 'Zone A1', 
    temp: 18.5, 
    humidity: 65, 
    nh3: 8, 
    co2: 850,
    status: 'good',
    cows: 20,
    sparkline: [18.2, 18.4, 18.5, 18.3, 18.5, 18.6, 18.5]
  },
  { 
    id: 'A2', 
    name: 'Zone A2', 
    temp: 19.2, 
    humidity: 68, 
    nh3: 12, 
    co2: 920,
    status: 'good',
    cows: 22,
    sparkline: [19.0, 19.1, 19.3, 19.2, 19.1, 19.2, 19.2]
  },
  { 
    id: 'B1', 
    name: 'Zone B1', 
    temp: 22.1, 
    humidity: 72, 
    nh3: 18, 
    co2: 1050,
    status: 'warning',
    cows: 18,
    sparkline: [20.5, 21.2, 21.8, 22.0, 22.1, 22.3, 22.1]
  },
  { 
    id: 'B2', 
    name: 'Zone B2', 
    temp: 18.8, 
    humidity: 64, 
    nh3: 9, 
    co2: 880,
    status: 'good',
    cows: 21,
    sparkline: [18.5, 18.7, 18.8, 18.6, 18.8, 18.9, 18.8]
  },
  { 
    id: 'C1', 
    name: 'Zone C1', 
    temp: 17.9, 
    humidity: 66, 
    nh3: 10, 
    co2: 840,
    status: 'good',
    cows: 19,
    sparkline: [17.8, 17.9, 17.8, 17.9, 18.0, 17.9, 17.9]
  },
  { 
    id: 'C2', 
    name: 'Zone C2', 
    temp: 24.3, 
    humidity: 78, 
    nh3: 25, 
    co2: 1250,
    status: 'critical',
    cows: 23,
    sparkline: [22.8, 23.2, 23.8, 24.0, 24.2, 24.5, 24.3]
  },
];

const temperatureHistory = [
  { time: '00:00', A1: 18.2, A2: 19.0, B1: 20.5, B2: 18.5, C1: 17.8, C2: 22.8 },
  { time: '04:00', A1: 18.4, A2: 19.1, B1: 21.2, B2: 18.7, C1: 17.9, C2: 23.2 },
  { time: '08:00', A1: 18.5, A2: 19.3, B1: 21.8, B2: 18.8, C1: 17.8, C2: 23.8 },
  { time: '12:00', A1: 18.3, A2: 19.2, B1: 22.0, B2: 18.6, C1: 17.9, C2: 24.0 },
  { time: '16:00', A1: 18.5, A2: 19.1, B1: 22.1, B2: 18.8, C1: 18.0, C2: 24.2 },
  { time: '20:00', A1: 18.6, A2: 19.2, B1: 22.3, B2: 18.9, C1: 17.9, C2: 24.5 },
  { time: '23:59', A1: 18.5, A2: 19.2, B1: 22.1, B2: 18.8, C1: 17.9, C2: 24.3 },
];

export function SensorsEnvironment({ onNavigate }: SensorsEnvironmentProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-amber-200 bg-amber-50';
      case 'critical': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getValueColor = (value: number, type: 'temp' | 'humidity' | 'nh3' | 'co2') => {
    if (type === 'temp') {
      if (value < 16 || value > 22) return 'text-red-600';
      if (value < 17 || value > 21) return 'text-amber-600';
      return 'text-green-600';
    }
    if (type === 'humidity') {
      if (value < 50 || value > 75) return 'text-red-600';
      if (value < 55 || value > 70) return 'text-amber-600';
      return 'text-green-600';
    }
    if (type === 'nh3') {
      if (value > 20) return 'text-red-600';
      if (value > 15) return 'text-amber-600';
      return 'text-green-600';
    }
    if (type === 'co2') {
      if (value > 1200) return 'text-red-600';
      if (value > 1000) return 'text-amber-600';
      return 'text-green-600';
    }
    return 'text-gray-900';
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-1">Sensors & Environment</h2>
        <p className="text-gray-600">Real-time environmental monitoring across barn zones</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-gray-600">Avg Temperature</p>
          </div>
          <h3 className="text-gray-900">19.5°C</h3>
          <p className="text-green-600">Optimal range</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Droplets className="w-5 h-5 text-cyan-600" />
            </div>
            <p className="text-gray-600">Avg Humidity</p>
          </div>
          <h3 className="text-gray-900">68.8%</h3>
          <p className="text-green-600">Within limits</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Wind className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-gray-600">Avg NH₃</p>
          </div>
          <h3 className="text-gray-900">13.7 ppm</h3>
          <p className="text-amber-600">1 zone elevated</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-gray-600">Active Alerts</p>
          </div>
          <h3 className="text-gray-900">2</h3>
          <p className="text-red-600">1 critical zone</p>
        </div>
      </div>

      {/* Zone Cards */}
      <div>
        <h3 className="text-gray-900 mb-4">Barn Zones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <div 
              key={zone.id}
              className={`rounded-xl p-6 border-2 shadow-sm ${getStatusColor(zone.status)}`}
            >
              {/* Zone header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-gray-900">{zone.name}</h4>
                  <p className="text-gray-600">{zone.cows} cows</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  zone.status === 'good' ? 'bg-green-500' :
                  zone.status === 'warning' ? 'bg-amber-500' :
                  'bg-red-500'
                }`}></div>
              </div>

              {/* Metrics */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Temperature</span>
                  </div>
                  <span className={getValueColor(zone.temp, 'temp')}>
                    {zone.temp}°C
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">Humidity</span>
                  </div>
                  <span className={getValueColor(zone.humidity, 'humidity')}>
                    {zone.humidity}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">NH₃</span>
                  </div>
                  <span className={getValueColor(zone.nh3, 'nh3')}>
                    {zone.nh3} ppm
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">CO₂</span>
                  </div>
                  <span className={getValueColor(zone.co2, 'co2')}>
                    {zone.co2} ppm
                  </span>
                </div>
              </div>

              {/* Mini sparkline */}
              <div className="h-8 flex items-end gap-1">
                {zone.sparkline.map((val, idx) => (
                  <div 
                    key={idx}
                    className={`flex-1 rounded-t ${
                      zone.status === 'good' ? 'bg-green-300' :
                      zone.status === 'warning' ? 'bg-amber-300' :
                      'bg-red-300'
                    }`}
                    style={{ height: `${(val - 16) * 10}px` }}
                  ></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Temperature History Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-gray-900 mb-6">24-Hour Temperature History</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={temperatureHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" stroke="#6b7280" />
            <YAxis stroke="#6b7280" domain={[15, 26]} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line type="monotone" dataKey="A1" stroke="#10b981" strokeWidth={2} dot={false} name="Zone A1" />
            <Line type="monotone" dataKey="A2" stroke="#3b82f6" strokeWidth={2} dot={false} name="Zone A2" />
            <Line type="monotone" dataKey="B1" stroke="#f59e0b" strokeWidth={2} dot={false} name="Zone B1" />
            <Line type="monotone" dataKey="B2" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Zone B2" />
            <Line type="monotone" dataKey="C1" stroke="#06b6d4" strokeWidth={2} dot={false} name="Zone C1" />
            <Line type="monotone" dataKey="C2" stroke="#ef4444" strokeWidth={2} dot={false} name="Zone C2" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
