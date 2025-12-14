import { useMemo, useState } from 'react';
import { UserPlus, ShieldCheck, Mail, CheckCircle2, XCircle, Search, Check, Minus } from 'lucide-react';

const users = [
  { ime: 'Amar Kovač', email: 'amar@farm.ba', uloga: 'administrator', status: 'aktivan', kreiran: '12.03.2024' },
  { ime: 'Sara Milić', email: 'sara@farm.ba', uloga: 'veterinar', status: 'aktivan', kreiran: '08.05.2024' },
  { ime: 'Iva Petrović', email: 'iva@farm.ba', uloga: 'menadžer', status: 'aktivan', kreiran: '20.06.2024' },
  { ime: 'Faruk Hadžić', email: 'faruk@farm.ba', uloga: 'radnik', status: 'pauziran', kreiran: '11.09.2024' },
];

const permissions: Record<string, string[]> = {
  administrator: ['Svi podaci', 'Upravljanje korisnicima', 'Postavke sistema', 'Brisanje zapisa'],
  menadžer: ['Pregled podataka', 'Upravljanje zadacima', 'Generisanje izvještaja'],
  veterinar: ['Zdravstveni zapisi', 'Dodavanje tretmana', 'Pregled upozorenja'],
  radnik: ['Pregled zadataka', 'Ažuriranje statusa', 'Osnovni unos'],
};

export function KorisniciUloge() {
  const [showMatrix, setShowMatrix] = useState(false);

  const displayRole = (role: string) => role.charAt(0).toUpperCase() + role.slice(1);

  const matrix = useMemo(() => {
    const allPerms = Array.from(new Set(Object.values(permissions).flat()));
    return { allPerms };
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Korisnici i uloge</h1>
          <p className="text-gray-600 mt-1">Dodjela prava, statusi i audit trag</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowMatrix(!showMatrix)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            <ShieldCheck className="w-4 h-4" /> Role matrix
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white shadow-md hover:bg-green-500">
            <UserPlus className="w-4 h-4" /> Novi korisnik
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm mb-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-700">
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 font-medium text-green-700">
              <CheckCircle2 className="w-4 h-4" /> 3 aktivna
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700">
              <XCircle className="w-4 h-4" /> 1 pauziran
            </span>
          </div>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              className="w-full rounded-lg border border-gray-300 pl-11 pr-3 py-2 text-sm placeholder:text-gray-500 placeholder:font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Pretraži korisnike, uloge ili email..."
              aria-label="Pretraži korisnike, uloge ili email"
            />
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">Ime</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Uloga</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Kreiran</th>
                <th className="px-4 py-3 font-medium text-right">Akcije</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.email} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-900">{u.ime}</td>
                  <td className="px-4 py-3 text-gray-700 inline-flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {u.email}</td>
                  <td className="px-4 py-3 text-gray-900">{displayRole(u.uloga)}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${u.status === 'aktivan' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{u.kreiran}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button className="rounded-lg border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-50">Uredi</button>
                      <button className="rounded-lg border border-gray-300 px-3 py-1 text-gray-700 hover:bg-gray-50">Privilegije</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showMatrix && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Role matrix</h3>
            <p className="text-sm text-gray-500">Pregled dozvola po ulozi</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Dozvola</th>
                  {Object.keys(permissions).map((role) => (
                    <th key={role} className="px-4 py-3 text-center font-medium">{displayRole(role)}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {matrix.allPerms.map((perm) => (
                  <tr key={perm} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{perm}</td>
                    {Object.entries(permissions).map(([role, perms]) => (
                      <td key={role} className="px-4 py-3 text-center">
                        {perms.includes(perm) ? <Check className="w-4 h-4 inline text-green-600" /> : <Minus className="w-4 h-4 inline text-gray-300" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Uloge i dozvole</h3>
          <p className="text-sm text-gray-500">Sažetak po ulozi</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Object.entries(permissions).map(([role, perms]) => (
            <div key={role} className="rounded-lg border border-gray-200 p-4 bg-gray-50/70">
              <p className="font-semibold text-gray-900">{displayRole(role)}</p>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                {perms.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
