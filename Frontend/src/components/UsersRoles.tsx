import { useState } from 'react';
import { UserPlus, X, Check } from 'lucide-react';
import { Page } from '../App';

interface UsersRolesProps {
  onNavigate: (page: Page) => void;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Vet' | 'Staff';
  status: 'active' | 'inactive';
  lastLogin: string;
}

const usersData: User[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'active', lastLogin: '2025-12-07 09:15' },
  { id: 2, name: 'Dr. Sarah Smith', email: 'sarah.smith@example.com', role: 'Vet', status: 'active', lastLogin: '2025-12-06 14:30' },
  { id: 3, name: 'Mike Johnson', email: 'mike.johnson@example.com', role: 'Manager', status: 'active', lastLogin: '2025-12-07 08:00' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Staff', status: 'active', lastLogin: '2025-12-07 07:30' },
  { id: 5, name: 'Tom Wilson', email: 'tom.wilson@example.com', role: 'Staff', status: 'active', lastLogin: '2025-12-05 16:45' },
  { id: 6, name: 'Lisa Brown', email: 'lisa.brown@example.com', role: 'Staff', status: 'inactive', lastLogin: '2025-11-28 10:20' },
];

const roleColors = {
  Admin: 'bg-purple-100 text-purple-700',
  Manager: 'bg-blue-100 text-blue-700',
  Vet: 'bg-green-100 text-green-700',
  Staff: 'bg-gray-100 text-gray-700',
};

const statusColors = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-700',
};

const permissions = {
  Admin: [
    'View all data',
    'Edit all data',
    'Manage users',
    'Manage settings',
    'Generate reports',
    'Delete records',
    'View financial data',
    'Manage system configuration',
  ],
  Manager: [
    'View all data',
    'Edit cow data',
    'Manage tasks',
    'Generate reports',
    'View alerts',
    'Manage production data',
  ],
  Vet: [
    'View cow data',
    'Edit health records',
    'View health alerts',
    'Add diagnoses',
    'Prescribe treatments',
    'Generate health reports',
  ],
  Staff: [
    'View cow data',
    'View tasks',
    'Update task status',
    'View alerts',
    'Basic data entry',
  ],
};

export function UsersRoles({ onNavigate }: UsersRolesProps) {
  const [users, setUsers] = useState<User[]>(usersData);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSidepanel, setShowSidepanel] = useState(false);

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowSidepanel(true);
  };

  const handleClosePanel = () => {
    setShowSidepanel(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Users & Roles</h2>
          <p className="text-gray-600">{users.length} users total</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-500  transition-all shadow-md">
          <UserPlus className="w-4 h-4" />
          Add New User
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-gray-600 mb-1">Active Users</p>
          <h3 className="text-gray-900">{users.filter(u => u.status === 'active').length}</h3>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-gray-600 mb-1">Admins</p>
          <h3 className="text-gray-900">{users.filter(u => u.role === 'Admin').length}</h3>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-gray-600 mb-1">Managers</p>
          <h3 className="text-gray-900">{users.filter(u => u.role === 'Manager').length}</h3>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-gray-600 mb-1">Veterinarians</p>
          <h3 className="text-gray-900">{users.filter(u => u.role === 'Vet').length}</h3>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">All Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-gray-700">Role</th>
                <th className="px-6 py-3 text-left text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-gray-700">Last Login</th>
                <th className="px-6 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-gray-600">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full ${roleColors[user.role]}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full ${statusColors[user.status]}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{user.lastLogin}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permissions Reference */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-gray-900">Role Permissions Reference</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(permissions).map(([role, perms]) => (
              <div key={role} className="space-y-3">
                <div className={`px-3 py-2 rounded-lg ${roleColors[role as keyof typeof roleColors]} inline-block`}>
                  {role}
                </div>
                <ul className="space-y-2">
                  {perms.map((perm, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-700">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{perm}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Side Panel */}
      {showSidepanel && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end z-50">
          <div className="bg-white w-full max-w-md h-full shadow-2xl overflow-y-auto">
            {/* Panel Header */}
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-900">Edit User</h3>
                <button 
                  onClick={handleClosePanel}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <p className="text-gray-600">Update user information and permissions</p>
            </div>

            {/* Panel Content */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue={selectedUser.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  defaultValue={selectedUser.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Role</label>
                <select
                  defaultValue={selectedUser.role}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Vet">Veterinarian</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Status</label>
                <select
                  defaultValue={selectedUser.status}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-3">Permissions for {selectedUser.role}</label>
                <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                  {permissions[selectedUser.role].map((perm, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{perm}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Panel Footer */}
            <div className="p-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <div className="flex gap-3">
                <button
                  onClick={handleClosePanel}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClosePanel}
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-500 transition-all shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
