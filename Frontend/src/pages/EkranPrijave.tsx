import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Milk, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function EkranPrijave() {
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [zapamti, setZapamti] = useState(false);
  const { prijava } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await prijava(email, lozinka);
      navigate('/kontrolna-tabla');
    } catch (error) {
      console.error('Greška prilikom prijave:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-green-50 relative overflow-hidden">
      {/* Pozadinska ilustracija */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-green-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
      </div>

      {/* Kartica za prijavu */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {/* Logo i naslov */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-4">
              <Milk className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pametna Farma Krava</h1>
            <p className="text-sm text-gray-600">AI sistem za upravljanje farmom</p>
          </div>

          {/* Forma za prijavu */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email adresa
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="menadzer@farma.ba"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Lozinka
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={lozinka}
                  onChange={(e) => setLozinka(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={zapamti}
                  onChange={(e) => setZapamti(e.target.checked)}
                  className="w-4 h-4 mr-2 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                Zapamti me
              </label>
              <a href="#" className="text-sm text-green-600 hover:text-green-700 transition-colors">
                Zaboravili ste lozinku?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              Prijavi se
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Pametno održavanje farme uz pomoć AI tehnologije</p>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>© 2025 SmartCowFarm. Sva prava zadržana.</p>
        </div>
      </div>
    </div>
  );
}
