import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Krava } from '../types';

export function FormaKrave() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { krave, dodajKravu, ažurirajKravu } = useData();
  
  const postojećaKrava = id ? krave.find(k => k.id === id) : null;
  const jeIzmjena = !!postojećaKrava;

  const [formData, setFormData] = useState<Partial<Krava>>({
    identifikacioniBroj: postojećaKrava?.identifikacioniBroj || '',
    ime: postojećaKrava?.ime || '',
    pasmina: postojećaKrava?.pasmina || '',
    datumRodjenja: postojećaKrava?.datumRodjenja || '',
    tezina: postojećaKrava?.tezina || 0,
    status: postojećaKrava?.status || 'zdrava',
    prosjecnaProdukcija: postojećaKrava?.prosjecnaProdukcija || 0,
    napomene: postojećaKrava?.napomene || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'tezina' || name === 'prosjecnaProdukcija' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (jeIzmjena && id) {
      ažurirajKravu(id, formData);
    } else {
      const starost = formData.datumRodjenja 
        ? Math.floor((new Date().getTime() - new Date(formData.datumRodjenja).getTime()) / (1000 * 60 * 60 * 24 * 365))
        : 0;
      
      dodajKravu({
        ...formData as Omit<Krava, 'id'>,
        starost
      });
    }
    
    navigate('/krave');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/krave')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Nazad na listu
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {jeIzmjena ? 'Uredi kravu' : 'Dodaj novu kravu'}
        </h1>
        <p className="text-gray-600 mt-1">
          {jeIzmjena ? 'Ažurirajte informacije o kravi' : 'Unesite detalje nove krave u stado'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 space-y-6">
          {/* Osnove informacije */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Osnovne informacije</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="identifikacioniBroj" className="block text-sm font-medium text-gray-700 mb-2">
                  Identifikacioni broj *
                </label>
                <input
                  type="text"
                  id="identifikacioniBroj"
                  name="identifikacioniBroj"
                  value={formData.identifikacioniBroj}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="npr. BOS-001"
                />
              </div>

              <div>
                <label htmlFor="ime" className="block text-sm font-medium text-gray-700 mb-2">
                  Ime *
                </label>
                <input
                  type="text"
                  id="ime"
                  name="ime"
                  value={formData.ime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="npr. Slavica"
                />
              </div>

              <div>
                <label htmlFor="pasmina" className="block text-sm font-medium text-gray-700 mb-2">
                  Pasmina *
                </label>
                <select
                  id="pasmina"
                  name="pasmina"
                  value={formData.pasmina}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Odaberite pasminu</option>
                  <option value="Holštajn">Holštajn</option>
                  <option value="Simentalac">Simentalac</option>
                  <option value="Džerzej">Džerzej</option>
                  <option value="Bušo">Bušo</option>
                  <option value="Ostalo">Ostalo</option>
                </select>
              </div>

              <div>
                <label htmlFor="datumRodjenja" className="block text-sm font-medium text-gray-700 mb-2">
                  Datum rođenja *
                </label>
                <input
                  type="date"
                  id="datumRodjenja"
                  name="datumRodjenja"
                  value={formData.datumRodjenja}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="tezina" className="block text-sm font-medium text-gray-700 mb-2">
                  Težina (kg) *
                </label>
                <input
                  type="number"
                  id="tezina"
                  name="tezina"
                  value={formData.tezina}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="npr. 650"
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="zdrava">Zdrava</option>
                  <option value="lijecenje">Na liječenju</option>
                  <option value="praćenje">Praćenje</option>
                </select>
              </div>
            </div>
          </div>

          {/* Informacije o proizvodnji */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informacije o proizvodnji</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prosjecnaProdukcija" className="block text-sm font-medium text-gray-700 mb-2">
                  Prosječna proizvodnja (L/dan)
                </label>
                <input
                  type="number"
                  id="prosjecnaProdukcija"
                  name="prosjecnaProdukcija"
                  value={formData.prosjecnaProdukcija}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="npr. 32.5"
                />
              </div>
            </div>
          </div>

          {/* Napomene */}
          <div>
            <label htmlFor="napomene" className="block text-sm font-medium text-gray-700 mb-2">
              Napomene
            </label>
            <textarea
              id="napomene"
              name="napomene"
              value={formData.napomene}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Dodatne informacije..."
            />
          </div>
        </div>

        {/* Akcije */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/krave')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Otkaži
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-500 transition-colors"
          >
            <Save className="w-5 h-5" />
            {jeIzmjena ? 'Sačuvaj izmjene' : 'Dodaj kravu'}
          </button>
        </div>
      </form>
    </div>
  );
}
