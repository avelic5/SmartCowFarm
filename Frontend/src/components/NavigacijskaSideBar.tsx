import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Milk, 
  Activity, 
  Droplet,
  Stethoscope,
  Thermometer,
  CheckSquare,
  AlertTriangle,
  FileText,
  Users,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navigacijskeStavke = [
  { 
    ikona: LayoutDashboard, 
    tekst: 'Kontrolna tabla', 
    putanja: '/kontrolna-tabla' 
  },
  { 
    ikona: Milk, 
    tekst: 'Krave', 
    putanja: '/krave' 
  },
  { 
    ikona: Droplet, 
    tekst: 'Proizvodnja mlijeka', 
    putanja: '/proizvodnja-mlijeka' 
  },
  { 
    ikona: Stethoscope, 
    tekst: 'Zdravlje i reprodukcija', 
    putanja: '/zdravlje-reprodukcija' 
  },
  { 
    ikona: Thermometer, 
    tekst: 'Senzori i okolina', 
    putanja: '/senzori-okolina' 
  },
  { 
    ikona: CheckSquare, 
    tekst: 'Zadaci', 
    putanja: '/zadaci' 
  },
  { 
    ikona: AlertTriangle, 
    tekst: 'Upozorenja', 
    putanja: '/upozorenja' 
  },
  { 
    ikona: FileText, 
    tekst: 'Izvještaji', 
    putanja: '/izvjestaji' 
  },
  { 
    ikona: Users, 
    tekst: 'Korisnici i uloge', 
    putanja: '/korisnici-uloge' 
  },
];

interface NavigacijskaSideBarProps {
  mobileOpen?: boolean;
  onRequestCloseMobile?: () => void;
}

export function NavigacijskaSideBar({
  mobileOpen = false,
  onRequestCloseMobile,
}: NavigacijskaSideBarProps) {
  const location = useLocation();
  const { odjava } = useAuth();

  const mobileVisibilityClass = mobileOpen ? 'flex' : 'hidden';

  return (
	<aside
		id="mobile-nav"
    className={`static order-2 z-30 ${mobileVisibilityClass} w-full shrink-0 flex-col border-b border-gray-200 bg-white shadow-sm md:order-none md:flex md:sticky md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r`}
	>
      {/* Logo */}
      <div className="border-b border-gray-200 p-4 md:flex md:h-16 md:items-center md:px-6 md:py-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Milk className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Pametna Farma</h2>
            <p className="text-xs text-gray-500">AI Sistem</p>
          </div>
        </div>
      </div>

      {/* Navigacija */}
    <nav className="flex-1 overflow-y-auto p-3 md:p-4">
    <ul className="space-y-1">
          {navigacijskeStavke.map((stavka) => {
            const jeAktivna = location.pathname === stavka.putanja;
            const Ikona = stavka.ikona;
            
            return (
              <li key={stavka.putanja}>
                <Link
                  to={stavka.putanja}
              onClick={onRequestCloseMobile}
                  className={`
                flex items-center gap-3 rounded-lg px-4 py-3 transition-all
                    ${jeAktivna 
                      ? 'bg-green-50 text-green-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Ikona className={`w-5 h-5 ${jeAktivna ? 'text-green-600' : 'text-gray-500'}`} />
              <span className="text-sm">{stavka.tekst}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Postavke i odjava */}
		<div className="mt-6 space-y-1 border-t border-gray-200 pt-6">
          <Link
            to="/postavke"
			onClick={onRequestCloseMobile}
			className="flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-all hover:bg-gray-50"
          >
            <Settings className="w-5 h-5 text-gray-500" />
            <span className="text-sm">Postavke</span>
          </Link>

          <button
            onClick={() => {
            odjava();
            onRequestCloseMobile?.();
            }}
			className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-gray-700 transition-all hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Odjavi se</span>
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="hidden border-t border-gray-200 p-4 md:block">
        <p className="text-xs text-gray-500 text-center">
          © 2025 SmartCowFarm
        </p>
      </div>
    </aside>
  );
}

