import { useState } from 'react';
import { ArrowLeft, Edit, Milk, Heart, CheckSquare, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Page } from '../App';

interface CowDetailProps {
  cowId: string | null;
  onNavigate: (page: Page, data?: any) => void;
}

const milkHistoryData = [
  { date: 'Dec 1', morning: 16.2, evening: 15.8 },
  { date: 'Dec 2', morning: 16.5, evening: 16.0 },
  { date: 'Dec 3', morning: 15.9, evening: 15.5 },
  { date: 'Dec 4', morning: 16.8, evening: 16.2 },
  { date: 'Dec 5', morning: 17.1, evening: 16.6 },
  { date: 'Dec 6', morning: 16.4, evening: 16.1 },
  { date: 'Dec 7', morning: 17.3, evening: 16.9 },
];

const healthCases = [
  { id: 1, date: '2025-11-15', diagnosis: 'Mastitis - Left Front', treatment: 'Antibiotics (5 days)', vet: 'Dr. Smith', status: 'resolved' },
  { id: 2, date: '2025-10-08', diagnosis: 'Lameness - Right Hind', treatment: 'Hoof trimming + Rest', vet: 'Dr. Johnson', status: 'resolved' },
  { id: 3, date: '2025-09-22', diagnosis: 'Routine vaccination', treatment: 'Annual vaccine', vet: 'Dr. Smith', status: 'completed' },
];

const tasks = [
  { id: 1, title: 'Routine health check', assignee: 'Dr. Smith', dueDate: '2025-12-15', priority: 'medium', status: 'planned' },
  { id: 2, title: 'Hoof inspection', assignee: 'John Doe', dueDate: '2025-12-10', priority: 'high', status: 'in-progress' },
];

const alerts = [
  { id: 1, type: 'Milk quality', message: 'SCC slightly elevated', severity: 'warning', time: '2 hours ago' },
];

export function CowDetail({ cowId, onNavigate }: CowDetailProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'milk' | 'health' | 'tasks' | 'alerts'>('profile');

  if (!cowId) {
    return (
      <div className="p-8">
        <p className="text-gray-600">No cow selected</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('cows')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-gray-900 mb-1">Bella - {cowId}</h2>
            <p className="text-gray-600">Holstein • Milking</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('cow-form', { cowId })}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-500 transition-all shadow-md"
        >
          <Edit className="w-4 h-4" />
          Edit Cow
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {[
            { id: 'profile', label: 'Profile', icon: Milk },
            { id: 'milk', label: 'Milk History', icon: Milk },
            { id: 'health', label: 'Health Cases', icon: Heart },
            { id: 'tasks', label: 'Tasks', icon: CheckSquare },
            { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-1">ID Number</p>
                  <p className="text-gray-900">{cowId}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Name</p>
                  <p className="text-gray-900">Bella</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Breed</p>
                  <p className="text-gray-900">Holstein</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Birth Date</p>
                  <p className="text-gray-900">2022-03-15</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Current Status</p>
                  <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700">
                    Milking
                  </span>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Barn Zone</p>
                  <p className="text-gray-900">A2</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Avg Daily Milk</p>
                  <p className="text-gray-900">32.5 L</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Last Calving</p>
                  <p className="text-gray-900">2024-09-10</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-gray-900 mb-4">Origin & Genetics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-1">Sire ID</p>
                  <p className="text-gray-900">H-12345</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Dam ID</p>
                  <p className="text-gray-900">C-789</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Origin Farm</p>
                  <p className="text-gray-900">Green Valley Dairy</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Acquisition Date</p>
                  <p className="text-gray-900">2022-03-15</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-gray-900 mb-4">Photo</h3>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <Milk className="w-16 h-16 text-gray-400" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Calvings</span>
                  <span className="text-gray-900">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Days in Milk</span>
                  <span className="text-gray-900">88</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Health Score</span>
                  <span className="text-green-600">95/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'milk' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-gray-900 mb-6">7-Day Milk Production</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={milkHistoryData}>
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
                <Line type="monotone" dataKey="morning" stroke="#10b981" strokeWidth={2} name="Morning" />
                <Line type="monotone" dataKey="evening" stroke="#3b82f6" strokeWidth={2} name="Evening" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-gray-900">Recent Milking Sessions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-700">Date/Time</th>
                    <th className="px-6 py-3 text-left text-gray-700">Quantity (L)</th>
                    <th className="px-6 py-3 text-left text-gray-700">Duration (min)</th>
                    <th className="px-6 py-3 text-left text-gray-700">Avg Flow (L/min)</th>
                    <th className="px-6 py-3 text-left text-gray-700">Temp (°C)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">2025-12-07 06:15</td>
                    <td className="px-6 py-4 text-gray-900">17.3</td>
                    <td className="px-6 py-4 text-gray-600">8.5</td>
                    <td className="px-6 py-4 text-gray-600">2.04</td>
                    <td className="px-6 py-4 text-gray-600">37.2</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">2025-12-07 16:30</td>
                    <td className="px-6 py-4 text-gray-900">16.9</td>
                    <td className="px-6 py-4 text-gray-600">8.2</td>
                    <td className="px-6 py-4 text-gray-600">2.06</td>
                    <td className="px-6 py-4 text-gray-600">37.1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'health' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-gray-900">Health History</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {healthCases.map(healthCase => (
              <div key={healthCase.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-gray-900 mb-1">{healthCase.diagnosis}</h4>
                    <p className="text-gray-600">{healthCase.date}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full ${
                    healthCase.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {healthCase.status.charAt(0).toUpperCase() + healthCase.status.slice(1)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Treatment</p>
                    <p className="text-gray-900">{healthCase.treatment}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Veterinarian</p>
                    <p className="text-gray-900">{healthCase.vet}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-gray-900">Assigned Tasks</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {tasks.map(task => (
              <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-gray-900 mb-1">{task.title}</h4>
                    <p className="text-gray-600">Due: {task.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    <span className={`px-3 py-1 rounded-full ${
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {task.status === 'in-progress' ? 'In Progress' : 'Planned'}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600">Assigned to: {task.assignee}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'alerts' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-gray-900">Active Alerts</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {alerts.map(alert => (
              <div key={alert.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    alert.severity === 'warning' ? 'bg-amber-100' : 'bg-red-100'
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      alert.severity === 'warning' ? 'text-amber-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-gray-900">{alert.type}</h4>
                      <span className="text-gray-500">{alert.time}</span>
                    </div>
                    <p className="text-gray-600">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
