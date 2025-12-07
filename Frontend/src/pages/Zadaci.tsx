import { useData } from '../context/DataContext';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';

export function Zadaci() {
  const { zadaci, ažurirajZadatak } = useData();

  const handlePromjeniStatus = (id: string, noviStatus: 'novo' | 'u-toku' | 'završeno') => {
    ažurirajZadatak(id, { status: noviStatus });
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Zadaci</h1>
        <p className="text-gray-600 mt-1">Upravljanje dnevnim zadacima i obavezama</p>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Novi zadaci</p>
          <p className="text-2xl font-bold text-blue-600">
            {zadaci.filter(z => z.status === 'novo').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">U toku</p>
          <p className="text-2xl font-bold text-yellow-600">
            {zadaci.filter(z => z.status === 'u-toku').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Završeno</p>
          <p className="text-2xl font-bold text-green-600">
            {zadaci.filter(z => z.status === 'završeno').length}
          </p>
        </div>
      </div>

      {/* Lista zadataka */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Svi zadaci</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {zadaci.map(zadatak => (
            <div key={zadatak.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer
                  ${zadatak.status === 'završeno' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}
                  onClick={() => handlePromjeniStatus(
                    zadatak.id, 
                    zadatak.status === 'završeno' ? 'novo' : 'završeno'
                  )}
                >
                  {zadatak.status === 'završeno' && (
                    <CheckSquare className="w-4 h-4 text-white" />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className={`font-semibold text-gray-900 ${
                      zadatak.status === 'završeno' ? 'line-through text-gray-400' : ''
                    }`}>
                      {zadatak.naslov}
                    </h4>
                    <div className="flex gap-2">
                      {zadatak.status !== 'završeno' && (
                        <>
                          <button
                            onClick={() => handlePromjeniStatus(zadatak.id, 'u-toku')}
                            className={`text-xs px-3 py-1 rounded ${
                              zadatak.status === 'u-toku'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            U toku
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{zadatak.opis}</p>
                  
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded ${
                      zadatak.prioritet === 'visok' ? 'bg-red-100 text-red-700' :
                      zadatak.prioritet === 'srednji' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {zadatak.prioritet.charAt(0).toUpperCase() + zadatak.prioritet.slice(1)} prioritet
                    </span>
                    
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      Rok: {new Date(zadatak.rokIzvršenja).toLocaleDateString('bs-BA')}
                    </span>
                    
                    {zadatak.dodijeljeno && (
                      <span className="text-xs text-gray-500">
                        Dodijeljeno: {zadatak.dodijeljeno}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
