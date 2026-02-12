import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Mail, Phone, User, Briefcase, Building, Calendar, Lock, Eye, EyeOff, AlertCircle, PauseCircle, CheckCircle2, PlayCircle, StopCircle, Ban } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';
import { RadnoMjesto, StatusNaloga, Odjel } from '../types';
import { AzurirajKorisnikaDto } from '@/api/dto';

export function UrediKorisnika() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [korisnikStatus, setKorisnikStatus] = useState<StatusNaloga>(StatusNaloga.Aktivan);

    const [formData, setFormData] = useState<AzurirajKorisnikaDto>({
        ime: '',
        prezime: '',
        email: '',
        telefon: '',
        radnoMjesto: RadnoMjesto.Farmer,
        odjel: Odjel.Proizvodnja,
        datumZaposlenja: '',
        napomene: ''
    });

    const [passwordData, setPasswordData] = useState({
        staraLozinka: '',
        novaLozinka: '',
        potvrdaLozinke: ''
    });

    useEffect(() => {
        const ucitajKorisnika = async () => {
            if (!id) return;

            try {
                setInitialLoading(true);
                const korisnik = await api.korisnici.detalji(parseInt(id));

                setFormData({
                    ime: korisnik.ime || '',
                    prezime: korisnik.prezime || '',
                    email: korisnik.email || '',
                    telefon: korisnik.telefon || '',
                    radnoMjesto: korisnik.radnoMjesto ?? RadnoMjesto.Farmer,
                    odjel: korisnik.odjel ?? Odjel.Proizvodnja,
                    datumZaposlenja: korisnik.datumZaposlenja || new Date().toLocaleDateString('en-CA'),
                    napomene: korisnik.napomene || ''
                });

                setKorisnikStatus(korisnik.statusNaloga ?? StatusNaloga.Aktivan);

            } catch (err: any) {
                setError('Neuspješno učitavanje podataka o korisniku');

                if (err.status === 404) {
                    setTimeout(() => navigate('/korisnici-uloge'), 2000);
                }
            } finally {
                setInitialLoading(false);
            }
        };

        ucitajKorisnika();
    }, [id, navigate]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        setFormData(prev => {
            if (name === 'radnoMjesto') {
                const numValue = parseInt(value, 10);
                return {
                    ...prev,
                    [name]: numValue as RadnoMjesto
                };
            }

            if (name === 'odjel') {
                const numValue = parseInt(value, 10);
                return {
                    ...prev,
                    [name]: numValue as Odjel
                };
            }
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.ime?.trim()) {
            setError('Ime je obavezno');
            return false;
        }
        if (!formData.prezime?.trim()) {
            setError('Prezime je obavezno');
            return false;
        }
        if (!formData.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setError('Unesite ispravan email');
            return false;
        }
        if (!formData.telefon?.trim()) {
            setError('Telefon je obavezan');
            return false;
        }
        return true;
    };

    const validatePassword = (): boolean => {
        if (!passwordData.novaLozinka || passwordData.novaLozinka.length < 6) {
            setError('Nova lozinka mora imati najmanje 6 karaktera');
            return false;
        }
        if (passwordData.novaLozinka !== passwordData.potvrdaLozinke) {
            setError('Nova lozinka i potvrda se ne podudaraju');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!validateForm()) return;
        if (!id) return;

        setLoading(true);

        try {
            const payload = {
                ime: formData.ime,
                prezime: formData.prezime,
                email: formData.email,
                telefon: formData.telefon,
                radnoMjesto: formData.radnoMjesto,
                odjel: formData.odjel,
                datumZaposlenja: formData.datumZaposlenja,
                napomene: formData.napomene || ""
            };

            await api.korisnici.azuriraj(parseInt(id), payload);

            setSuccess(true);
            setTimeout(() => {
                navigate('/korisnici-uloge');
            }, 1500);
        } catch (err: any) {

            let errorMsg = 'Došlo je do greške pri ažuriranju korisnika';

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

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validatePassword()) return;
        if (!id) return;

        setLoading(true);

        try {
            await api.korisnici.promjeniLozinku(parseInt(id), {
                novaLozinka: passwordData.novaLozinka
            });

            setShowChangePassword(false);
            setPasswordData({ staraLozinka: '', novaLozinka: '', potvrdaLozinke: '' });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {

            let errorMsg = 'Došlo je do greške pri promjeni lozinke';
            if (err.bodyText) {
                try {
                    const errorObj = JSON.parse(err.bodyText);
                    errorMsg = errorObj.poruka || errorObj.title || errorMsg;
                } catch {
                    errorMsg = err.bodyText || errorMsg;
                }
            }

            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleAktivirajNalog = async () => {
        if (!id) return;

        if (window.confirm('Da li ste sigurni da želite aktivirati ovaj nalog?')) {
            try {
                setLoading(true);
                await api.korisnici.aktiviraj(parseInt(id));
                setKorisnikStatus(StatusNaloga.Aktivan);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } catch (err) {
                setError('Greška pri aktivaciji naloga');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeaktivirajNalog = async () => {
        if (!id) return;

        if (window.confirm('Da li ste sigurni da želite deaktivirati ovaj nalog?')) {
            try {
                setLoading(true);
                await api.korisnici.deaktiviraj(parseInt(id));
                setKorisnikStatus(StatusNaloga.Neaktivan);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } catch (err) {
                setError('Greška pri deaktivaciji naloga');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSuspendujNalog = async () => {
        if (!id) return;

        if (window.confirm('Da li ste sigurni da želite suspendovati ovaj nalog?')) {
            try {
                setLoading(true);
                await api.korisnici.suspenduj(parseInt(id));
                setKorisnikStatus(StatusNaloga.Suspendovan);
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } catch (err) {
                setError('Greška pri suspendovanju naloga');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleObrisiKorisnika = async () => {
        if (!id) return;

        if (window.confirm('Da li ste sigurni da želite obrisati ovog korisnika? Ova akcija je nepovratna!')) {
            try {
                setLoading(true);
                await api.korisnici.obrisi(parseInt(id));
                navigate('/korisnici-uloge');
            } catch (err) {
                setError('Greška pri brisanju korisnika');
            } finally {
                setLoading(false);
            }
        }
    };

    // Helper funkcija za prikaz statusa
    const getStatusInfo = (status: StatusNaloga) => {
        switch (status) {
            case 'Aktivan':
                return { text: 'Aktivan', color: 'bg-green-50 text-green-700 dark:bg-green-400/10 dark:text-green-200', icon: CheckCircle2 };
            case 'Neaktivan':
                return { text: 'Neaktivan', color: 'bg-gray-50 text-gray-700 dark:bg-gray-400/10 dark:text-gray-200', icon: StopCircle };
            case 'Suspendovan':
                return { text: 'Suspendovan', color: 'bg-red-50 text-red-700 dark:bg-red-400/10 dark:text-red-200', icon: Ban };
            default:
                return { text: 'Nepoznato', color: 'bg-gray-50 text-gray-700 dark:bg-gray-400/10 dark:text-gray-200', icon: AlertCircle };
        }
    };

    if (initialLoading) {
        return (
            <div className="p-4 md:p-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-center min-h-100">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <span className="ml-3 text-gray-600 dark:text-slate-300">Učitavanje podataka o korisniku...</span>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(korisnikStatus);

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
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 flex items-center gap-3">
                            <User className="w-8 h-8" />
                            Uredi korisnika
                        </h1>
                        <p className="text-gray-600 dark:text-slate-300 mt-1">
                            Ažurirajte podatke korisnika #{id}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${statusInfo.color}`}>
                            <statusInfo.icon className="w-4 h-4" />
                            {statusInfo.text}
                        </span>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
                    Podaci uspješno sačuvani!
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
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                                    Email *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-400" />
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100"
                                        placeholder="npr. ahusic@smartcowfarm.ba"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="telefon" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                                    Telefon *
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-400" />
                                    <input
                                        type="tel"
                                        id="telefon"
                                        name="telefon"
                                        value={formData.telefon}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100"
                                        placeholder="npr. +387 61 123 456"
                                    />
                                </div>
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
                                    <option value={RadnoMjesto.Farmer}>Farmer</option>
                                    <option value={RadnoMjesto.Veterinar}>Veterinar</option>
                                    <option value={RadnoMjesto.Admin}>Admin</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="odjel" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
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
                                    <option value={Odjel.Proizvodnja}>Proizvodnja</option>
                                    <option value={Odjel.Njega}>Njega</option>
                                    <option value={Odjel.Uprava}>Uprava</option>
                                </select>
                            </div>

                            <div className="md:col-span-1">
                                <label htmlFor="datumZaposlenja" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                                    Datum zaposlenja *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-400" />
                                    <input
                                        type="date"
                                        id="datumZaposlenja"
                                        name="datumZaposlenja"
                                        value={formData.datumZaposlenja}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100"
                                    />
                                </div>
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

                    {/* Sekcija za promjenu lozinke */}
                    <div className="border-t border-gray-200 dark:border-slate-700 pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                Sigurnost
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowChangePassword(!showChangePassword)}
                                className="text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                            >
                                {showChangePassword ? 'Otkaži promjenu lozinke' : 'Promijeni lozinku'}
                            </button>
                        </div>

                        {showChangePassword && (
                            <div className="bg-gray-50 dark:bg-slate-950/40 p-4 rounded-lg">
                                <h4 className="font-medium text-gray-900 dark:text-slate-100 mb-4">Promjena lozinke</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="novaLozinka" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                                            Nova lozinka *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="novaLozinka"
                                                name="novaLozinka"
                                                value={passwordData.novaLozinka}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100 pr-10"
                                                placeholder="Najmanje 6 karaktera"
                                                minLength={6}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-slate-400"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="potvrdaLozinke" className="block text-sm font-medium text-gray-700 dark:text-slate-200 mb-2">
                                            Potvrdi novu lozinku *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="potvrdaLozinke"
                                                name="potvrdaLozinke"
                                                value={passwordData.potvrdaLozinke}
                                                onChange={handlePasswordChange}
                                                className="w-full px-4 py-2 border border-gray-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-100 pr-10"
                                                placeholder="Ponovite novu lozinku"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={handleChangePassword}
                                            disabled={loading}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? 'Promjena...' : 'Promijeni lozinku'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowChangePassword(false)}
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/50"
                                        >
                                            Otkaži
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
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
                                Spremanje...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Sačuvaj izmjene
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Status naloga - Opasna zona */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    Status naloga
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-4">
                    Trenutni status: <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.color}`}>
                        <statusInfo.icon className="w-3 h-3" />
                        {statusInfo.text}
                    </span>
                </p>
                <div className="flex flex-wrap gap-3">
                    {/* Aktiviraj nalog - prikazano samo ako nije aktivan */}
                    {korisnikStatus !== StatusNaloga.Aktivan && (
                        <button
                            type="button"
                            onClick={handleAktivirajNalog}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PlayCircle className="w-4 h-4" />
                            Aktiviraj nalog
                        </button>
                    )}

                    {/* Deaktiviraj nalog - prikazano samo ako je aktivan */}
                    {korisnikStatus === StatusNaloga.Aktivan && (
                        <button
                            type="button"
                            onClick={handleDeaktivirajNalog}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <StopCircle className="w-4 h-4" />
                            Deaktiviraj nalog
                        </button>
                    )}

                    {/* Suspenduj nalog - prikazano samo ako je aktivan */}
                    {korisnikStatus === StatusNaloga.Aktivan && (
                        <button
                            type="button"
                            onClick={handleSuspendujNalog}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Ban className="w-4 h-4" />
                            Suspenduj nalog
                        </button>
                    )}

                    {/* Obriši korisnika - uvijek prikazano */}
                    <button
                        type="button"
                        onClick={handleObrisiKorisnika}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Obriši korisnika
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UrediKorisnika;