import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Milk, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';

export function EkranPrijave() {
  const [email, setEmail] = useState('');
  const [lozinka, setLozinka] = useState('');
  const [zapamti, setZapamti] = useState(false);
  const { prijava } = useAuth();
  const navigate = useNavigate();
  const { isDarkMode } = useSettings();

  const cardBg = isDarkMode ? '#0f1727' : '#ffffff';
  const cardBorder = isDarkMode ? '#1c2436' : '#e5e7eb';
  const cardText = isDarkMode ? '#e7eefc' : '#0f1727';
  const mutedText = isDarkMode ? '#9ad8a8' : '#4b5563';
  const labelText = isDarkMode ? '#d7f5e3' : '#0f1727';
  const inputBg = isDarkMode ? '#0b1220' : '#ffffff';
  const inputBorder = isDarkMode ? '#243147' : '#d1d5db';
  const accent = isDarkMode ? '#22c55e' : '#16a34a';

  const bgStyle = isDarkMode
    ? 'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.10) 0%, rgba(15,23,42,0.75) 45%, #0b1322 100%)'
    : 'radial-gradient(circle at 25% 20%, rgba(59,130,246,0.12) 0%, rgba(34,197,94,0.10) 35%, #f7f9fb 100%)';

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
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: bgStyle }}
    >
      {/* Pozadinska ilustracija */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-12 left-16 w-64 h-64 bg-[#22c55e] rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-14 w-80 h-80 bg-[#2563eb] rounded-full blur-3xl" />
      </div>

      {/* Kartica za prijavu */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div
          className="rounded-2xl shadow-2xl p-8 border"
          style={{ backgroundColor: cardBg, borderColor: cardBorder, color: cardText }}
        >
          {/* Logo i naslov */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-2xl mb-4">
              <Milk className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: labelText }}>Pametna Farma Krava</h1>
            <p className="text-sm" style={{ color: mutedText }}>AI sistem za upravljanje farmom</p>
          </div>

          {/* Forma za prijavu */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: labelText }}>
                Email adresa
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: mutedText }} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="menadzer@farma.ba"
                  className={`w-full pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    isDarkMode ? 'placeholder-[#5f718f]' : 'placeholder-[#9ca3af]'
                  }`}
                  style={{
                    border: `1px solid ${inputBorder}`,
                    backgroundColor: inputBg,
                    color: cardText,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = inputBorder)}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: labelText }}>
                Lozinka
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: mutedText }} />
                <input
                  id="password"
                  type="password"
                  value={lozinka}
                  onChange={(e) => setLozinka(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all ${
                    isDarkMode ? 'placeholder-[#5f718f]' : 'placeholder-[#9ca3af]'
                  }`}
                  style={{
                    border: `1px solid ${inputBorder}`,
                    backgroundColor: inputBg,
                    color: cardText,
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = inputBorder)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm cursor-pointer" style={{ color: mutedText }}>
                <input
                  type="checkbox"
                  checked={zapamti}
                  onChange={(e) => setZapamti(e.target.checked)}
                  className="w-4 h-4 mr-2 rounded focus:ring-green-500"
                  style={{
                    border: `1px solid ${inputBorder}`,
                    backgroundColor: inputBg,
                    color: accent,
                  }}
                />
                Zapamti me
              </label>
              <a
                href="#"
                className="text-sm transition-colors"
                style={{ color: isDarkMode ? '#22c55e' : '#0f766e' }}
              >
                Zaboravili ste lozinku?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-500 transition-all shadow-md hover:shadow-lg font-medium"
            >
              Prijavi se
            </button>
          </form>

          <div className="mt-6 text-center text-sm" style={{ color: mutedText }}>
            <p>Pametno održavanje farme uz pomoć AI tehnologije</p>
          </div>
        </div>

        <div className="text-center mt-6 text-sm" style={{ color: mutedText }}>
          <p>© 2025 SmartCowFarm. Sva prava zadržana.</p>
        </div>
      </div>
    </div>
  );
}
