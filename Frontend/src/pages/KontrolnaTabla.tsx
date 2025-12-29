import { useNavigate } from 'react-router-dom';
import { Milk, Activity, AlertTriangle, CheckSquare, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';

const podaciProdukcije = [
  { datum: '1 Dec', litri: 2850 },
  { datum: '2 Dec', litri: 2920 },
  { datum: '3 Dec', litri: 2780 },
  { datum: '4 Dec', litri: 2950 },
  { datum: '5 Dec', litri: 3100 },
  { datum: '6 Dec', litri: 3050 },
  { datum: '7 Dec', litri: 3200 },
];

const zoneStaje = [
  { zona: 'A1', temp: 18.5, vlažnost: 65, status: 'dobro' },
  { zona: 'A2', temp: 19.2, vlažnost: 68, status: 'dobro' },
  { zona: 'B1', temp: 22.1, vlažnost: 72, status: 'upozorenje' },
  { zona: 'B2', temp: 18.8, vlažnost: 64, status: 'dobro' },
  { zona: 'C1', temp: 17.9, vlažnost: 66, status: 'dobro' },
  { zona: 'C2', temp: 24.3, vlažnost: 78, status: 'kritično' },
];

export function KontrolnaTabla() {
  const navigate = useNavigate();
  const { krave, upozorenja, zadaci } = useData();
  const { formatDate, formatNumber } = useSettings();

  const ukupnoKrava = krave.length;
  const kraveNaMuži = krave.filter(k => k.status !== 'lijecenje').length;
  const aktivnaUpozorenja = upozorenja.filter(u => !u.pročitano).length;
  const kritičnaUpozorenja = upozorenja.filter(u => u.tip === 'kritično' && !u.pročitano).length;

  const podaciZdravlja = [
    { naziv: 'Zdrave', vrijednost: krave.filter(k => k.status === 'zdrava').length, boja: '#10b981' },
    { naziv: 'Manji problemi', vrijednost: krave.filter(k => k.status === 'praćenje').length, boja: '#f59e0b' },
    { naziv: 'Na liječenju', vrijednost: krave.filter(k => k.status === 'lijecenje').length, boja: '#ef4444' },
  ];

  const ukupnoZdravlje = podaciZdravlja.reduce((sum, stavka) => sum + stavka.vrijednost, 0);

  return (
    <div className="p-8 space-y-6">
      {/* KPI Kartice */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => navigate('/krave')}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ukupno krava</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{ukupnoKrava}</h3>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+2 ovog mjeseca</span>
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
              <p className="text-sm text-gray-600 mb-1">Krave na muži</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{kraveNaMuži}</h3>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <span>{formatNumber(Math.round((kraveNaMuži / ukupnoKrava) * 100))}% stada</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => navigate('/proizvodnja-mlijeka')}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Mlijeko danas (L)</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{formatNumber(3200)}</h3>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>+4.8% u odnosu na juče</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
             onClick={() => navigate('/upozorenja')}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Aktivna upozorenja</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{aktivnaUpozorenja}</h3>
              <div className="flex items-center gap-1 text-sm text-amber-600">
                <span>{kritičnaUpozorenja} kritična</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Grafikoni */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafikon proizvodnje mlijeka */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Dnevna proizvodnja mlijeka</h3>
            <p className="text-sm text-gray-600">Posljednjih 7 dana</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={podaciProdukcije}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="datum" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="litri" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', r: 4 }}
                name="Litri"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grafikon zdravstvenog stanja */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Zdravstveno stanje</h3>
            <p className="text-sm text-gray-600">Trenutna distribucija</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={podaciZdravlja}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                nameKey="naziv"
                dataKey="vrijednost"
              >
                {podaciZdravlja.map((stavka, index) => (
                  <Cell key={`cell-${index}`} fill={stavka.boja} />
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
          <div className="mt-4 space-y-2">
            {podaciZdravlja.map((stavka, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stavka.boja }}></div>
                  <span className="text-gray-700">{stavka.naziv}</span>
                </div>
                <span className="font-medium text-gray-900">{stavka.vrijednost}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Senzori okolina i Hitni zadaci */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone staje */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Senzori okolina</h3>
              <p className="text-sm text-gray-600">Status zona u staji</p>
            </div>
            <button 
              onClick={() => navigate('/senzori-okolina')}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Vidi sve →
            </button>
          </div>
          <div className="space-y-3">
            {zoneStaje.map((zona, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    zona.status === 'dobro' ? 'bg-green-500' :
                    zona.status === 'upozorenje' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Zona {zona.zona}</p>
                    <p className="text-xs text-gray-500">Temperatura: {zona.temp}°C | Vlažnost: {zona.vlažnost}%</p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                  zona.status === 'dobro' ? 'bg-green-100 text-green-700' :
                  zona.status === 'upozorenje' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {zona.status.charAt(0).toUpperCase() + zona.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hitni zadaci */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Hitni zadaci</h3>
              <p className="text-sm text-gray-600">Zadaci koji zahtijevaju pažnju</p>
            </div>
            <button 
              onClick={() => navigate('/zadaci')}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Vidi sve →
            </button>
          </div>
          <div className="space-y-3">
            {zadaci.filter(z => z.prioritet === 'visok' || z.status === 'novo').slice(0, 5).map((zadatak) => (
              <div key={zadatak.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <CheckSquare className={`w-5 h-5 mt-0.5 ${
                  zadatak.prioritet === 'visok' ? 'text-red-500' : 'text-gray-400'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{zadatak.naslov}</p>
                  <p className="text-xs text-gray-600 mt-1">{zadatak.opis}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      zadatak.prioritet === 'visok' ? 'bg-red-100 text-red-700' :
                      zadatak.prioritet === 'srednji' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {zadatak.prioritet.charAt(0).toUpperCase() + zadatak.prioritet.slice(1)} prioritet
                    </span>
                    <span className="text-xs text-gray-500">
                      Rok: {formatDate(zadatak.rokIzvršenja)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
