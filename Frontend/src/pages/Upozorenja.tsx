import { useData } from '../context/DataContext';
import { AlertTriangle, Info, AlertCircle, Check } from 'lucide-react';

export function Upozorenja() {
  const { upozorenja, označiUpozorenjeKaoPročitano } = useData();

  const handleOznačiPročitano = (id: string) => {
    označiUpozorenjeKaoPročitano(id);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upozorenja</h1>
        <p className="text-gray-600 mt-1">Pregled svih aktivnih upozorenja i obavještenja</p>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Kritična</p>
          <p className="text-2xl font-bold text-red-600">
            {upozorenja.filter(u => u.tip === 'kritično' && !u.pročitano).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Upozorenja</p>
          <p className="text-2xl font-bold text-yellow-600">
            {upozorenja.filter(u => u.tip === 'upozorenje' && !u.pročitano).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Informacije</p>
          <p className="text-2xl font-bold text-blue-600">
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
              className={`p-6 rounded-lg border ${upozorenje.pročitano ? 'bg-gray-50 border-gray-200 opacity-60' : boje}`}
            >
              <div className="flex items-start gap-4">
                <Ikona className={`w-6 h-6 mt-1 ${ikonaBoja}`} />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{upozorenje.naslov}</h4>
                    <div className="flex items-center gap-2">
                      {!upozorenje.pročitano && (
                        <button
                          onClick={() => handleOznačiPročitano(upozorenje.id)}
                          className="flex items-center gap-1 text-xs px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                          <Check className="w-3 h-3" />
                          Označi pročitano
                        </button>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(upozorenje.datum).toLocaleString('bs-BA')}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{upozorenje.poruka}</p>
                  {upozorenje.akcija && (
                    <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                      {upozorenje.akcija} →
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {upozorenja.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Nema aktivnih upozorenja</p>
          </div>
        )}
      </div>
    </div>
  );
}
