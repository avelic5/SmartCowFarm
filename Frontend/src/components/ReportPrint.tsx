import { X, Printer } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Page } from '../App';
import { useSettings } from '../context/SettingsContext';

interface ReportPrintProps {
  reportType: string;
  onNavigate: (page: Page, data?: any) => void;
}

const milkProductionData = [
  { date: 'Nov 7', liters: 2850 },
  { date: 'Nov 14', liters: 2920 },
  { date: 'Nov 21', liters: 3050 },
  { date: 'Nov 28', liters: 3100 },
  { date: 'Dec 5', liters: 3200 },
];

const cowPerformanceData = [
  { name: 'Bella', avgMilk: 32.5 },
  { name: 'Rosie', avgMilk: 30.8 },
  { name: 'Molly', avgMilk: 31.4 },
  { name: 'Buttercup', avgMilk: 29.1 },
  { name: 'Daisy', avgMilk: 28.3 },
];

const sessionData = [
  { id: 'C001', cow: 'Bella', sessions: 60, totalMilk: 1950, avgPerSession: 32.5, quality: 98 },
  { id: 'C002', cow: 'Daisy', sessions: 60, totalMilk: 1698, avgPerSession: 28.3, quality: 96 },
  { id: 'C004', cow: 'Rosie', sessions: 60, totalMilk: 1848, avgPerSession: 30.8, quality: 97 },
  { id: 'C006', cow: 'Buttercup', sessions: 60, totalMilk: 1746, avgPerSession: 29.1, quality: 95 },
  { id: 'C008', cow: 'Molly', sessions: 60, totalMilk: 1884, avgPerSession: 31.4, quality: 97 },
];

export function ReportPrint({ reportType, onNavigate }: ReportPrintProps) {
  const { formatNumber } = useSettings();

  const formatLiters = (value: number, fractionDigits = 1) =>
    `${formatNumber(value, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })} L`;

  const getReportTitle = () => {
    switch (reportType) {
      case 'milk-production': return 'Milk Production Report';
      case 'health-treatments': return 'Health & Treatments Report';
      case 'environment-sensors': return 'Environment & Sensors Report';
      case 'tasks-productivity': return 'Tasks & Productivity Report';
      case 'annual-summary': return 'Annual Summary Report';
      default: return 'Report';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar (hidden in print) */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between print:hidden sticky top-0 z-10 shadow-sm">
        <button
          onClick={() => onNavigate('report-detail', { reportType })}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4" />
          Close Print Preview
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-500 transition-all shadow-md"
        >
          <Printer className="w-4 h-4" />
          Print Report
        </button>
      </div>

      {/* Print Content */}
      <div className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none print:max-w-none my-8 print:my-0">
        {/* Page 1 */}
        <div className="p-16 print:p-12 min-h-[297mm] print:min-h-0 relative">
          {/* Header */}
          <div className="flex items-start justify-between mb-12 pb-6 border-b-2 border-gray-900">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white">OIS</span>
              </div>
              <div>
                <h1 className="text-gray-900 mb-1">OIS – Smart Cow Farm</h1>
                <p className="text-gray-600">Green Valley Ranch • Farm ID: GVR-001</p>
                <p className="text-gray-600">123 Main Street, Farmville, State 12345</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Report Date</p>
              <p className="text-gray-900">December 7, 2025</p>
            </div>
          </div>

          {/* Report Title */}
          <div className="mb-8">
            <h2 className="text-gray-900 mb-4">{getReportTitle()}</h2>
            <div className="grid grid-cols-3 gap-6 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-gray-600">Reporting Period</p>
                <p className="text-gray-900">Nov 7 - Dec 7, 2025</p>
              </div>
              <div>
                <p className="text-gray-600">Prepared by</p>
                <p className="text-gray-900">John Doe (Admin)</p>
              </div>
              <div>
                <p className="text-gray-600">Total Cows</p>
                <p className="text-gray-900">123 cows</p>
              </div>
            </div>
          </div>

          {/* Summary KPIs */}
          <div className="mb-8">
            <h3 className="text-gray-900 mb-4">Executive Summary</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="border-2 border-green-500 rounded-lg p-4">
                <p className="text-gray-600 mb-1">Total Production</p>
                <h3 className="text-gray-900">93,600 L</h3>
                <p className="text-green-600">+8.5%</p>
              </div>
              <div className="border-2 border-blue-500 rounded-lg p-4">
                <p className="text-gray-600 mb-1">Daily Average</p>
                <h3 className="text-gray-900">{formatLiters(3120, 0)}</h3>
                <p className="text-blue-600">Above target</p>
              </div>
              <div className="border-2 border-purple-500 rounded-lg p-4">
                <p className="text-gray-600 mb-1">Avg per Cow</p>
                <h3 className="text-gray-900">{formatLiters(31.8)}</h3>
                <p className="text-purple-600">Excellent</p>
              </div>
              <div className="border-2 border-amber-500 rounded-lg p-4">
                <p className="text-gray-600 mb-1">Quality Score</p>
                <h3 className="text-gray-900">{formatNumber(96.8, { maximumFractionDigits: 1 })}/100</h3>
                <p className="text-amber-600">High</p>
              </div>
            </div>
          </div>

          {/* Chart 1 */}
          <div className="mb-8">
            <h3 className="text-gray-900 mb-4">Weekly Production Trend</h3>
            <div className="border border-gray-300 rounded-lg p-4">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={milkProductionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="liters" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2 */}
          <div className="mb-8">
            <h3 className="text-gray-900 mb-4">Top Performing Cows</h3>
            <div className="border border-gray-300 rounded-lg p-4">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={cowPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="avgMilk" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Page number */}
          <div className="absolute bottom-8 right-16 text-gray-500">
            Page 1 of 2
          </div>
        </div>

        {/* Page break */}
        <div className="print:break-before-page"></div>

        {/* Page 2 */}
        <div className="p-16 print:p-12 min-h-[297mm] print:min-h-0 relative">
          {/* Data Table */}
          <div className="mb-12">
            <h3 className="text-gray-900 mb-4">Detailed Performance Data</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-900">Cow ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-900">Name</th>
                  <th className="border border-gray-300 px-4 py-2 text-right text-gray-900">Sessions</th>
                  <th className="border border-gray-300 px-4 py-2 text-right text-gray-900">Total Milk (L)</th>
                  <th className="border border-gray-300 px-4 py-2 text-right text-gray-900">Avg/Session</th>
                  <th className="border border-gray-300 px-4 py-2 text-right text-gray-900">Quality</th>
                </tr>
              </thead>
              <tbody>
                {sessionData.map((row, index) => (
                  <tr key={row.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">{row.id}</td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">{row.cow}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right text-gray-900">{formatNumber(row.sessions)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right text-gray-900">{formatNumber(row.totalMilk)}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right text-gray-900">{formatNumber(row.avgPerSession, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right text-gray-900">{formatNumber(row.quality, { maximumFractionDigits: 1 })}</td>
                  </tr>
                ))}
                <tr className="bg-gray-200">
                  <td colSpan={2} className="border border-gray-300 px-4 py-2 text-gray-900">Total / Average</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-gray-900">{formatNumber(300)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-gray-900">{formatNumber(9126)}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-gray-900">{formatNumber(30.4, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                  <td className="border border-gray-300 px-4 py-2 text-right text-gray-900">{formatNumber(96.6, { maximumFractionDigits: 1 })}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Notes */}
          <div className="mb-12">
            <h3 className="text-gray-900 mb-4">Notes & Observations</h3>
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <p className="text-gray-700 mb-3">
                Overall production remains strong with consistent daily outputs above target levels. 
                Top performing cows (Bella, Rosie, Molly) maintaining excellent production rates.
              </p>
              <p className="text-gray-700">
                Quality metrics remain within optimal ranges. Continue monitoring Clover (C005) for 
                lower-than-average production related to recent health treatment.
              </p>
            </div>
          </div>

          {/* Signatures */}
          <div className="mb-8">
            <h3 className="text-gray-900 mb-6">Approvals & Signatures</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <div className="border-b-2 border-gray-400 mb-2 h-16"></div>
                <p className="text-gray-700">Farm Manager</p>
                <p className="text-gray-600">Name: _______________________</p>
                <p className="text-gray-600">Date: _______________________</p>
              </div>
              <div>
                <div className="border-b-2 border-gray-400 mb-2 h-16"></div>
                <p className="text-gray-700">Veterinarian</p>
                <p className="text-gray-600">Name: _______________________</p>
                <p className="text-gray-600">Date: _______________________</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-8 left-16 right-16">
            <div className="border-t border-gray-300 pt-4 flex items-center justify-between text-gray-600">
              <p>OIS – Smart Cow Farm | Green Valley Ranch</p>
              <p>Page 2 of 2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}
