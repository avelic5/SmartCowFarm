import { Thermometer, Droplets, Wind, AlertTriangle, CloudSun } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const zones = [
  { name: 'Zona A1', temp: 18.5, hum: 65, co2: 720, status: 'dobro', updated: 'prije 2 min' },
  { name: 'Zona A2', temp: 19.2, hum: 68, co2: 760, status: 'dobro', updated: 'prije 3 min' },
  { name: 'Zona B1', temp: 22.1, hum: 72, co2: 910, status: 'upozorenje', updated: 'prije 1 min' },
  { name: 'Zona B2', temp: 24.3, hum: 78, co2: 1020, status: 'kritično', updated: 'prije 30 sek' },
  { name: 'Zona C1', temp: 17.9, hum: 66, co2: 680, status: 'dobro', updated: 'prije 4 min' },
  { name: 'Zona C2', temp: 24.3, hum: 78, co2: 1040, status: 'kritično', updated: 'prije 45 sek' },
];

const outdoor = {
  temp: 6.5,
  hum: 54,
  wind: 12,
  condition: 'Oblačno',
};

export function SenzoriOkolina() {
  const { isDarkMode } = useSettings();
  const cardBg = isDarkMode ? '#0f1727' : '#ffffff';
  const cardBorder = isDarkMode ? '#1c2436' : '#e5e7eb';
  const cardText = isDarkMode ? '#e7eefc' : '#0f1727';
  const subText = isDarkMode ? '#b9c7e3' : '#4b5563';

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Senzori i okolina</h1>
        <p className={`mt-1 mb-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-600'}`}>Uslovi u staji, upozorenja i vanjski meteo podaci</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div
          className="rounded-xl border p-4 shadow-sm"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center border text-white"
              style={{
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#0f1727',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.25)' : '#0f1727',
              }}
            >
              <Thermometer className="w-5 h-5" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: subText }}>Prosječna temperatura</p>
              <p className="text-2xl font-semibold" style={{ color: cardText }}>20.3°C</p>
              <p className="text-xs" style={{ color: subText }}>Idealni raspon: 18–22°C</p>
            </div>
          </div>
        </div>
        <div
          className="rounded-xl border p-4 shadow-sm"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center border text-white"
              style={{
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#0f1727',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.25)' : '#0f1727',
              }}
            >
              <Droplets className="w-5 h-5" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: subText }}>Prosječna vlažnost</p>
              <p className="text-2xl font-semibold" style={{ color: cardText }}>69%</p>
              <p className="text-xs" style={{ color: subText }}>Target: 60–70%</p>
            </div>
          </div>
        </div>
        <div
          className="rounded-xl border p-4 shadow-sm"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center border text-white"
              style={{
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#0f1727',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.25)' : '#0f1727',
              }}
            >
              <Wind className="w-5 h-5" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: subText }}>CO₂ prosjek</p>
              <p className="text-2xl font-semibold" style={{ color: cardText }}>840 ppm</p>
              <p className="text-xs" style={{ color: subText }}>Upozorenje iznad 950 ppm</p>
            </div>
          </div>
        </div>
        <div
          className="rounded-xl border p-4 shadow-sm"
          style={{ backgroundColor: cardBg, borderColor: cardBorder }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-lg flex items-center justify-center border text-white"
              style={{
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : '#0f1727',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.25)' : '#0f1727',
              }}
            >
              <AlertTriangle className="w-5 h-5" style={{ color: '#ffffff' }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: subText }}>Aktivna upozorenja</p>
              <p className="text-2xl font-semibold" style={{ color: cardText }}>2 kritična</p>
              <p className="text-xs" style={{ color: subText }}>Zona B2, C2</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mt-4 md:mt-6">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Zone u staji</h3>
            <span className="text-sm text-gray-500">Real-time</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {zones.map((z) => (
              <div key={z.name} className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">{z.name}</p>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${z.status === 'dobro' ? 'bg-green-50 text-green-700' : z.status === 'upozorenje' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                    {z.status}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-700">
                  <span className="inline-flex items-center gap-1"><Thermometer className="w-4 h-4" /> {z.temp}°C</span>
                  <span className="inline-flex items-center gap-1"><Droplets className="w-4 h-4" /> {z.hum}%</span>
                  <span className="inline-flex items-center gap-1"><Wind className="w-4 h-4" /> {z.co2} ppm</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>Posljednje ažuriranje</span>
                  <span>{z.updated}</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
                  <div className={`h-2 rounded-full ${z.co2 > 1000 ? 'bg-red-500' : z.co2 > 900 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${Math.min((z.co2 / 1200) * 100, 100)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-xl border p-6 shadow-sm"
          style={{ backgroundColor: cardBg, borderColor: cardBorder, color: cardText }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold" style={{ color: cardText }}>Vanjski uslovi</h3>
            <CloudSun className="w-5 h-5" style={{ color: '#ffffff' }} />
          </div>
          <div className="space-y-3 text-sm" style={{ color: subText }}>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2"><Thermometer className="w-4 h-4" /> Temperatura</span>
              <span className="font-semibold" style={{ color: cardText }}>{outdoor.temp}°C</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2"><Droplets className="w-4 h-4" /> Vlažnost</span>
              <span className="font-semibold" style={{ color: cardText }}>{outdoor.hum}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2"><Wind className="w-4 h-4" /> Vjetar</span>
              <span className="font-semibold" style={{ color: cardText }}>{outdoor.wind} km/h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2"><CloudSun className="w-4 h-4" /> Stanje</span>
              <span className="font-semibold" style={{ color: cardText }}>{outdoor.condition}</span>
            </div>
          </div>
          <div
            className="mt-5 rounded-lg p-4 text-xs leading-relaxed"
            style={{
              backgroundColor: isDarkMode ? '#132035' : '#e5f2ff',
              color: isDarkMode ? '#fdfaf2' : '#0f1727',
              border: isDarkMode ? '1px solid #20304a' : '1px solid #cde4ff',
            }}
          >
            Napomena: Zona B2/C2 prelazi CO₂ prag. Aktiviraj ventilaciju na +15% i provjeri maglenje.
          </div>
        </div>
      </div>
    </div>
  );
}
