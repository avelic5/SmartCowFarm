import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Page } from '../App';

interface TasksProps {
  onNavigate: (page: Page) => void;
}

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  relatedTo?: string;
  status: 'planned' | 'in-progress' | 'done';
}

const initialTasks: Task[] = [
  { id: 1, title: 'Routine health check - Bella', description: 'Monthly health inspection', priority: 'medium', assignee: 'Dr. Smith', dueDate: '2025-12-15', relatedTo: 'Bella (C001)', status: 'planned' },
  { id: 2, title: 'Hoof trimming - Zone A', description: 'Trim hooves for cows in Zone A', priority: 'high', assignee: 'John Doe', dueDate: '2025-12-10', relatedTo: 'Zone A', status: 'in-progress' },
  { id: 3, title: 'Check milking equipment', description: 'Inspect and clean Station 2', priority: 'medium', assignee: 'Mike Johnson', dueDate: '2025-12-09', relatedTo: 'Station 2', status: 'in-progress' },
  { id: 4, title: 'Vaccination program', description: 'Annual vaccinations for new calves', priority: 'high', assignee: 'Dr. Smith', dueDate: '2025-12-12', status: 'planned' },
  { id: 5, title: 'Feed inventory check', description: 'Check and order feed supplies', priority: 'low', assignee: 'Sarah Lee', dueDate: '2025-12-08', status: 'done' },
  { id: 6, title: 'Barn cleaning - Zone C2', description: 'Deep clean Zone C2 due to high NH3', priority: 'high', assignee: 'Mike Johnson', dueDate: '2025-12-08', relatedTo: 'Zone C2', status: 'done' },
];

const priorityColors = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
};

export function Tasks({ onNavigate }: TasksProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    dueDate: '',
    relatedTo: '',
    status: 'planned',
  });

  const handleCreateTask = () => {
    if (newTask.title && newTask.assignee && newTask.dueDate) {
      const task: Task = {
        id: tasks.length + 1,
        title: newTask.title,
        description: newTask.description || '',
        priority: newTask.priority || 'medium',
        assignee: newTask.assignee,
        dueDate: newTask.dueDate,
        relatedTo: newTask.relatedTo,
        status: 'planned',
      };
      setTasks([...tasks, task]);
      setShowModal(false);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        assignee: '',
        dueDate: '',
        relatedTo: '',
        status: 'planned',
      });
    }
  };

  const moveTask = (taskId: number, newStatus: 'planned' | 'in-progress' | 'done') => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const getTasksByStatus = (status: 'planned' | 'in-progress' | 'done') => {
    return tasks.filter(task => task.status === status);
  };

  const columns: Array<{ status: 'planned' | 'in-progress' | 'done'; title: string; color: string }> = [
    { status: 'planned', title: 'Planned', color: 'bg-gray-100' },
    { status: 'in-progress', title: 'In Progress', color: 'bg-blue-100' },
    { status: 'done', title: 'Done', color: 'bg-green-100' },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-1">Task Management</h2>
          <p className="text-gray-600">{tasks.length} total tasks</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-500 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map(column => (
          <div key={column.status} className="space-y-4">
            {/* Column Header */}
            <div className={`${column.color} rounded-lg p-4`}>
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">{column.title}</h3>
                <span className="text-gray-600">{getTasksByStatus(column.status).length}</span>
              </div>
            </div>

            {/* Tasks */}
            <div className="space-y-3">
              {getTasksByStatus(column.status).map(task => (
                <div 
                  key={task.id}
                  className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-move"
                  draggable
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-gray-900 flex-1">{task.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${priorityColors[task.priority]}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className="text-gray-600 mb-3">{task.description}</p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Assignee:</span>
                      <span className="text-gray-900">{task.assignee}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Due:</span>
                      <span className="text-gray-900">{task.dueDate}</span>
                    </div>
                    {task.relatedTo && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Related:</span>
                        <span className="text-gray-900">{task.relatedTo}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="mt-3 flex gap-2">
                    {column.status !== 'planned' && (
                      <button
                        onClick={() => moveTask(task.id, 'planned')}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        ← Planned
                      </button>
                    )}
                    {column.status !== 'in-progress' && (
                      <button
                        onClick={() => moveTask(task.id, 'in-progress')}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        In Progress
                      </button>
                    )}
                    {column.status !== 'done' && (
                      <button
                        onClick={() => moveTask(task.id, 'done')}
                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        Done ✓
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-gray-900">Create New Task</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g., Health check for Bella"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task details..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Priority *</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Due Date *</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Assignee *</label>
                <select
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select assignee</option>
                  <option value="Dr. Smith">Dr. Smith</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Mike Johnson">Mike Johnson</option>
                  <option value="Sarah Lee">Sarah Lee</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Related To</label>
                <input
                  type="text"
                  value={newTask.relatedTo}
                  onChange={(e) => setNewTask({ ...newTask, relatedTo: e.target.value })}
                  placeholder="e.g., Bella (C001), Zone A2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-500 transition-all shadow-md"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
