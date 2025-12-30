import { useState } from 'react';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { Page } from '../App';

interface CowFormProps {
  cowId: string | null;
  onNavigate: (page: Page) => void;
}

export function CowForm({ cowId, onNavigate }: CowFormProps) {
  const isEdit = cowId !== null;
  const [formData, setFormData] = useState({
    id: cowId || '',
    name: isEdit ? 'Bella' : '',
    breed: isEdit ? 'Holstein' : '',
    birthDate: isEdit ? '2022-03-15' : '',
    status: isEdit ? 'milking' : '',
    barnZone: isEdit ? 'A2' : '',
    sireId: isEdit ? 'H-12345' : '',
    damId: isEdit ? 'C-789' : '',
    originFarm: isEdit ? 'Green Valley Dairy' : '',
    acquisitionDate: isEdit ? '2022-03-15' : '',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onNavigate('cows');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('cows')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-gray-900 mb-1">{isEdit ? 'Edit Cow' : 'Add New Cow'}</h2>
            <p className="text-gray-600">{isEdit ? `Update information for ${formData.id}` : 'Enter cow details'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="id" className="block text-gray-700 mb-2">
                  ID Number *
                </label>
                <input
                  id="id"
                  name="id"
                  type="text"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="e.g., C001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  disabled={isEdit}
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Bella"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="breed" className="block text-gray-700 mb-2">
                  Breed *
                </label>
                <select
                  id="breed"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select breed</option>
                  <option value="Holstein">Holstein</option>
                  <option value="Jersey">Jersey</option>
                  <option value="Brown Swiss">Brown Swiss</option>
                  <option value="Ayrshire">Ayrshire</option>
                  <option value="Guernsey">Guernsey</option>
                </select>
              </div>

              <div>
                <label htmlFor="birthDate" className="block text-gray-700 mb-2">
                  Birth Date *
                </label>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-gray-700 mb-2">
                  Current Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select status</option>
                  <option value="milking">Milking</option>
                  <option value="dry">Dry</option>
                  <option value="pregnant">Pregnant</option>
                  <option value="sick">Sick</option>
                </select>
              </div>

              <div>
                <label htmlFor="barnZone" className="block text-gray-700 mb-2">
                  Barn Zone *
                </label>
                <select
                  id="barnZone"
                  name="barnZone"
                  value={formData.barnZone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select zone</option>
                  <option value="A1">Zone A1</option>
                  <option value="A2">Zone A2</option>
                  <option value="B1">Zone B1</option>
                  <option value="B2">Zone B2</option>
                  <option value="C1">Zone C1</option>
                  <option value="C2">Zone C2</option>
                </select>
              </div>
            </div>
          </div>

          {/* Origin & Genetics */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-gray-900 mb-4">Origin & Genetics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sireId" className="block text-gray-700 mb-2">
                  Sire ID
                </label>
                <input
                  id="sireId"
                  name="sireId"
                  type="text"
                  value={formData.sireId}
                  onChange={handleChange}
                  placeholder="e.g., H-12345"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="damId" className="block text-gray-700 mb-2">
                  Dam ID
                </label>
                <input
                  id="damId"
                  name="damId"
                  type="text"
                  value={formData.damId}
                  onChange={handleChange}
                  placeholder="e.g., C-789"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="originFarm" className="block text-gray-700 mb-2">
                  Origin Farm
                </label>
                <input
                  id="originFarm"
                  name="originFarm"
                  type="text"
                  value={formData.originFarm}
                  onChange={handleChange}
                  placeholder="e.g., Green Valley Dairy"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="acquisitionDate" className="block text-gray-700 mb-2">
                  Acquisition Date
                </label>
                <input
                  id="acquisitionDate"
                  name="acquisitionDate"
                  type="date"
                  value={formData.acquisitionDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-gray-900 mb-4">Photo</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-700 mb-1">Click to upload or drag and drop</p>
              <p className="text-gray-500">PNG, JPG up to 10MB</p>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-gray-900 mb-4">Additional Notes</h3>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter any additional information..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('cows')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-500 transition-all shadow-md"
            >
              <Save className="w-4 h-4" />
              {isEdit ? 'Save Changes' : 'Add Cow'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
