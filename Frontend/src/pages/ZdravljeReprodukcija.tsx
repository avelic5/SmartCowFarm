import { HeartPulse, Stethoscope, Syringe, CalendarClock, AlertTriangle, Baby, Pill } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const healthKpi = [
  { icon: HeartPulse, label: 'Zdrave krave', value: '112', detail: '+3 vs prošli mjesec' },
  { icon: Syringe, label: 'Na liječenju', value: '3', detail: '2 antibiotik, 1 kontrola' },
  { icon: Stethoscope, label: 'Pregledi 30d', value: '27', detail: '92% završeno' },
  { icon: Baby, label: 'Repro ciklusi', value: '8 u toku', detail: '4 AI zakazana' },
];

const treatments = [
  { date: '02.12', cow: 'Ruža (BOS-003)', type: 'Antibiotik', vet: 'dr. Milić', status: 'u toku' },
  { date: '29.11', cow: 'Clover (C005)', type: 'Pregled nakon terapije', vet: 'dr. Milić', status: 'praćenje' },
  { date: '25.11', cow: 'Molly (C008)', type: 'Vakcinacija (BVD)', vet: 'dr. Sara', status: 'završeno' },
  { date: '18.11', cow: 'Bella (C001)', type: 'Kontrola papaka', vet: 'dr. Sara', status: 'završeno' },
];

const reproEvents = [
  { date: '09.12', cow: 'Milica (BOS-002)', event: 'AI termin', note: '3. ciklus, odličan score' },
  { date: '12.12', cow: 'Slavica (BOS-001)', event: 'Ultrazvuk', note: '35. dan nakon AI' },
  { date: '15.12', cow: 'Ruža (BOS-003)', event: 'Sinhronizacija', note: 'zakazati PGF2α' },
];

const risks = [
  { cow: 'Clover (C005)', issue: 'Pad proizvodnje 12% u 7d', severity: 'Upozorenje', action: 'Pojačati ishranu + CBC' },
  { cow: 'Ruža (BOS-003)', issue: 'Antibiotik – kontrola 05.12', severity: 'Kritično', action: 'Obavezna kontrola kvaliteta mlijeka' },
  { cow: 'Daisy (C002)', issue: 'Temperatura 38.9°C 2x u 3 dana', severity: 'Upozorenje', action: 'Kultura mlijeka + NSAID' },
];

export function ZdravljeReprodukcija() {
  const { isDarkMode } = useSettings();
  const cardBg = isDarkMode ? '#0f1727' : '#ffffff';
  const cardBorder = isDarkMode ? '#1c2436' : '#e5e7eb';
  const cardText = isDarkMode ? '#e7eefc' : '#0f1727';
  const subText = isDarkMode ? '#b9c7e3' : '#4b5563';
  const badgeText = isDarkMode ? '#9ad8a8' : '#0f766e';

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Zdravlje i reprodukcija</h1>
        <p className={`mt-1 mb-4 ${isDarkMode ? 'text-slate-200' : 'text-gray-600'}`}>Praćenje tretmana, reproduktivnih ciklusa i rizičnih slučajeva</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        {healthKpi.map(({ icon: Icon, label, value, detail }) => (
          <div
            key={label}
            className="rounded-xl border p-5 shadow-lg"
            style={{ backgroundColor: cardBg, borderColor: cardBorder, color: cardText }}
          >
            <div className="flex items-center gap-3 p-4">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center border text-white"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.15)' : '#0f1727',
                  borderColor: isDarkMode ? 'rgba(255,255,255,0.35)' : '#0f1727',
                }}
              >
                <Icon className="h-5 w-5 drop-shadow" style={{ color: '#ffffff', opacity: 1 }} />
              </div>
              <div>
                <p className="text-sm leading-tight" style={{ color: subText }}>{label}</p>
                <p className="text-2xl font-semibold leading-snug" style={{ color: cardText }}>{value}</p>
                <p className="text-xs mt-1 leading-tight" style={{ color: badgeText }}>{detail}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Zadnji tretmani</h3>
            <span className="text-sm text-gray-500">Hronološki prikaz</span>
          </div>
          <div className="space-y-4">
            {treatments.map((item) => (
              <div key={`${item.cow}-${item.date}`} className="flex items-start gap-4 rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarClock className="w-4 h-4" />
                      <span>{item.date}</span>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.status === 'završeno' ? 'bg-green-50 text-green-700' : item.status === 'u toku' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-700'}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{item.cow}</p>
                  <p className="text-sm text-gray-700">{item.type}</p>
                  <p className="text-xs text-gray-500">Veterinar: {item.vet}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reproduktivni kalendar</h3>
          <div className="space-y-3">
            {reproEvents.map((ev) => (
              <div key={ev.cow} className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span className="inline-flex items-center gap-2"><Baby className="w-4 h-4" /> {ev.event}</span>
                  <span>{ev.date}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-gray-900">{ev.cow}</p>
                <p className="text-xs text-gray-600">{ev.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Rizici i praćenje</h3>
            <p className="text-sm text-gray-600">Automatski flagovani slučajevi</p>
          </div>
          <AlertTriangle className="w-5 h-5 text-amber-500" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {risks.map((r) => (
            <div key={r.cow} className="rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
              <p className="text-sm font-semibold text-gray-900">{r.cow}</p>
              <p className="text-sm text-gray-700 mt-1">{r.issue}</p>
              <p className="text-xs text-gray-500 mt-1">Preporuka: {r.action}</p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">{r.severity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
