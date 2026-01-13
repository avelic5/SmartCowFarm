import { Heart, Activity, TrendingUp } from 'lucide-react';
import { Page } from '../App';
import { useEffect, useState } from 'react';
import { api } from '../api';
import type { ZdravstveniSlucajDto, KravaDto } from '../api/dto';

interface HealthReproductionProps {
  onNavigate: (page: Page) => void;
}

export function HealthReproduction({ onNavigate }: HealthReproductionProps) {
  const [slucajevi, setSlucajevi] = useState<ZdravstveniSlucajDto[] | null>(null);
  const [krave, setKrave] = useState<KravaDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([api.zdravstveniSlucajevi.list(), api.krave.list()])
      .then(([s, k]) => { if (mounted) { setSlucajevi(s); setKrave(k); } })
      .catch(e => setError(e?.message || 'Greška pri učitavanju zdravstvenih slučajeva.'));
    return () => { mounted = false; };
  }, []);

  const kravaNaziv = (id: number) => (krave || []).find(k => k.idKrave === id)?.oznakaKrave || `Krava ${id}`;

const estrusDetections = [
  { id: 1, cow: 'Daisy (C002)', date: '2025-12-05', confidence: 95, action: 'AI scheduled', status: 'pending' },
  { id: 2, cow: 'Bessie (C007)', date: '2025-12-03', confidence: 88, action: 'AI completed', status: 'completed' },
  { id: 3, cow: 'Molly (C008)', date: '2025-12-01', confidence: 92, action: 'Monitoring', status: 'monitoring' },
];

const reproductionStats = [
  { label: 'Pregnant Cows', value: 12, total: 123, percentage: 9.8 },
  { label: 'Expected Calvings (30 days)', value: 8, total: 123, percentage: 6.5 },
  { label: 'Avg Days Open', value: 95, target: 120, status: 'good' },
  { label: 'Conception Rate', value: 68, target: 60, status: 'excellent' },
];

const statusColors = {
  treatment: 'bg-red-100 text-red-700',
  monitoring: 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
};

const severityColors = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-1">Health & Reproduction</h2>
        <p className="text-gray-600">Monitor health incidents and reproductive status</p>
      </div>

      {/* Reproduction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reproductionStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <p className="text-gray-600">{stat.label}</p>
              {stat.status && (
                <div className={`w-2 h-2 rounded-full ${
                  stat.status === 'excellent' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
              )}
            </div>
            <h3 className="text-gray-900 mb-2">
              {stat.value}{stat.percentage !== undefined && '%'}
            </h3>
            {stat.target && (
              <p className={stat.value >= stat.target ? 'text-green-600' : 'text-gray-600'}>
                Target: {stat.target}
              </p>
            )}
            {stat.percentage !== undefined && (
              <p className="text-gray-600">{stat.total} total cows</p>
            )}
          </div>
        ))}
      </div>

      {/* Health Incidents (from API) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            <h3 className="text-gray-900">Health Incidents</h3>
          </div>
          <span className="text-gray-600">{slucajevi?.length ?? 0} cases</span>
        </div>
        <div className="divide-y divide-gray-200">
          {error && <div className="p-6 text-red-600">{error}</div>}
          {(slucajevi || []).map((s) => (
            <div key={s.idSlucaja} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-gray-900 mb-1">{kravaNaziv(s.idKrave)}</h4>
                  <p className="text-gray-600">{s.datumOtvaranja}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full ${s.statusSlucaja === 'PodNadzorom' ? 'bg-amber-100 text-amber-700' : s.statusSlucaja === 'Aktivna' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {s.statusSlucaja}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-8 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-gray-900">{s.dijagnoza || s.razlogOtvaranja}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estrus Detections */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            <h3 className="text-gray-900">Estrus Detections (AI Activity)</h3>
          </div>
          <span className="text-gray-600">{estrusDetections.length} recent detections</span>
        </div>
        <div className="divide-y divide-gray-200">
          {estrusDetections.map((detection) => (
            <div key={detection.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-gray-900 mb-1">{detection.cow}</h4>
                  <p className="text-gray-600">{detection.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full ${statusColors[detection.status as keyof typeof statusColors]}`}>
                  {detection.status.charAt(0).toUpperCase() + detection.status.slice(1)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">AI Confidence</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${detection.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-900">{detection.confidence}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600">Action</p>
                  <p className="text-gray-900 mt-1">{detection.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Schedule Vet Visit</h3>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-gray-600 mb-2">Book health check or treatment</p>
          <span className="text-green-600">Schedule now →</span>
        </button>

        <button className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">AI Service Request</h3>
            <Activity className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-gray-600 mb-2">Request artificial insemination</p>
          <span className="text-green-600">Request service →</span>
        </button>

        <button className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all text-left">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Calving Calendar</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-gray-600 mb-2">View expected calving dates</p>
          <span className="text-green-600">View calendar →</span>
        </button>
      </div>
    </div>
  );
}
