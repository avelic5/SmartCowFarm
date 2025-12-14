import { ArrowLeft, Printer, Download, Share2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Page } from '../App';
import { useSettings } from '../context/SettingsContext';

interface ReportDetailProps {
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
  { name: 'Bella (C001)', avgMilk: 32.5 },
  { name: 'Rosie (C004)', avgMilk: 30.8 },
  { name: 'Molly (C008)', avgMilk: 31.4 },
  { name: 'Buttercup (C006)', avgMilk: 29.1 },
  { name: 'Daisy (C002)', avgMilk: 28.3 },
];

const sessionData = [
  { id: 'C001', cow: 'Bella', sessions: 60, totalMilk: 1950, avgPerSession: 32.5, quality: 98 },
  { id: 'C002', cow: 'Daisy', sessions: 60, totalMilk: 1698, avgPerSession: 28.3, quality: 96 },
  { id: 'C004', cow: 'Rosie', sessions: 60, totalMilk: 1848, avgPerSession: 30.8, quality: 97 },
  { id: 'C006', cow: 'Buttercup', sessions: 60, totalMilk: 1746, avgPerSession: 29.1, quality: 95 },
  { id: 'C008', cow: 'Molly', sessions: 60, totalMilk: 1884, avgPerSession: 31.4, quality: 97 },
];

export function ReportDetail({ reportType, onNavigate }: ReportDetailProps) {
  const { formatNumber, formatDate } = useSettings();

  const formatLiters = (value: number, fractionDigits = 1) =>
    `${formatNumber(value, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits })} L`;

  const reportDate = new Date('2025-12-07');
  const periodStart = new Date('2025-11-07');
  const periodEnd = new Date('2025-12-07');

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

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Reports
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('report-print', { reportType })}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print View
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          {/* Report Header */}
          <div className="p-8 border-b border-gray-200">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-white">OIS</span>
                </div>
                <div>
                  <h1 className="text-gray-900 mb-1">OIS – Smart Cow Farm</h1>
                  <p className="text-gray-600">Green Valley Ranch • Farm ID: GVR-001</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Report Generated</p>
                <p className="text-gray-900">{formatDate(reportDate)}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-gray-900 mb-2">{getReportTitle()}</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600">Period</p>
                  <p className="text-gray-900">{formatDate(periodStart)} - {formatDate(periodEnd)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Prepared by</p>
                  <p className="text-gray-900">John Doe (Admin)</p>
                </div>
                <div>
                  <p className="text-gray-600">Total Cows</p>
                  <p className="text-gray-900">{formatNumber(123)} cows</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-gray-900 mb-4">Executive Summary</h3>
            <div className="grid grid-cols-4 gap-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-gray-600 mb-1">Total Milk Production</p>
                <h3 className="text-gray-900">{formatLiters(93600, 0)}</h3>
                <p className="text-green-600">+8.5% vs last period</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-gray-600 mb-1">Daily Average</p>
                <h3 className="text-gray-900">{formatLiters(3120, 0)}</h3>
                <p className="text-blue-600">Above target</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <p className="text-gray-600 mb-1">Avg per Cow</p>
                <h3 className="text-gray-900">{formatLiters(31.8)}</h3>
                <p className="text-purple-600">Excellent</p>
              </div>
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <p className="text-gray-600 mb-1">Quality Score</p>
                <h3 className="text-gray-900">{formatNumber(96.8, { maximumFractionDigits: 1 })}/100</h3>
                <p className="text-amber-600">High quality</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="p-8 border-b border-gray-200">
            <h3 className="text-gray-900 mb-6">Production Trends</h3>
            
            {/* Line Chart */}
            <div className="mb-8">
              <h4 className="text-gray-700 mb-4">Weekly Milk Production</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={milkProductionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="liters" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5 }}
                    name="Liters"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div>
              <h4 className="text-gray-700 mb-4">Top Performing Cows</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cowPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="avgMilk" fill="#3b82f6" name="Avg Milk (L)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Data Table */}
          <div className="p-8">
            <h3 className="text-gray-900 mb-4">Detailed Performance Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700">Cow ID</th>
                    <th className="px-4 py-3 text-left text-gray-700">Name</th>
                    <th className="px-4 py-3 text-right text-gray-700">Sessions</th>
                    <th className="px-4 py-3 text-right text-gray-700">Total Milk (L)</th>
                    <th className="px-4 py-3 text-right text-gray-700">Avg/Session (L)</th>
                    <th className="px-4 py-3 text-right text-gray-700">Quality Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sessionData.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900">{row.id}</td>
                      <td className="px-4 py-3 text-gray-900">{row.cow}</td>
                      <td className="px-4 py-3 text-right text-gray-900">{formatNumber(row.sessions)}</td>
                      <td className="px-4 py-3 text-right text-gray-900">{formatNumber(row.totalMilk)}</td>
                      <td className="px-4 py-3 text-right text-gray-900">{formatNumber(row.avgPerSession, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                      <td className="px-4 py-3 text-right text-green-600">{formatNumber(row.quality, { maximumFractionDigits: 1 })}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100">
                    <td colSpan={2} className="px-4 py-3 text-gray-900">Total / Average</td>
                    <td className="px-4 py-3 text-right text-gray-900">{formatNumber(300)}</td>
                    <td className="px-4 py-3 text-right text-gray-900">{formatNumber(9126)}</td>
                    <td className="px-4 py-3 text-right text-gray-900">{formatNumber(30.4, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</td>
                    <td className="px-4 py-3 text-right text-green-600">{formatNumber(96.6, { maximumFractionDigits: 1 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes Section */}
          <div className="p-8 border-t border-gray-200 bg-gray-50">
            <h3 className="text-gray-900 mb-4">Notes & Comments</h3>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-gray-700">
                Overall production remains strong with consistent daily outputs above target levels. 
                Top performing cows (Bella, Rosie, Molly) maintaining excellent production rates. 
                Quality metrics remain within optimal ranges. Continue monitoring Clover (C005) for 
                lower-than-average production related to recent health treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
