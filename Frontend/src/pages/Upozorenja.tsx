import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';
import { AlertTriangle, Info, AlertCircle, Check } from 'lucide-react';

export function Upozorenja() {
  const { upozorenja, označiUpozorenjeKaoPročitano, označiSvaUpozorenjaKaoPročitana } = useData();
  const { formatDateTime } = useSettings();

  const handleOznačiPročitano = (id: string) => {
    označiUpozorenjeKaoPročitano(id);
  };

  return (
    <div className="p-4 md:p-8 space-y-8 text-gray-900 dark:text-slate-100">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Upozorenja</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-gray-600 dark:text-slate-300">Pregled svih aktivnih upozorenja i obavještenja</p>
          {upozorenja.some(u => !u.pročitano) && (
            <button
              onClick={označiSvaUpozorenjaKaoPročitana}
              className="text-sm px-4 py-2 rounded-lg transition-colors border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:bg-slate-800/50"
            >
              Označi sve pročitane
            </button>
          )}
        </div>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="p-4 rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900/50">
          <p className="text-sm text-gray-600 dark:text-slate-300">Kritična</p>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">
            {upozorenja.filter(u => u.tip === 'kritično' && !u.pročitano).length}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900/50">
          <p className="text-sm text-gray-600 dark:text-slate-300">Upozorenja</p>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
            {upozorenja.filter(u => u.tip === 'upozorenje' && !u.pročitano).length}
          </p>
        </div>
        <div className="p-4 rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900/50">
          <p className="text-sm text-gray-600 dark:text-slate-300">Informacije</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {upozorenja.filter(u => u.tip === 'info' && !u.pročitano).length}
          </p>
        </div>
      </div>

      {/* Lista upozorenja */}
      <div className="space-y-4">
        {upozorenja.map(upozorenje => {
          const Ikona = upozorenje.tip === 'kritično' ? AlertTriangle :
                       upozorenje.tip === 'upozorenje' ? AlertCircle : Info;
          const ikonaBoja = upozorenje.tip === 'kritično'
            ? 'text-red-600 dark:text-red-300'
            : upozorenje.tip === 'upozorenje'
              ? 'text-amber-600 dark:text-amber-300'
              : 'text-blue-600 dark:text-blue-300';

          return (
            <div 
              key={upozorenje.id}
              className={`p-6 rounded-lg border ${upozorenje.pročitano ? 'opacity-70 bg-gray-50 border-gray-200 dark:bg-slate-950/40 dark:border-slate-700/60' : 'bg-white border-gray-200 dark:bg-slate-900/50 dark:border-slate-700'}`}
            >
              <div className="flex items-start gap-4">
                <Ikona className={`w-6 h-6 mt-1 ${ikonaBoja}`} />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900 dark:text-slate-100">{upozorenje.naslov}</h4>
                      {upozorenje.pročitano && (
                        <span
                          className="text-xs px-2 py-1 rounded-full border border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-200"
                        >
                          Pročitano
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!upozorenje.pročitano && (
                        <button
                          onClick={() => handleOznačiPročitano(upozorenje.id)}
                          className="flex items-center gap-1 text-xs px-3 py-1 rounded transition-colors border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:bg-slate-800/50"
                        >
                          <Check className="w-3 h-3" />
                          Označi pročitano
                        </button>
                      )}
                      <span className="text-xs text-gray-500 dark:text-slate-400">
                        {formatDateTime(upozorenje.datum)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm mb-3 text-gray-600 dark:text-slate-300">{upozorenje.poruka}</p>
                  {upozorenje.akcija && (
                    <button className="text-sm font-medium text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200">
                      {upozorenje.akcija} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {upozorenja.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900/50">
            <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-lg text-gray-900 dark:text-slate-100">Nema aktivnih upozorenja</p>
          </div>
        )}
      </div>
    </div>
  );
}
