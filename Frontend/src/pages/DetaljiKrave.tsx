import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit, Activity, Milk, Calendar, Weight, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock podaci za proizvodnju
const mockProdukcija = [
  { datum: '1.12', litri: 32.5 },
  { datum: '2.12', litri: 34.2 },
  { datum: '3.12', litri: 31.8 },
  { datum: '4.12', litri: 33.5 },
  { datum: '5.12', litri: 35.1 },
  { datum: '6.12', litri: 34.8 },
  { datum: '7.12', litri: 33.2 },
];

export function DetaljiKrave() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { krave } = useData();
  const { formatDate, formatNumber } = useSettings();
  
  const krava = krave.find(k => k.id === id);

  if (!krava) {
    return (
      <div className="p-8">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Krava nije pronađena</h2>
          <p className="text-gray-600 mb-6">Krava sa ID-em {id} ne postoji u sistemu.</p>
          <button
            onClick={() => navigate('/krave')}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-500 transition-colors"
          >
            Nazad na listu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Zaglavlje */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/krave')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Nazad na listu
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{krava.ime}</h1>
          <p className="text-gray-600 mt-1">{krava.identifikacioniBroj}</p>
        </div>
        <button
          onClick={() => navigate(`/krave/${krava.id}/uredi`)}
          className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition-colors"
        >
          <Edit className="w-5 h-5" />
          Uredi
        </button>
      </div>

      {/* Osnovne informacije */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status i osnovni podaci */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Osnovne informacije</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Pasmina</p>
              <p className="text-lg font-semibold text-gray-900">{krava.pasmina}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Starost</p>
              <p className="text-lg font-semibold text-gray-900">{formatNumber(krava.starost, { maximumFractionDigits: 0 })} god.</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Težina</p>
              <p className="text-lg font-semibold text-gray-900">{formatNumber(krava.tezina)} kg</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Status</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${krava.status === 'zdrava' ? 'bg-green-100 text-green-800' : 
                  krava.status === 'lijecenje' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'}`}
              >
                {krava.status.charAt(0).toUpperCase() + krava.status.slice(1)}
              </span>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Datum rođenja</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatDate(krava.datumRodjenja)}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Prosječna proizvodnja</p>
              <p className="text-lg font-semibold text-gray-900">{formatNumber(krava.prosjecnaProdukcija, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} L/dan</p>
            </div>
          </div>

          {krava.napomene && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">Napomene:</p>
              <p className="text-sm text-blue-800">{krava.napomene}</p>
            </div>
          )}
        </div>

        {/* Brzi podaci */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Milk className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Zadnja proizvodnja</p>
                <p className="text-2xl font-bold text-gray-900">
                  {krava.zadnjaProdukcija !== undefined ? `${formatNumber(krava.zadnjaProdukcija, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} L` : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Zadnji pregled</p>
                <p className="text-lg font-semibold text-gray-900">
                  {krava.zadnjiPregled 
                    ? formatDate(krava.zadnjiPregled)
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vakcinacija</p>
                <p className="text-lg font-semibold text-gray-900">
                  {krava.zadnjeVakcinisanje 
                    ? formatDate(krava.zadnjeVakcinisanje)
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grafikon proizvodnje */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Proizvodnja mlijeka - Posljednjih 7 dana</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockProdukcija}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="datum" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
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

      {/* Brze akcije */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          onClick={() => navigate('/proizvodnja-mlijeka')}
          className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all text-left"
        >
          <Milk className="w-8 h-8 text-green-600 mb-3" />
          <h4 className="font-semibold text-gray-900 mb-1">Dodaj proizvodnju</h4>
          <p className="text-sm text-gray-600">Evidentiraj dnevnu proizvodnju mlijeka</p>
        </button>

        <button 
          onClick={() => navigate('/zdravlje-reprodukcija')}
          className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-left"
        >
          <Activity className="w-8 h-8 text-blue-600 mb-3" />
          <h4 className="font-semibold text-gray-900 mb-1">Zdravstveni zapis</h4>
          <p className="text-sm text-gray-600">Dodaj pregled ili liječenje</p>
        </button>

        <button className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all text-left">
          <Weight className="w-8 h-8 text-purple-600 mb-3" />
          <h4 className="font-semibold text-gray-900 mb-1">Ažuriraj težinu</h4>
          <p className="text-sm text-gray-600">Unesi novu izmjerenu težinu</p>
        </button>
      </div>
    </div>
  );
}
