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
    <div className="min-h-screen bg-gray-50 flex">
      <NavigacijskaSideBar />
      <div className="flex-1 flex flex-col ml-64">
        <Zaglavlje />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
