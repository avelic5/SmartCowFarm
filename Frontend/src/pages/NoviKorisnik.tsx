import { useState } from 'react';
import { UserPlus, Save, ArrowLeft, Mail, Phone, User, Briefcase, Building, Calendar, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { RadnoMjesto, StatusNaloga, Odjel } from '../types';
import { NoviKorisnikDto } from '@/api/dto';

export function NoviKorisnik() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<NoviKorisnikDto>({
    ime: '',
    prezime: '',
    email: '',
    korisnickoIme: '',
    lozinka: '',
    telefon: '',
    radnoMjesto: RadnoMjesto.Farmer, 
    odjel: Odjel.Proizvodnja,
    statusNaloga: StatusNaloga.Aktivan,
    datumZaposlenja: new Date().toLocaleDateString('en-CA'),
    napomene: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, lozinka: password }));
  };

  const validateForm = (): boolean => {
    if (!formData.ime.trim()) {
      setError('Ime je obavezno');
      return false;
    }
    if (!formData.prezime.trim()) {
      setError('Prezime je obavezno');
      return false;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Unesite ispravan email');
      return false;
    }
    if (!formData.korisnickoIme.trim()) {
      setError('Korisničko ime je obavezno');
      return false;
    }
    if (!formData.lozinka || formData.lozinka.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera');
      return false;
    }
    if (!formData.telefon.trim()) {
      setError('Telefon je obavezan');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const testPayload = {
        ime: formData.ime,
        prezime: formData.prezime,
        email: formData.email,
        korisnickoIme: formData.korisnickoIme,
        lozinka: formData.lozinka,
        telefon: formData.telefon,
        radnoMjesto: formData.radnoMjesto, 
        odjel: formData.odjel,
        statusNaloga: formData.statusNaloga, 
        datumZaposlenja: formData.datumZaposlenja,
        napomene: formData.napomene || ""
      };
      
      const response = await api.korisnici.kreiraj(testPayload);
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/korisnici-uloge');
      }, 1500);
    } catch (err: any) {

      let errorMsg = 'Došlo je do greške pri kreiranju korisnika';

      if (err.bodyText) {
        try {
          const errorObj = JSON.parse(err.bodyText);
          if (errorObj.errors) {
            const validationErrors = Object.entries(errorObj.errors)
              .flatMap(([field, errors]: [string, any]) =>
                Array.isArray(errors)
                  ? errors.map((msg: string) => `${field}: ${msg}`)
                  : [`${field}: ${errors}`]
              );
            if (validationErrors.length > 0) {
              errorMsg = `Validacijske greške:\n${validationErrors.join('\n')}`;
            }
          } else if (errorObj.poruka) {
            errorMsg = errorObj.poruka;
          } else if (errorObj.title) {
            errorMsg = errorObj.title;
          }
        } catch {
          if (err.bodyText.length < 200) {
            errorMsg = err.bodyText;
          }
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/korisnici-uloge')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-slate-300 dark:hover:text-slate-100 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Nazad na listu korisnika
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-3">
          <UserPlus className="w-8 h-8" />
          Dodaj novog korisnika
        </h1>
        <p className="text-gray-600 dark:text-slate-300 mt-1">
          Unesite detalje novog korisnika za SmartCowFarm sistem
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
          Korisnik uspješno kreiran! Preusmjeravam na listu korisnika...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm dark:bg-slate-900/50 dark:border-slate-700">
        <div className="p-6 space-y-8">
          {/* Lične informacije */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Lične informacije
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ime" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                  Ime *
                </label>
                <input
                  type="text"
                  id="ime"
                  name="ime"
                  value={formData.ime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100"
                  placeholder="npr. Ahmed"
                />
              </div>

              <div>
                <label htmlFor="prezime" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                  Prezime *
                </label>
                <input
                  type="text"
                  id="prezime"
                  name="prezime"
                  value={formData.prezime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100"
                  placeholder="npr. Husić"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2 items-center gap-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100"
                  placeholder="npr. ahusic@smartcowfarm.ba"
                />
              </div>

              <div>
                <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2 items-center gap-2">
                  Telefon *
                </label>
                <input
                  type="tel"
                  id="telefon"
                  name="telefon"
                  value={formData.telefon}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100"
                  placeholder="npr. +387 61 123 456"
                />
              </div>
            </div>
          </div>

          {/* Pristupni podaci */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Pristupni podaci
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="korisnickoIme" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                  Korisničko ime *
                </label>
                <input
                  type="text"
                  id="korisnickoIme"
                  name="korisnickoIme"
                  value={formData.korisnickoIme}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100"
                  placeholder="npr. ahusic"
                />
              </div>

              <div>
                <label htmlFor="lozinka" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                  Lozinka *
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="ml-2 text-sm cursor-pointer hover:text-green-700 dark:text-green-400"
                  >
                    (generiši sigurnu)
                  </button>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="lozinka"
                    name="lozinka"
                    value={formData.lozinka}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100 pr-10"
                    placeholder="Najmanje 6 karaktera"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                  Preporučeno: kombinacija slova, brojeva i specijalnih karaktera
                </p>
              </div>
            </div>
          </div>

          {/* Poslovne informacije */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Poslovne informacije
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="radnoMjesto" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                  Radno mjesto *
                </label>
                <select
                  id="radnoMjesto"
                  name="radnoMjesto"
                  value={formData.radnoMjesto}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100"
                >
                  <option value="Farmer">Farmer</option>
                  <option value="Veterinar">Veterinar</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label htmlFor="odjel" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2 items-center gap-2">
                  Odjel *
                </label>
                <select
                  id="odjel"
                  name="odjel"
                  value={formData.odjel}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100"
                >
                  {Object.values(Odjel).map((odjel) => (
                    <option key={odjel} value={odjel}>
                      {odjel === Odjel.Proizvodnja ? 'Proizvodnja' :
                        odjel === Odjel.Njega ? 'Njega' :
                          Odjel.Uprava}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="statusNaloga" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                  Status naloga *
                </label>
                <select
                  id="statusNaloga"
                  name="statusNaloga"
                  value={formData.statusNaloga}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100"
                >
                  <option value="Aktivan">Aktivan</option>
                  <option value="Neaktivan">Neaktivan</option>
                  <option value="Suspendovan">Suspendovan</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="datumZaposlenja" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2 items-center gap-2">
                  Datum zaposlenja *
                </label>
                <input
                  type="date"
                  id="datumZaposlenja"
                  name="datumZaposlenja"
                  value={formData.datumZaposlenja}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Napomene */}
          <div>
            <label htmlFor="napomene" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
              Napomene
            </label>
            <textarea
              id="napomene"
              name="napomene"
              value={formData.napomene}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100"
              placeholder="Dodatne informacije o korisniku..."
            />
          </div>
        </div>

        {/* Akcije */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3 dark:bg-slate-950/40 dark:border-slate-700">
          <button
            type="button"
            onClick={() => navigate('/korisnici-uloge')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/50"
            disabled={loading}
          >
            Otkaži
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-linear-to-r from-green-600 to-blue-600 text-white rounded-lg transition-all shadow-md hover:from-green-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Kreiranje...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Kreiraj korisnika
              </>
            )}
          </button>
        </div>
      </form>

      {/* Informacioni panel */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Napomene:</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Korisnik će dobiti email sa pristupnim podacima (u produkciji)</li>
          <li>• Administratori imaju pun pristup svim funkcionalnostima sistema</li>
          <li>• Veterinari mogu pristupiti zdravstvenim zapisima</li>
          <li>• Status "Neaktivan" privremeno onemogućava pristup</li>
        </ul>
      </div>
    </div>
  );
}

export default NoviKorisnik;