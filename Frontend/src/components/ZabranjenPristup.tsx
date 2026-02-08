import { AlertCircle } from 'lucide-react';

export function ZabranjenPristup() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Zabranjen pristup</h1>
                <p className="text-gray-600 mb-6">
                    Nemate odgovarajuća prava za pristup ovoj stranici.
                </p>
                <a
                    href="/kontrolna-tabla"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    Nazad na kontrolnu tablu
                </a>
            </div>
        </div>
    );
}