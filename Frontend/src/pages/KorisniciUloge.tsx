import { useEffect, useMemo, useState } from 'react';
import { UserPlus, ShieldCheck, Mail, CheckCircle2, XCircle, Search, Check, Minus, User, AlertCircle, PauseCircle, FileText, X } from 'lucide-react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import { RadnoMjesto, StatusNaloga } from '@/types';
import { NapomenaModal } from '@/components/NapomenaModal';


function formatirajRadnoMjesto(radnoMjesto: number | string | undefined): string {
  if (radnoMjesto === undefined || radnoMjesto === null) return 'Nepoznato';

  // Ako je broj
  if (typeof radnoMjesto === 'number') {
    switch (radnoMjesto) {
      case RadnoMjesto.Admin: return 'Administrator';
      case RadnoMjesto.Veterinar: return 'Veterinar';
      case RadnoMjesto.Farmer: return 'Farmer';
      default: return 'Farmer';
    }
  }

  // Ako je string
  if (typeof radnoMjesto === 'string') {
    // Pokušaj prvo kao broj
    const broj = parseInt(radnoMjesto, 10);
    if (!isNaN(broj)) {
      return formatirajRadnoMjesto(broj);
    }

    // vrati string sa velikim početnim slovom
    return radnoMjesto.charAt(0).toUpperCase() + radnoMjesto.slice(1).toLowerCase();
  }

  return 'Nepoznato';
}

function formatirajStatusNaloga(status: number | string | undefined): { text: string; variant: 'aktivan' | 'neaktivan' | 'suspendovan' } {
  if (status === undefined || status === null) {
    return { text: 'Nepoznato', variant: 'neaktivan' };
  }

  // Ako je broj
  if (typeof status === 'number') {
    switch (status) {
      case StatusNaloga.Aktivan: return { text: 'Aktivan', variant: 'aktivan' };
      case StatusNaloga.Neaktivan: return { text: 'Neaktivan', variant: 'neaktivan' };
      case StatusNaloga.Suspendovan: return { text: 'Suspendovan', variant: 'suspendovan' };
      default: return { text: 'Nepoznato', variant: 'neaktivan' };
    }
  }

  if (typeof status === 'string') {
    const broj = parseInt(status, 10);
    if (!isNaN(broj)) {
      return formatirajStatusNaloga(broj);
    }

    const statusLower = status.toLowerCase();
    if (statusLower.includes('aktivan')) return { text: 'Aktivan', variant: 'aktivan' };
    if (statusLower.includes('neaktivan')) return { text: 'Neaktivan', variant: 'neaktivan' };
    if (statusLower.includes('suspend')) return { text: 'Suspendovan', variant: 'suspendovan' };
  }

  return { text: 'Nepoznato', variant: 'neaktivan' };
}

// Helper funkcija za boje statusa
function getStatusBoje(variant: string): string {
  switch (variant) {
    case 'aktivan':
      return 'bg-green-50 text-green-700 dark:bg-green-400/10 dark:text-green-200';
    case 'neaktivan':
      return 'bg-gray-50 text-gray-700 dark:bg-gray-400/10 dark:text-gray-200';
    case 'suspendovan':
      return 'bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-200';
    default:
      return 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200';
  }
}

function getStatusIcon(variant: string) {
  switch (variant) {
    case 'aktivan':
      return CheckCircle2;
    case 'neaktivan':
      return PauseCircle;
    case 'suspendovan':
      return AlertCircle;
    default:
      return XCircle;
  }
}

const permissions: Record<string, string[]> = {
  administrator: ['Svi podaci', 'Upravljanje korisnicima', 'Postavke sistema', 'Brisanje zapisa', 'Audit trag'],
  veterinar: ['Zdravstveni zapisi', 'Dodavanje tretmana', 'Pregled upozorenja', 'Reprodukcija', 'Lijekovi'],
  radnik: ['Pregled zadataka', 'Ažuriranje statusa', 'Unos proizvodnje', 'Pregled krava', 'Dnevne aktivnosti'],
};

export function KorisniciUloge() {
  const navigate = useNavigate();
  const [showMatrix, setShowMatrix] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showNapomenaModal, setShowNapomenaModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.korisnici.list();
        if (cancelled) return;

        setUsers(res);
      } catch (e) {
        return null;
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const term = searchTerm.toLowerCase();
    return users.filter(user => {
      const imePrezime = `${user.ime || ''} ${user.prezime || ''}`.toLowerCase();
      const email = (user.email || '').toLowerCase();
      const korisnickoIme = (user.korisnickoIme || '').toLowerCase();
      const radnoMjesto = formatirajRadnoMjesto(user.radnoMjesto).toLowerCase();
      const status = formatirajStatusNaloga(user.statusNaloga).text.toLowerCase();
      const napomene = (user.napomene || '').toLowerCase();

      return imePrezime.includes(term) ||
        email.includes(term) ||
        korisnickoIme.includes(term) ||
        radnoMjesto.includes(term) ||
        status.includes(term) ||
        napomene.includes(term);
    });
  }, [users, searchTerm]);


  const matrix = useMemo(() => {
    const allPerms = Array.from(new Set(Object.values(permissions).flat()));
    return { allPerms };
  }, []);

  const statistika = useMemo(() => {
    const aktivni = users.filter(u => {
      const status = formatirajStatusNaloga(u.statusNaloga);
      return status.variant === 'aktivan';
    }).length;

    const neaktivni = users.filter(u => {
      const status = formatirajStatusNaloga(u.statusNaloga);
      return status.variant === 'neaktivan';
    }).length;

    const suspendovani = users.filter(u => {
      const status = formatirajStatusNaloga(u.statusNaloga);
      return status.variant === 'suspendovan';
    }).length;

    return { aktivni, neaktivni, suspendovani };
  }, [users]);

  const handleShowNapomene = (userId: number) => {
    setSelectedUserId(userId);
    setShowNapomenaModal(true);
  };

  const handleCloseNapomenaModal = () => {
    setShowNapomenaModal(false);
    setSelectedUserId(null);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600 dark:text-slate-300">Učitavanje korisnika...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Modal za napomene */}
      <NapomenaModal
        isOpen={showNapomenaModal}
        onClose={handleCloseNapomenaModal}
        userId={selectedUserId!}
      />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">Korisnici i uloge</h1>
          <p className="text-gray-600 dark:text-slate-300 mt-1">Pregled svih korisnika sistema i njihovih prava</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:bg-slate-800/50"
          >
            <ShieldCheck className="w-4 h-4" />
            {showMatrix ? 'Sakrij matricu' : 'Prikaži matricu'}
          </button>
          <button
            onClick={() => navigate('/korisnici-uloge/novi')}
            className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-green-600 to-blue-600 px-5 py-2.5 text-white shadow-md hover:from-green-700 hover:to-blue-700"
          >
            <UserPlus className="w-4 h-4" />
            Novi korisnik
          </button>
        </div>
      </div>

      {/* Statistika */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Aktivni korisnici</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{statistika.aktivni}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-900/30">
              <PauseCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Neaktivni korisnici</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{statistika.neaktivni}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900/30">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Suspendovani</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{statistika.suspendovani}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela korisnika */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
        <div className="p-6 space-y-3">
          {/* Pretraga */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white pl-11 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-green-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100 dark:placeholder:text-slate-500"
              placeholder="Pretraži korisnike, email, ulogu, status ili napomene..."
              aria-label="Pretraži korisnike"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600 dark:bg-slate-950/40 dark:text-slate-300">
              <tr>
                <th className="px-6 py-3 font-medium">Korisnik</th>
                <th className="px-6 py-3 font-medium">Korisničko ime</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Radno mjesto</th>
                <th className="px-6 py-3 font-medium">Status naloga</th>
                <th className="px-6 py-3 font-medium">Datum zaposlenja</th>
                <th className="px-6 py-3 font-medium text-right">Akcije</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-slate-400">
                    Nema pronađenih korisnika
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const status = formatirajStatusNaloga(user.statusNaloga);
                  const StatusIcon = getStatusIcon(status.variant);

                  return (
                    <tr key={user.idKorisnika || user.email} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900/30">
                            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-slate-100">
                              {user.ime || ''} {user.prezime || ''}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                              ID: {user.idKorisnika || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-slate-200">
                        {user.korisnickoIme || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-slate-200">
                          <Mail className="w-4 h-4 text-gray-400 dark:text-slate-400" />
                          {user.email || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 dark:bg-purple-400/10 dark:text-purple-200">
                          {formatirajRadnoMjesto(user.radnoMjesto)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${getStatusBoje(status.variant)}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-slate-200">
                        {user.datumZaposlenja ? new Date(user.datumZaposlenja).toLocaleDateString('bs-BA') : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => navigate(`/korisnici-uloge/${user.idKorisnika}/uredi`)}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/50"
                            title="Uredi korisnika"
                          >
                            Uredi
                          </button>
                          <button
                            onClick={() => handleShowNapomene(user.idKorisnika)}
                            className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/50"
                            title="Prikaži napomene"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Napomene
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Broj korisnika */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Ukupno <span className="font-medium text-gray-900 dark:text-slate-100">{filteredUsers.length}</span> korisnika
            {searchTerm && filteredUsers.length !== users.length && (
              <> (od ukupno <span className="font-medium text-gray-900 dark:text-slate-100">{users.length}</span>)</>
            )}
          </p>
        </div>
      </div>

      {/* Role Matrix */}
      {showMatrix && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Matrica dozvola</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">Pregled dozvola po ulogama u sistemu</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 dark:bg-slate-950/40 dark:text-slate-300">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Dozvola</th>
                  <th className="px-6 py-3 text-center font-medium">Administrator</th>
                  <th className="px-6 py-3 text-center font-medium">Veterinar</th>
                  <th className="px-6 py-3 text-center font-medium">Radnik</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                {matrix.allPerms.map((perm) => (
                  <tr key={perm} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                    <td className="px-6 py-3 text-gray-900 dark:text-slate-100">{perm}</td>
                    {['administrator', 'veterinar', 'radnik'].map((role) => (
                      <td key={role} className="px-6 py-3 text-center">
                        {permissions[role]?.includes(perm) ? (
                          <Check className="w-5 h-5 inline text-green-600 dark:text-green-400" />
                        ) : (
                          <Minus className="w-5 h-5 inline text-gray-300 dark:text-slate-600" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default KorisniciUloge;