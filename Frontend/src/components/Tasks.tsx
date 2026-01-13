import { useEffect, useMemo, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Page } from '../App';
import { api } from '../api';
import type { ZadatakDto } from '../api/dto';

interface TasksProps {
  onNavigate: (page: Page) => void;
}

type StatusCol = 'Kreiran' | 'Obrada' | 'Zavrsen' | 'Otkazan';

const priorityColors = {
  Nizak: 'bg-blue-100 text-blue-700',
  Srednji: 'bg-amber-100 text-amber-700',
  Visok: 'bg-red-100 text-red-700',
  Kritican: 'bg-red-200 text-red-800',
} as Record<ZadatakDto['prioritet'], string>;

export function Tasks({ onNavigate }: TasksProps) {
  const [tasks, setTasks] = useState<ZadatakDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState<Partial<ZadatakDto>>({
    nazivZadatka: '',
    opis: '',
    prioritet: 'Srednji',
    idKreator: 1,
    rokIzvrsenja: '',
    statusZadatka: 'Kreiran',
    izvor: 'Manuelni',
    tipZadatka: 'Opći',
    utroseniResursiOpis: '',
    napomene: '',
  });

  useEffect(() => {
    api.zadaci.list()
      .then(setTasks)
      .catch((e) => setError(e?.message || 'Greška pri učitavanju zadataka.'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreateTask = () => {
    // Backend kreiranje nije još izloženo u api, fokus je na čitanju i statusu.
    setShowModal(false);
  };

  const moveTask = (taskId: number, newStatus: StatusCol) => {
    const t = tasks.find(t => t.idZadatka === taskId);
    if (!t) return;
    const updated: ZadatakDto = { ...t, statusZadatka: newStatus } as ZadatakDto;
    api.zadaci.update(taskId, updated)
      .then(() => setTasks(prev => prev.map(x => x.idZadatka === taskId ? updated : x)))
      .catch(e => setError(e?.message || 'Neuspješno ažuriranje zadatka.'));
  };

  const getTasksByStatus = (status: StatusCol) => tasks.filter(t => t.statusZadatka === status);

  const columns: Array<{ status: StatusCol; title: string; color: string }> = [
    { status: 'Kreiran', title: 'Kreirani', color: 'bg-gray-100' },
    { status: 'Obrada', title: 'U obradi', color: 'bg-blue-100' },
    { status: 'Zavrsen', title: 'Završeni', color: 'bg-green-100' },
    { status: 'Otkazan', title: 'Otkazani', color: 'bg-rose-100' },
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
              {error && <div className="p-4 text-red-600">{error}</div>}
              {getTasksByStatus(column.status).map(task => (
                <div 
                  key={task.idZadatka}
                  className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-move"
                  draggable
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-gray-900 flex-1">{task.nazivZadatka}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${priorityColors[task.prioritet]}`}>
                      {task.prioritet}
                    </span>
                  </div>
                  
                  {task.opis && (
                    <p className="text-gray-600 mb-3">{task.opis}</p>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Assignee:</span>
                      <span className="text-gray-900">{task.idIzvrsilac ?? '-'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Due:</span>
                      <span className="text-gray-900">{task.rokIzvrsenja}</span>
                    </div>
                    {task.idKrave && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Related:</span>
                        <span className="text-gray-900">Krava #{task.idKrave}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick actions */}
                  <div className="mt-3 flex gap-2">
                    {column.status !== 'Kreiran' && (
                      <button
                        onClick={() => moveTask(task.idZadatka, 'Kreiran')}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                      >
                        ← Kreiran
                      </button>
                    )}
                    {column.status !== 'Obrada' && (
                      <button
                        onClick={() => moveTask(task.idZadatka, 'Obrada')}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        U obradi
                      </button>
                    )}
                    {column.status !== 'Zavrsen' && (
                      <button
                        onClick={() => moveTask(task.idZadatka, 'Zavrsen')}
                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                      >
                        Završeno ✓
                      </button>
                    )}
                    {column.status !== 'Otkazan' && (
                      <button
                        onClick={() => moveTask(task.idZadatka, 'Otkazan')}
                        className="text-xs px-2 py-1 bg-rose-100 text-rose-700 rounded hover:bg-rose-200 transition-colors"
                      >
                        Otkazano
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
                  value={newTask.opis}
                  onChange={(e) => setNewTask({ ...newTask, opis: e.target.value })}
                  placeholder="Task details..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Priority *</label>
                  <select
                    value={newTask.prioritet}
                    onChange={(e) => setNewTask({ ...newTask, prioritet: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Nizak">Low</option>
                    <option value="Srednji">Medium</option>
                    <option value="Visok">High</option>
                    <option value="Kritican">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Due Date *</label>
                  <input
                    type="date"
                    value={newTask.rokIzvrsenja}
                    onChange={(e) => setNewTask({ ...newTask, rokIzvrsenja: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Assignee *</label>
                <select
                  value={newTask.idIzvrsilac as any}
                  onChange={(e) => setNewTask({ ...newTask, idIzvrsilac: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select assignee</option>
                  <option value="1">Osoba #1</option>
                  <option value="2">Osoba #2</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Related To</label>
                <input
                  type="text"
                  value={newTask.idKrave as any}
                  onChange={(e) => setNewTask({ ...newTask, idKrave: Number(e.target.value) })}
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
