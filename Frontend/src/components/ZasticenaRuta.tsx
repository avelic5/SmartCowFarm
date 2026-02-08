import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ZasticenaRutaProps {
    children: React.ReactNode;
    zahtijevaneUloge?: string[];
}

export function ZasticenaRuta({ children, zahtijevaneUloge }: ZasticenaRutaProps) {
    const { jeAutentifikovan, korisnik, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!jeAutentifikovan) {
        // Sačuvaj trenutnu lokaciju za redirect nakon prijave
        return <Navigate to="/prijava" state={{ from: location }} replace />;
    }

    // Provjera uloga ako su specificirane
    if (zahtijevaneUloge && korisnik) {
        const imaPristup = zahtijevaneUloge.some(uloga =>
            korisnik.Uloga === uloga ||
            korisnik.RadnoMjesto === uloga
        );

        if (!imaPristup) {
            return <Navigate to="/zabranjeno" replace />;
        }
    }

    return <>{children}</>;
}