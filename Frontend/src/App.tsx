import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Stranice
import { EkranPrijave } from './pages/EkranPrijave';
import { PrijavniLayout } from './pages/PrijavniLayout';
import { KontrolnaTabla } from './pages/KontrolnaTabla';
import { ListaKrava } from './pages/ListaKrava';
import { DetaljiKrave } from './pages/DetaljiKrave';
import { FormaKrave } from './pages/FormaKrave';
import { ProizvodnaMlijeka } from './pages/ProizvodnaMlijeka';
import { ZdravljeReprodukcija } from './pages/ZdravljeReprodukcija';
import { SenzoriOkolina } from './pages/SenzoriOkolina';
import { Zadaci } from './pages/Zadaci';
import { Upozorenja } from './pages/Upozorenja';
import { Izvjestaji } from './pages/Izvjestaji';
import { KorisniciUloge } from './pages/KorisniciUloge';
import { Postavke } from './pages/Postavke';

// Legacy navigation type used by some older components in src/components/.
export type Page =
  | 'dashboard'
  | 'cows'
  | 'cow-detail'
  | 'cow-form'
  | 'milk-production'
  | 'health-reproduction'
  | 'sensors-environment'
  | 'tasks'
  | 'alerts'
  | 'reports'
  | 'report-detail'
  | 'report-print'
  | 'users-roles'
  | 'settings';

export default function App() {
  const { korisnik, isLoading } = useAuth();

  // Prikaži loading dok se ne učita korisnik
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600">Učitavanje...</span>
      </div>
    );
  }
  return (
    <Routes>
      {/* Javne rute */}
      <Route path="/prijava" element={
        korisnik ? <Navigate to="/kontrolna-tabla" replace /> : <EkranPrijave />
      } />

      {/* Zaštićene rute */}
      <Route path="/" element={<PrijavniLayout />}>
        <Route index element={<Navigate to="/kontrolna-tabla" replace />} />
        <Route path="kontrolna-tabla" element={<KontrolnaTabla />} />
        <Route path="krave" element={<ListaKrava />} />
        <Route path="krave/nova" element={<FormaKrave />} />
        <Route path="krave/:id" element={<DetaljiKrave />} />
        <Route path="krave/:id/uredi" element={<FormaKrave />} />
        <Route path="proizvodnja-mlijeka" element={<ProizvodnaMlijeka />} />
        <Route path="zdravlje-reprodukcija" element={<ZdravljeReprodukcija />} />
        <Route path="senzori-okolina" element={<SenzoriOkolina />} />
        <Route path="zadaci" element={<Zadaci />} />
        <Route path="upozorenja" element={<Upozorenja />} />
        <Route path="izvjestaji" element={<Izvjestaji />} />
        <Route path="korisnici-uloge" element={<KorisniciUloge />} />
        <Route path="postavke" element={<Postavke />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
