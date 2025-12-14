import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export function Zaglavlje() {
  const { korisnik } = useAuth();
  const { upozorenja } = useData();
  
  const nepročitanaUpozorenja = upozorenja.filter(u => !u.pročitano).length;

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-40 shadow-sm">
      <div className="flex items-center justify-between px-8 py-4">
        {/* Pretraga */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Pretražite krave, izvještaje, zadatke..."
              className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Korisničke akcije */}
        <div className="flex items-center gap-4">
          {/* Notifikacije */}
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <Bell className="w-6 h-6 text-gray-600" />
            {nepročitanaUpozorenja > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold leading-none text-white shadow-sm ring-2 ring-white">
                {nepročitanaUpozorenja}
              </span>
            )}
          </button>

          {/* Korisnički profil */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{korisnik?.ime || 'Korisnik'}</p>
              <p className="text-xs text-gray-500 capitalize">{korisnik?.uloga || 'Administrator'}</p>
            </div>
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
