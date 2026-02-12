import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type LanguageOption = 'bs-BA' | 'en-US';
type CurrencyOption = 'BAM' | 'EUR';
type DateFormatOption = 'DD.MM.YYYY' | 'YYYY-MM-DD';
type ThemeOption = 'light' | 'dark' | 'auto';

interface SettingsContextType {
  language: LanguageOption;
  currency: CurrencyOption;
  dateFormat: DateFormatOption;
  theme: ThemeOption;
  isDarkMode: boolean;
  setLanguage: (value: LanguageOption) => void;
  setCurrency: (value: CurrencyOption) => void;
  setDateFormat: (value: DateFormatOption) => void;
  setTheme: (value: ThemeOption) => void;
  formatDate: (value: string | number | Date | null | undefined) => string;
  formatDateTime: (value: string | number | Date | null | undefined) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number) => string;
}

const defaultSettings: Pick<SettingsContextType, 'language' | 'currency' | 'dateFormat' | 'theme'> = {
  language: 'bs-BA',
  currency: 'BAM',
  dateFormat: 'DD.MM.YYYY',
  theme: 'light',
};

const storageKey = 'smart-cow-settings';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

function safeParseStoredSettings(): Partial<typeof defaultSettings> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed ?? {};
  } catch (err) {
    return {};
  }
}

function toDate(value: string | number | Date | null | undefined): Date | null {
  if (!value && value !== 0) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'number') return new Date(value);
  if (typeof value === 'string') {
    const dotMatch = value.match(/^(\d{1,2})[./](\d{1,2})[./](\d{2,4})$/);
    if (dotMatch) {
      const [, day, month, year] = dotMatch;
      const fullYear = year.length === 2 ? `20${year}` : year;
      return new Date(Number(fullYear), Number(month) - 1, Number(day));
    }
    const isoDate = new Date(value);
    if (!Number.isNaN(isoDate.getTime())) return isoDate;
  }
  return null;
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const stored = safeParseStoredSettings();
  const [language, setLanguage] = useState<LanguageOption>(stored.language ?? defaultSettings.language);
  const [currency, setCurrency] = useState<CurrencyOption>(stored.currency ?? defaultSettings.currency);
  const [dateFormat, setDateFormat] = useState<DateFormatOption>(stored.dateFormat ?? defaultSettings.dateFormat);
  const [theme, setTheme] = useState<ThemeOption>(stored.theme ?? defaultSettings.theme);
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event: MediaQueryListEvent) => setSystemPrefersDark(event.matches);
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  const resolvedTheme: ThemeOption = useMemo(() => {
    if (theme === 'auto') {
      return systemPrefersDark ? 'dark' : 'light';
    }
    return theme;
  }, [theme, systemPrefersDark]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    root.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ language, currency, dateFormat, theme })
    );
  }, [language, currency, dateFormat, theme]);

  const formatDate = useCallback(
    (value: string | number | Date | null | undefined) => {
      const parsed = toDate(value);
      if (!parsed) return '';

      if (dateFormat === 'YYYY-MM-DD') {
        const y = parsed.getFullYear();
        const m = String(parsed.getMonth() + 1).padStart(2, '0');
        const d = String(parsed.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      }

      return new Intl.DateTimeFormat(language, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(parsed);
    },
    [dateFormat, language]
  );

  const formatDateTime = useCallback(
    (value: string | number | Date | null | undefined) => {
      const parsed = toDate(value);
      if (!parsed) return '';
      const datePart = formatDate(parsed);
      const timePart = new Intl.DateTimeFormat(language, {
        hour: '2-digit',
        minute: '2-digit',
      }).format(parsed);
      return `${datePart} ${timePart}`.trim();
    },
    [formatDate, language]
  );

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) => {
      if (typeof value !== 'number' || Number.isNaN(value)) return '';
      return new Intl.NumberFormat(language, options).format(value);
    },
    [language]
  );

  const formatCurrency = useCallback(
    (value: number) => {
      if (typeof value !== 'number' || Number.isNaN(value)) return '';
      return new Intl.NumberFormat(language, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    },
    [currency, language]
  );

  const value = useMemo<SettingsContextType>(
    () => ({
      language,
      currency,
      dateFormat,
      theme,
      isDarkMode: resolvedTheme === 'dark',
      setLanguage,
      setCurrency,
      setDateFormat,
      setTheme,
      formatDate,
      formatDateTime,
      formatNumber,
      formatCurrency,
    }),
    [language, currency, dateFormat, theme, resolvedTheme, formatDate, formatDateTime, formatNumber, formatCurrency]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
}
