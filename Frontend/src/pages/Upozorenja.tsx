import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';
import { AlertTriangle, Info, AlertCircle, Check } from 'lucide-react';

export function Upozorenja() {
  const { upozorenja, označiUpozorenjeKaoPročitano, označiSvaUpozorenjaKaoPročitana } = useData();
  const { formatDateTime, isDarkMode } = useSettings();

  const cardBg = isDarkMode ? '#0f1727' : '#ffffff';
  const cardBorder = isDarkMode ? '#1c2436' : '#e5e7eb';
  const cardText = isDarkMode ? '#e7eefc' : '#0f1727';
  const subText = isDarkMode ? '#b9c7e3' : '#4b5563';

  const handleOznačiPročitano = (id: string) => {
    označiUpozorenjeKaoPročitano(id);
  };

  return (
    <div className="p-4 md:p-8 space-y-8" style={{ color: cardText }}>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Upozorenja</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <p className={isDarkMode ? 'text-slate-200' : 'text-gray-600'}>Pregled svih aktivnih upozorenja i obavještenja</p>
          {upozorenja.some(u => !u.pročitano) && (
            <button
              onClick={označiSvaUpozorenjaKaoPročitana}
              className="text-sm px-4 py-2 rounded-lg transition-colors"
              style={{
                backgroundColor: isDarkMode ? '#182235' : '#f8fafc',
                border: `1px solid ${isDarkMode ? '#2c3447' : '#e5e7eb'}`,
                color: isDarkMode ? '#e7eefc' : '#0f1727',
              }}
            >
              Označi sve pročitane
            </button>
          )}
        </div>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 rounded-lg border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
          <p className="text-sm" style={{ color: subText }}>Kritična</p>
          <p className="text-2xl font-bold" style={{ color: isDarkMode ? '#ffb4a2' : '#b91c1c' }}>
            {upozorenja.filter(u => u.tip === 'kritično' && !u.pročitano).length}
          </p>
        </div>
        <div className="p-4 rounded-lg border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
          <p className="text-sm" style={{ color: subText }}>Upozorenja</p>
          <p className="text-2xl font-bold" style={{ color: isDarkMode ? '#ffd166' : '#c2410c' }}>
            {upozorenja.filter(u => u.tip === 'upozorenje' && !u.pročitano).length}
          </p>
        </div>
        <div className="p-4 rounded-lg border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
          <p className="text-sm" style={{ color: subText }}>Informacije</p>
          <p className="text-2xl font-bold" style={{ color: isDarkMode ? '#9bbcff' : '#1d4ed8' }}>
            {upozorenja.filter(u => u.tip === 'info' && !u.pročitano).length}
          </p>
        </div>
      </div>

      {/* Lista upozorenja */}
      <div className="space-y-4">
        {upozorenja.map(upozorenje => {
          const Ikona = upozorenje.tip === 'kritično' ? AlertTriangle :
                       upozorenje.tip === 'upozorenje' ? AlertCircle : Info;
          const boje = upozorenje.tip === 'kritično' 
            ? 'bg-red-50 border-red-200 text-red-900'
            : upozorenje.tip === 'upozorenje'
            ? 'bg-yellow-50 border-yellow-200 text-yellow-900'
            : 'bg-blue-50 border-blue-200 text-blue-900';
          
          const ikonaBoja = upozorenje.tip === 'kritično' ? 'text-red-600' :
                           upozorenje.tip === 'upozorenje' ? 'text-yellow-600' : 'text-blue-600';

          return (
            <div 
              key={upozorenje.id}
              className={`p-6 rounded-lg border ${upozorenje.pročitano ? 'opacity-70' : ''}`}
              style={{
                backgroundColor: upozorenje.pročitano ? (isDarkMode ? '#1a2435' : '#f8fafc') : cardBg,
                borderColor: upozorenje.pročitano ? (isDarkMode ? '#253349' : '#e5e7eb') : cardBorder,
                color: cardText,
              }}
            >
              <div className="flex items-start gap-4">
                <Ikona className={`w-6 h-6 mt-1`} style={{ color: isDarkMode ? '#ffffff' : '#0f1727' }} />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold" style={{ color: cardText }}>{upozorenje.naslov}</h4>
                      {upozorenje.pročitano && (
                        <span
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: isDarkMode ? '#182235' : '#f0fdf4',
                            color: isDarkMode ? '#9ad8a8' : '#166534',
                            border: `1px solid ${isDarkMode ? '#2c3447' : '#bbf7d0'}`,
                          }}
                        >
                          Pročitano
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!upozorenje.pročitano && (
                        <button
                          onClick={() => handleOznačiPročitano(upozorenje.id)}
                          className="flex items-center gap-1 text-xs px-3 py-1 rounded transition-colors"
                          style={{
                            backgroundColor: isDarkMode ? '#182235' : '#f8fafc',
                            border: `1px solid ${isDarkMode ? '#2c3447' : '#e5e7eb'}`,
                            color: isDarkMode ? '#e7eefc' : '#0f1727',
                          }}
                        >
                          <Check className="w-3 h-3" style={{ color: '#ffffff' }} />
                          Označi pročitano
                        </button>
                      )}
                      <span className="text-xs" style={{ color: subText }}>
                        {formatDateTime(upozorenje.datum)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mb-3" style={{ color: subText }}>{upozorenje.poruka}</p>
                  {upozorenje.akcija && (
                    <button className="text-sm font-medium" style={{ color: isDarkMode ? '#7ae7c7' : '#047857' }}>
                      {upozorenje.akcija} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {upozorenja.length === 0 && (
          <div className="rounded-lg border p-12 text-center" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
            <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-lg" style={{ color: cardText }}>Nema aktivnih upozorenja</p>
          </div>
        )}
      </div>
    </div>
  );
}
