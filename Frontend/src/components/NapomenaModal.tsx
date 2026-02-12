// components/SimpleNapomenaModal.tsx
import { useEffect, useState } from 'react';
import { api } from '../api';
import { X, FileText, User } from 'lucide-react';

interface NapomenaModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number;
}

export function NapomenaModal({ isOpen, onClose, userId }: NapomenaModalProps) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && userId) {
            setLoading(true);
            api.korisnici.detalji(userId)
                .then(setUser)
                .finally(() => setLoading(false));
        }
    }, [isOpen, userId]);


    useEffect(() => {
        if (isOpen) {
            // trenutna scroll pozicija
            const scrollY = window.scrollY;
            // zaključaj scroll
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflowY = 'scroll';
        } else {
            // vrati scroll
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflowY = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        }

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflowY = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-9999 h-full"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md relative border border-gray-200 dark:border-slate-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-linear-to-r from-green-600 to-blue-600 px-6 py-4 rounded-t-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-white/20 rounded-lg">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white">
                                Napomene
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-green-600 dark:border-slate-600 dark:border-t-green-400"></div>
                            <span className="mt-3 text-sm text-gray-600 dark:text-slate-400">Učitavanje podataka...</span>
                        </div>
                    ) : (
                        <>
                            {/* Info kartica za korisnika */}
                            <div className="flex items-start gap-4 mb-6 p-4 bg-linear-to-br from-gray-50 to-gray-100/50 dark:from-slate-700/50 dark:to-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                                <div className="p-2.5 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-200 dark:border-slate-600">
                                    <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-slate-100">
                                        {user?.ime || ''} {user?.prezime || ''}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                                        {user?.korisnickoIme && (
                                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                                                @{user.korisnickoIme}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sekcija za napomene */}
                            <div className="mb-4">
                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1 dark:text-slate-400">
                                    <span className="w-1 h-4 bg-green-500 rounded-full"></span>
                                    Napomene
                                </p>
                                <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-200 dark:border-slate-700 min-h-25">
                                    <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                        {user?.napomene ? (
                                            <p className='font-extrabold'>{user.napomene}</p>
                                        ) : (
                                            <span className="text-gray-400 dark:text-slate-500 italic flex items-center gap-2">
                                                <FileText className="w-4 h-4" />
                                                Nema napomena za ovog korisnika.
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>

                        </>
                    )}
                </div>


            </div>
        </div>
    );
}