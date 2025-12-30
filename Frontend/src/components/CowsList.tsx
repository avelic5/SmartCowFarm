import { useState } from 'react';
import { Search, Filter, Plus, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Page } from '../App';

interface CowsListProps {
  onNavigate: (page: Page, data?: any) => void;
}

interface Cow {
  id: string;
  name: string;
  breed: string;
  status: 'milking' | 'dry' | 'pregnant' | 'sick';
  avgDailyMilk: number;
  lastHealthCheck: string;
  alerts: number;
}

const mockCows: Cow[] = [
  { id: 'C001', name: 'Bella', breed: 'Holstein', status: 'milking', avgDailyMilk: 32.5, lastHealthCheck: '2025-12-05', alerts: 0 },
  { id: 'C002', name: 'Daisy', breed: 'Jersey', status: 'milking', avgDailyMilk: 28.3, lastHealthCheck: '2025-12-06', alerts: 1 },
  { id: 'C003', name: 'Luna', breed: 'Holstein', status: 'pregnant', avgDailyMilk: 0, lastHealthCheck: '2025-12-04', alerts: 0 },
  { id: 'C004', name: 'Rosie', breed: 'Brown Swiss', status: 'milking', avgDailyMilk: 30.8, lastHealthCheck: '2025-12-07', alerts: 0 },
  { id: 'C005', name: 'Clover', breed: 'Holstein', status: 'sick', avgDailyMilk: 15.2, lastHealthCheck: '2025-12-07', alerts: 2 },
  { id: 'C006', name: 'Buttercup', breed: 'Jersey', status: 'milking', avgDailyMilk: 29.1, lastHealthCheck: '2025-12-05', alerts: 0 },
  { id: 'C007', name: 'Bessie', breed: 'Holstein', status: 'dry', avgDailyMilk: 0, lastHealthCheck: '2025-12-03', alerts: 0 },
  { id: 'C008', name: 'Molly', breed: 'Ayrshire', status: 'milking', avgDailyMilk: 31.4, lastHealthCheck: '2025-12-06', alerts: 0 },
];

const statusColors = {
  milking: 'bg-green-100 text-green-700',
  dry: 'bg-gray-100 text-gray-700',
  pregnant: 'bg-blue-100 text-blue-700',
  sick: 'bg-red-100 text-red-700',
};

export function CowsList({ onNavigate }: CowsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const filteredCows = mockCows.filter(cow => {
    const matchesSearch = cow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cow.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cow.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCows = filteredCows.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Cows Management</h2>
          <p className="text-gray-600">{filteredCows.length} cows in total</p>
        </div>
        <button 
          onClick={() => onNavigate('cow-form')}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-500 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add New Cow
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, name or breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="milking">Milking</option>
              <option value="dry">Dry</option>
              <option value="pregnant">Pregnant</option>
              <option value="sick">Sick</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-gray-700">ID</th>
                <th className="px-6 py-4 text-left text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-gray-700">Breed</th>
                <th className="px-6 py-4 text-left text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-gray-700">Avg Daily Milk (L)</th>
                <th className="px-6 py-4 text-left text-gray-700">Last Health Check</th>
                <th className="px-6 py-4 text-left text-gray-700">Alerts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedCows.map((cow) => (
                <tr 
                  key={cow.id}
                  onClick={() => onNavigate('cow-detail', { cowId: cow.id })}
                  className="hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 text-gray-900">{cow.id}</td>
                  <td className="px-6 py-4 text-gray-900">{cow.name}</td>
                  <td className="px-6 py-4 text-gray-600">{cow.breed}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full ${statusColors[cow.status]}`}>
                      {cow.status.charAt(0).toUpperCase() + cow.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {cow.avgDailyMilk > 0 ? cow.avgDailyMilk.toFixed(1) : '—'}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{cow.lastHealthCheck}</td>
                  <td className="px-6 py-4">
                    {cow.alerts > 0 ? (
                      <div className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span>{cow.alerts}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-gray-600">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCows.length)} of {filteredCows.length} cows
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
