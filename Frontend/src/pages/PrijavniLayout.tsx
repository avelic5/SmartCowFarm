import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NavigacijskaSideBar } from '../components/NavigacijskaSideBar';
import { Zaglavlje } from '../components/Zaglavlje';

export function PrijavniLayout() {
  const { prijavljenKorisnik } = useAuth();

  if (!prijavljenKorisnik) {
    return <Navigate to="/prijava" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1400px]">
        <NavigacijskaSideBar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Zaglavlje />
          <main className="flex-1 overflow-y-auto bg-gray-50 px-4 pb-8 md:px-8 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
