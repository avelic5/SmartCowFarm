import { Bell, Menu, Search, User, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface ZaglavljeProps {
  isMobileNavOpen?: boolean;
  onToggleMobileNav?: () => void;
}

export function Zaglavlje({ isMobileNavOpen = false, onToggleMobileNav }: ZaglavljeProps) {
  const { korisnik } = useAuth();
  const { upozorenja } = useData();
  
  const nepročitanaUpozorenja = upozorenja.filter(u => !u.pročitano).length;

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-40 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 px-4 py-3 md:h-16 md:flex-row md:items-center md:gap-4 md:px-8 md:py-0">
        <div className="flex items-center gap-4 md:flex-1 md:min-w-0">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors dark:hover:bg-slate-800 md:hidden"
            aria-label={isMobileNavOpen ? 'Zatvori navigaciju' : 'Otvori navigaciju'}
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-nav"
            onClick={onToggleMobileNav}
          >
            {isMobileNavOpen ? (
              <X className="h-6 w-6 text-gray-700 dark:text-slate-200" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700 dark:text-slate-200" />
            )}
          </button>

          {/* Pretraga */}
          <div className="min-w-0 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Pretražite krave, izvještaje, zadatke..."
                className="w-full pl-11 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Desno: notifikacije + account */}
        <div className="flex items-center justify-between gap-4 md:ml-auto md:justify-end">
          <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 transition-colors dark:hover:bg-slate-800">
            <Bell className="w-6 h-6 text-gray-600 dark:text-slate-200" />
            {nepročitanaUpozorenja > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold leading-none text-white shadow-sm ring-2 ring-white">
                {nepročitanaUpozorenja}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 border-l border-gray-200 pl-4 dark:border-slate-800">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-slate-100">{korisnik?.ime || 'Korisnik'}</p>
              <p className="text-xs text-red-600 capitalize dark:text-red-300">{korisnik?.uloga || 'Administrator'}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

