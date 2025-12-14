import { ReactNode } from 'react';
import { 
  LayoutDashboard, 
  Milk, 
  Activity, 
  Heart, 
  Thermometer, 
  CheckSquare, 
  AlertTriangle, 
  FileText, 
  Users, 
  Settings,
  Search,
  Bell,
  ChevronRight
} from 'lucide-react';
import { Page } from '../App';

interface LayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

interface NavItem {
  id: Page;
  label: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'cows', label: 'Cows', icon: Milk },
  { id: 'milk-production', label: 'Milk Production', icon: Activity },
  { id: 'health-reproduction', label: 'Health & Reproduction', icon: Heart },
  { id: 'sensors-environment', label: 'Sensors & Environment', icon: Thermometer },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'users-roles', label: 'Users & Roles', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const pageTitle: Record<Page, string> = {
  'dashboard': 'Dashboard',
  'cows': 'Cows Management',
  'cow-detail': 'Cow Details',
  'cow-form': 'Cow Form',
  'milk-production': 'Milk Production',
  'health-reproduction': 'Health & Reproduction',
  'sensors-environment': 'Sensors & Environment',
  'tasks': 'Task Management',
  'alerts': 'Alerts & Notifications',
  'reports': 'Reports',
  'report-detail': 'Report Details',
  'report-print': 'Print Report',
  'users-roles': 'Users & Roles',
  'settings': 'Settings',
};

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
        {/* Logo */}
        <div className="h-16 border-b border-gray-200 flex items-center px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <Milk className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-gray-900">OIS</div>
              <div className="text-gray-500">Smart Farm</div>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id || 
              (item.id === 'cows' && ['cow-detail', 'cow-form'].includes(currentPage)) ||
              (item.id === 'reports' && ['report-detail', 'report-print'].includes(currentPage));
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          {/* Page title and breadcrumb */}
          <div className="flex items-center gap-2">
            <h2 className="text-gray-900">{pageTitle[currentPage]}</h2>
            {(currentPage === 'cow-detail' || currentPage === 'cow-form') && (
              <>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {currentPage === 'cow-detail' ? 'Details' : 'Edit'}
                </span>
              </>
            )}
          </div>

          {/* Right side: search, notifications, profile */}
          <div className="flex items-center gap-4">
            {/* Global search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <div className="text-gray-900">John Doe</div>
                <div className="text-green-600">Admin</div>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
