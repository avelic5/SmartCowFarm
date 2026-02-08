import { useState } from 'react';
import { Milk, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '@/api';


export function EkranPrijave() {
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [zapamti, setZapamti] = useState(false);
  const [greska, setGreska] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { prijava } = useAuth();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setGreska(null);
    setIsSubmitting(true);



    // EkranPrijave.tsx - MODIFIKUJ catch blok
    try {
      await prijava(email, lozinka);
    } catch (error: any) {


      const message = error?.message ||
        error?.response?.data?.poruka ||
        'Greška prilikom prijave. Provjeri konekciju sa serverom.';

      setGreska(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Pozadinska ilustracija */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-12 left-16 w-64 h-64 bg-green-500 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-14 w-80 h-80 bg-blue-600 rounded-full blur-3xl" />
      </div>

      {/* Kartica za prijavu */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="rounded-2xl shadow-2xl p-8 border bg-white border-gray-200 text-gray-900 dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-100">
          {/* Logo i naslov */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-green-500 to-blue-600 rounded-2xl mb-4">
              <Milk className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-slate-100">Pametna Farma Krava</h1>
            <p className="text-sm text-gray-600 dark:text-slate-300">AI sistem za upravljanje farmom</p>
          </div>

          {/* Greška */}
          {greska && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700 dark:bg-red-950/30 dark:border-red-500/40 dark:text-red-200">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
              <span>{greska}</span>
            </div>
          )}

          {/* Forma za prijavu */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-900 dark:text-slate-100">
                Email adresa ili korisničko ime
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-400" />
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="menadzer@farma.ba ili korisnickoIme"
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100 dark:placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-900 dark:text-slate-100">
                Lozinka
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={lozinka}
                  onChange={(e) => setLozinka(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100 dark:placeholder:text-slate-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm cursor-pointer text-gray-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={zapamti}
                  onChange={(e) => setZapamti(e.target.checked)}
                  disabled={isSubmitting}
                  className="w-4 h-4 mr-2 rounded border border-gray-300 bg-white accent-green-600 focus:ring-green-500 dark:border-slate-700 dark:bg-slate-950/40 dark:accent-green-500"
                />
                Zapamti me
              </label>
              <button
                type="button"
                onClick={() => setGreska('Ova funkcija je u izradi...')}
                className="text-sm transition-colors text-emerald-700 hover:text-emerald-800 dark:text-green-400 dark:hover:text-green-300"
              >
                Zaboravili ste lozinku?
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-linear-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg transition-all shadow-md font-medium flex items-center justify-center ${isSubmitting
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:from-green-700 hover:to-blue-700 hover:shadow-lg'
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Prijavljujem...
                </>
              ) : (
                'Prijavi se'
              )}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-slate-300">
            <p>Pametno održavanje farme uz pomoć AI tehnologije</p>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-gray-600 dark:text-slate-300">
          <p>© 2025 SmartCowFarm. Sva prava zadržana.</p>
        </div>
      </div>
    </div>
  );
}