import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavigacijskaSideBar } from '../components/NavigacijskaSideBar';
import { Zaglavlje } from '../components/Zaglavlje';

export function PrijavniLayout() {
  const { prijavljenKorisnik } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  if (!prijavljenKorisnik) {
    return <Navigate to="/prijava" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen w-full flex-col md:flex-row">
        <NavigacijskaSideBar
          mobileOpen={isMobileNavOpen}
          onRequestCloseMobile={() => setIsMobileNavOpen(false)}
        />
        <div className="order-1 flex flex-1 flex-col overflow-hidden md:order-none">
          <Zaglavlje
            isMobileNavOpen={isMobileNavOpen}
            onToggleMobileNav={() => setIsMobileNavOpen((open) => !open)}
          />
          <main className="flex-1 overflow-y-auto bg-gray-50 px-4 pb-8 md:px-8 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
