import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useSettings } from '../context/SettingsContext';

export function ListaKrava() {
  const navigate = useNavigate();
  const { krave, obrišiKravu } = useData();
  const { formatDate, formatNumber } = useSettings();
  const [pretraga, setPretraga] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('sve');

  const filtiraneKrave = krave.filter(krava => {
    const odgovaraPretrazi = 
      krava.ime.toLowerCase().includes(pretraga.toLowerCase()) ||
      krava.identifikacioniBroj.toLowerCase().includes(pretraga.toLowerCase()) ||
      krava.pasmina.toLowerCase().includes(pretraga.toLowerCase());
    
    const odgovaraStatusu = filterStatus === 'sve' || krava.status === filterStatus;
    
    return odgovaraPretrazi && odgovaraStatusu;
  });

  const handleObrisi = (id: string) => {
    if (window.confirm('Da li ste sigurni da želite obrisati ovu kravu?')) {
      obrišiKravu(id);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Zaglavlje */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Krave</h1>
          <p className="text-gray-600 mt-1">Upravljanje stadom i evidencija krava</p>
        </div>
        <button
          onClick={() => navigate('/krave/nova')}
          className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Dodaj kravu
        </button>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Ukupno</p>
          <p className="text-2xl font-bold text-gray-900">{krave.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Zdrave</p>
          <p className="text-2xl font-bold text-green-600">
            {krave.filter(k => k.status === 'zdrava').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Na liječenju</p>
          <p className="text-2xl font-bold text-red-600">
            {krave.filter(k => k.status === 'lijecenje').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600">Praćenje</p>
          <p className="text-2xl font-bold text-yellow-600">
            {krave.filter(k => k.status === 'praćenje').length}
          </p>
        </div>
      </div>

      {/* Filteri i pretraga */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pretražite po imenu, ID-u ili pasmini..."
              value={pretraga}
              onChange={(e) => setPretraga(e.target.value)}
              className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="sve">Svi statusi</option>
              <option value="zdrava">Zdrave</option>
              <option value="lijecenje">Na liječenju</option>
              <option value="praćenje">Praćenje</option>
            </select>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5" />
              Više filtera
            </button>
          </div>
        </div>
      </div>

      {/* Tabela krava */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID / Ime
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pasmina
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Starost
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proizvodnja (L)
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Zadnji pregled
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Akcije
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtiraneKrave.map((krava) => (
                <tr key={krava.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{krava.ime}</p>
                      <p className="text-sm text-gray-500">{krava.identifikacioniBroj}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{krava.pasmina}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{krava.starost} god.</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border
                      ${krava.status === 'zdrava'
                        ? 'bg-transparent border-green-400 text-green-200'
                        : krava.status === 'lijecenje'
                          ? 'bg-transparent border-red-400 text-red-200'
                          : 'bg-transparent border-amber-400 text-amber-200'}`}
                    >
                      {krava.status.charAt(0).toUpperCase() + krava.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {krava.zadnjaProdukcija !== undefined ? formatNumber(krava.zadnjaProdukcija, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) : 'N/A'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Prosjek: {formatNumber(krava.prosjecnaProdukcija, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {krava.zadnjiPregled 
                      ? formatDate(krava.zadnjiPregled)
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/krave/${krava.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Vidi detalje"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/krave/${krava.id}/uredi`)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Uredi"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleObrisi(krava.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Obriši"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtiraneKrave.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nema krava koje odgovaraju kriterijima pretrage.</p>
          </div>
        )}
      </div>
    </div>
  );
}
