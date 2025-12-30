import { useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { Page } from '../App';

interface ReportsProps {
  onNavigate: (page: Page, data?: any) => void;
}

export function Reports({ onNavigate }: ReportsProps) {
  const [reportType, setReportType] = useState('milk-production');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [startDate, setStartDate] = useState('2025-11-07');
  const [endDate, setEndDate] = useState('2025-12-07');
  const [barnFilter, setBarnFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');

  const handleGenerate = () => {
    onNavigate('report-detail', { reportType });
  };

  const handlePrint = () => {
    onNavigate('report-print', { reportType });
  };

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-gray-900 mb-1">Reports</h2>
          <p className="text-gray-600">Generate and export farm management reports</p>
        </div>

        {/* Report Configuration */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-gray-900 mb-4">Report Configuration</h3>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-gray-700 mb-2">Report Type *</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="milk-production">Milk Production Report</option>
              <option value="health-treatments">Health & Treatments Report</option>
              <option value="environment-sensors">Environment & Sensors Report</option>
              <option value="tasks-productivity">Tasks & Productivity Report</option>
              <option value="annual-summary">Annual Summary Report</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-gray-700 mb-2">Date Range *</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="last-7-days">Last 7 days</option>
                <option value="last-30-days">Last 30 days</option>
                <option value="last-90-days">Last 90 days</option>
                <option value="this-month">This month</option>
                <option value="last-month">Last month</option>
                <option value="this-year">This year</option>
                <option value="custom">Custom range</option>
              </select>

              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                disabled={dateRange !== 'custom'}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                disabled={dateRange !== 'custom'}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Filters */}
          <div>
            <label className="block text-gray-700 mb-2">Filters</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 mb-1">Barn/Zone</label>
                <select
                  value={barnFilter}
                  onChange={(e) => setBarnFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Zones</option>
                  <option value="zone-a">Zone A (A1, A2)</option>
                  <option value="zone-b">Zone B (B1, B2)</option>
                  <option value="zone-c">Zone C (C1, C2)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-600 mb-1">Group</label>
                <select
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Groups</option>
                  <option value="milking">Milking Cows</option>
                  <option value="dry">Dry Cows</option>
                  <option value="pregnant">Pregnant Cows</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="text-gray-900 mb-4">Actions</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGenerate}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-500 transition-all shadow-md"
            >
              <FileText className="w-5 h-5" />
              Generate Report
            </button>
            <button
              onClick={() => {}}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export PDF
            </button>
            <button
              onClick={() => {}}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-gray-900">Recent Reports</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {[
              { name: 'Milk Production - November 2025', date: '2025-12-01', type: 'PDF', size: '2.4 MB' },
              { name: 'Health & Treatments - Q4 2025', date: '2025-11-28', type: 'PDF', size: '1.8 MB' },
              { name: 'Annual Summary - 2024', date: '2025-01-05', type: 'PDF', size: '5.2 MB' },
            ].map((report, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-900">{report.name}</p>
                    <p className="text-gray-500">Generated on {report.date} • {report.type} • {report.size}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
