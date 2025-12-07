import { useState } from 'react';
import { AlertTriangle, CheckCircle, Filter } from 'lucide-react';
import { Page } from '../App';

interface AlertsProps {
  onNavigate: (page: Page) => void;
}

interface Alert {
  id: number;
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  time: string;
  source: 'AI' | 'Sensor' | 'Milk';
  relatedTo: string;
  status: 'new' | 'in-progress' | 'resolved';
}

const alertsData: Alert[] = [
  { 
    id: 1, 
    severity: 'critical', 
    title: 'High Temperature Alert', 
    message: 'Zone C2 temperature exceeded threshold (24.3°C)', 
    time: '30 min ago', 
    source: 'Sensor', 
    relatedTo: 'Zone C2', 
    status: 'new' 
  },
  { 
    id: 2, 
    severity: 'critical', 
    title: 'Elevated NH₃ Levels', 
    message: 'Ammonia levels in Zone C2 at 25 ppm (threshold: 20 ppm)', 
    time: '1 hour ago', 
    source: 'Sensor', 
    relatedTo: 'Zone C2', 
    status: 'in-progress' 
  },
  { 
    id: 3, 
    severity: 'warning', 
    title: 'Milk Quality - SCC Elevated', 
    message: 'Somatic cell count slightly elevated in Bella (C001)', 
    time: '2 hours ago', 
    source: 'Milk', 
    relatedTo: 'Bella (C001)', 
    status: 'new' 
  },
  { 
    id: 4, 
    severity: 'warning', 
    title: 'Low Milk Output', 
    message: 'Clover (C005) produced 15.2L, below average (expected: 30L)', 
    time: '3 hours ago', 
    source: 'AI', 
    relatedTo: 'Clover (C005)', 
    status: 'in-progress' 
  },
  { 
    id: 5, 
    severity: 'info', 
    title: 'Estrus Detection', 
    message: 'AI detected estrus behavior in Daisy (C002) with 95% confidence', 
    time: '5 hours ago', 
    source: 'AI', 
    relatedTo: 'Daisy (C002)', 
    status: 'in-progress' 
  },
  { 
    id: 6, 
    severity: 'warning', 
    title: 'Temperature Fluctuation', 
    message: 'Zone B1 temperature increased by 2°C in the last hour', 
    time: '6 hours ago', 
    source: 'Sensor', 
    relatedTo: 'Zone B1', 
    status: 'resolved' 
  },
  { 
    id: 7, 
    severity: 'info', 
    title: 'Vaccination Due', 
    message: 'Routine vaccinations due for 5 cows in the next 7 days', 
    time: '1 day ago', 
    source: 'AI', 
    relatedTo: 'Multiple cows', 
    status: 'new' 
  },
];

const severityConfig = {
  critical: { color: 'bg-red-100 text-red-700 border-red-200', icon: 'bg-red-500' },
  warning: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: 'bg-amber-500' },
  info: { color: 'bg-blue-100 text-blue-700 border-blue-200', icon: 'bg-blue-500' },
};

const statusColors = {
  'new': 'bg-purple-100 text-purple-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'resolved': 'bg-green-100 text-green-700',
};

export function Alerts({ onNavigate }: AlertsProps) {
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [alerts, setAlerts] = useState<Alert[]>(alertsData);

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || alert.source === sourceFilter;
    return matchesSeverity && matchesStatus && matchesSource;
  });

  const updateAlertStatus = (id: number, newStatus: Alert['status']) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: newStatus } : alert
    ));
  };

  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length;
  const warningCount = alerts.filter(a => a.severity === 'warning' && a.status !== 'resolved').length;
  const newCount = alerts.filter(a => a.status === 'new').length;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Alerts & Notifications</h2>
          <p className="text-gray-600">{filteredAlerts.length} alerts</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-gray-600">Critical Alerts</p>
          </div>
          <h3 className="text-gray-900">{criticalCount}</h3>
          <p className="text-red-600">Requires immediate attention</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-gray-600">Warnings</p>
          </div>
          <h3 className="text-gray-900">{warningCount}</h3>
          <p className="text-amber-600">Monitor closely</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-gray-600">New Alerts</p>
          </div>
          <h3 className="text-gray-900">{newCount}</h3>
          <p className="text-purple-600">Not yet reviewed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Sources</option>
              <option value="AI">AI Detection</option>
              <option value="Sensor">Sensor</option>
              <option value="Milk">Milk System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const config = severityConfig[alert.severity];
          return (
            <div 
              key={alert.id}
              className={`bg-white rounded-xl p-6 border-l-4 ${config.color} shadow-sm hover:shadow-md transition-all`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-10 h-10 ${config.icon} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <AlertTriangle className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-gray-900">{alert.title}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs ${statusColors[alert.status]}`}>
                          {alert.status === 'in-progress' ? 'In Progress' : 
                           alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-gray-500">
                        <span>{alert.time}</span>
                        <span>•</span>
                        <span>Source: {alert.source}</span>
                        <span>•</span>
                        <span>{alert.relatedTo}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="mt-4 flex gap-2">
                    {alert.status !== 'in-progress' && alert.status !== 'resolved' && (
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'in-progress')}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        Start Working
                      </button>
                    )}
                    {alert.status !== 'resolved' && (
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'resolved')}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Resolved
                      </button>
                    )}
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="bg-white rounded-xl p-12 border border-gray-200 shadow-sm text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-gray-900 mb-2">No alerts found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
