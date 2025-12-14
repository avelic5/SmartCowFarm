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

export function NavigacijskaSideBar() {
  const location = useLocation();
  const { odjava } = useAuth();

  return (
	<aside className="sticky top-0 z-30 flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
            <Milk className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Pametna Farma</h2>
            <p className="text-xs text-gray-500">AI Sistem</p>
          </div>
        </div>
      </div>

      {/* Navigacija */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {navigacijskeStavke.map((stavka) => {
            const jeAktivna = location.pathname === stavka.putanja;
            const Ikona = stavka.ikona;
            
            return (
              <li key={stavka.putanja}>
                <Link
                  to={stavka.putanja}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
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
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-1">
          <Link
            to="/postavke"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
          >
            <Settings className="w-5 h-5 text-gray-500" />
            <span className="text-sm">Postavke</span>
          </Link>
          
          <button
            onClick={odjava}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Odjavi se</span>
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          © 2025 SmartCowFarm
        </p>
      </div>
    </aside>
  );
}
