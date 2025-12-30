import { Bell, ShieldCheck, Palette, Globe2, MonitorSmartphone, Moon, Sun } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export function Postavke() {
  const {
    language,
    currency,
    dateFormat,
    theme,
    setLanguage,
    setCurrency,
    setDateFormat,
    setTheme,
    isDarkMode,
  } = useSettings();

  const themeButtonClasses = (value: typeof theme) => {
    const isActive = theme === value;
    const base = 'flex-1 rounded-lg border px-4 py-3 text-center transition focus:outline-none focus:ring-2 focus:ring-green-500';

    if (isDarkMode) {
      return `${base} ${
        isActive
          ? 'border-[#22c55e] bg-[#d8ffe9] text-[#065f46] font-semibold shadow-sm'
          : 'border-[#243147] bg-[#0f1727] text-[#e7eefc] hover:border-[#22c55e]/60 hover:text-[#bbf7d0]'
      }`;
    }

    return `${base} ${
      isActive
        ? 'border-green-500 bg-green-100 text-green-900 font-semibold shadow-sm'
        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
    }`;
  };

  const cardClasses = isDarkMode
    ? 'rounded-xl border border-[#1c2436] bg-[#0f1727] p-6 shadow-sm space-y-4 text-[#e7eefc]'
    : 'rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4 text-gray-900';

  const labelClasses = isDarkMode
    ? 'flex items-center justify-between rounded-lg border border-[#1c2436] bg-[#0f1727] p-3 text-sm text-[#9ad8a8]'
    : 'flex items-center justify-between rounded-lg border border-gray-200 p-3 text-sm text-gray-700';

  const mutedText = isDarkMode ? 'text-[#9ad8a8]' : 'text-gray-600';

  const selectClasses = (hasFullWidth?: boolean) =>
    `${hasFullWidth ? 'w-full' : ''} rounded-lg border px-3 py-2 text-sm ${
      isDarkMode
        ? 'border-[#243147] bg-[#0f1727] text-[#e7eefc] focus:border-[#22c55e] focus:ring-[#22c55e]/40'
        : 'border-gray-300 bg-white text-gray-900 focus:border-green-500 focus:ring-green-500/40'
    }`;

  return (
    <div className={`p-6 md:p-8 space-y-8 ${isDarkMode ? 'bg-[#0b1322] text-[#e7eefc]' : ''}`}>
      <div>
        <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-[#d7f5e3]' : 'text-gray-900'}`}>Postavke</h1>
        <p className={`${mutedText} mt-1`}>Sistemske preferencije, obavijesti i sigurnost</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={cardClasses}>
          <div className="flex items-center gap-3">
            <Bell className={`w-5 h-5 ${isDarkMode ? 'text-[#6ee7b7]' : 'text-green-600'}`} />
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-[#d7f5e3]' : 'text-gray-900'}`}>Obavijesti</h3>
              <p className={`text-sm ${mutedText}`}>Kontroliši način i kanale obavještavanja</p>
            </div>
          </div>
          <label className={labelClasses}>
            Email notifikacije
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </label>
          <label className={labelClasses}>
            SMS za kritična upozorenja
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </label>
          <label className={labelClasses}>
            Push (mobilni)
            <input type="checkbox" className="h-4 w-4" />
          </label>
        </div>

        <div className={cardClasses}>
          <div className="flex items-center gap-3">
            <Palette className={`w-5 h-5 ${isDarkMode ? 'text-[#67e8f9]' : 'text-blue-600'}`} />
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-[#d7f5e3]' : 'text-gray-900'}`}>Tema i izgled</h3>
              <p className={`text-sm ${mutedText}`}>Biraj između svijetle i tamne teme</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              className={themeButtonClasses('light')}
              onClick={() => setTheme('light')}
              aria-pressed={theme === 'light'}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Sun className="w-4 h-4" /> Svijetla
              </span>
            </button>
            <button
              className={themeButtonClasses('dark')}
              onClick={() => setTheme('dark')}
              aria-pressed={theme === 'dark'}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Moon className="w-4 h-4" /> Tamna
              </span>
            </button>
            <button
              className={themeButtonClasses('auto')}
              onClick={() => setTheme('auto')}
              aria-pressed={theme === 'auto'}
            >
              <span className="inline-flex items-center justify-center gap-2">
                <MonitorSmartphone className="w-4 h-4" /> Auto
              </span>
            </button>
          </div>
          <div className={`text-sm ${mutedText}`}>
            Trenutna tema: {theme === 'auto' ? `Auto (${isDarkMode ? 'tamna' : 'svijetla'} po sistemu)` : theme === 'dark' ? 'Tamna' : 'Svijetla'}
          </div>
        </div>

        <div className={cardClasses}>
          <div className="flex items-center gap-3">
            <ShieldCheck className={`w-5 h-5 ${isDarkMode ? 'text-[#a78bfa]' : 'text-purple-600'}`} />
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-[#d7f5e3]' : 'text-gray-900'}`}>Sigurnost</h3>
              <p className={`text-sm ${mutedText}`}>2FA, sesije i revizija</p>
            </div>
          </div>
          <label className={labelClasses}>
            Obavezna 2FA za administratore
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </label>
          <label className={labelClasses}>
            Automatsko odjavljivanje (30 min)
            <input type="checkbox" defaultChecked className="h-4 w-4" />
          </label>
          <label className={labelClasses}>
            Lock export podataka
            <input type="checkbox" className="h-4 w-4" />
          </label>
        </div>

        <div className={cardClasses}>
          <div className="flex items-center gap-3">
            <Globe2 className={`w-5 h-5 ${isDarkMode ? 'text-[#facc15]' : 'text-amber-600'}`} />
            <div>
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-[#d7f5e3]' : 'text-gray-900'}`}>Lokalizacija</h3>
              <p className={`text-sm ${mutedText}`}>Jezik, valuta i format datuma</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Jezik</span>
              <select
                className={selectClasses()}
                value={language}
                onChange={(e) => setLanguage(e.target.value as typeof language)}
              >
                <option value="bs-BA">Bosanski (BA)</option>
                <option value="en-US">Engleski (EN)</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span>Valuta</span>
              <select
                className={selectClasses()}
                value={currency}
                onChange={(e) => setCurrency(e.target.value as typeof currency)}
              >
                <option value="BAM">BAM</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span>Format datuma</span>
              <select
                className={selectClasses()}
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value as typeof dateFormat)}
              >
                <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
