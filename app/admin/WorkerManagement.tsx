
'use client';

import { useState, useEffect } from 'react';
import { saveWorkerData, getAllWorkers, deleteWorker } from '../../lib/database';

interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  workSchedule: {
    start: string;
    end: string;
    breakStart: string;
    breakEnd: string;
  };
  isActive: boolean;
}

export default function WorkerManagement() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    workStart: '09:00',
    workEnd: '17:00',
    breakStart: '12:00',
    breakEnd: '13:00'
  });

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = () => {
    const allWorkers = getAllWorkers();
    setWorkers(allWorkers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const workerData: Omit<Worker, 'id'> = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      department: formData.department,
      workSchedule: {
        start: formData.workStart,
        end: formData.workEnd,
        breakStart: formData.breakStart,
        breakEnd: formData.breakEnd
      },
      isActive: true
    };

    if (editingWorker) {
      saveWorkerData({ ...workerData, id: editingWorker.id });
    } else {
      saveWorkerData(workerData);
    }

    resetForm();
    loadWorkers();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      workStart: '09:00',
      workEnd: '17:00',
      breakStart: '12:00',
      breakEnd: '13:00'
    });
    setShowForm(false);
    setEditingWorker(null);
  };

  const handleEdit = (worker: Worker) => {
    setEditingWorker(worker);
    setFormData({
      name: worker.name,
      email: worker.email,
      phone: worker.phone,
      position: worker.position,
      department: worker.department,
      workStart: worker.workSchedule.start,
      workEnd: worker.workSchedule.end,
      breakStart: worker.workSchedule.breakStart,
      breakEnd: worker.workSchedule.breakEnd
    });
    setShowForm(true);
  };

  const handleDelete = (workerId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este trabajador?')) {
      deleteWorker(workerId);
      loadWorkers();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Gestión de Trabajadores</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors !rounded-button"
        >
          <i className="ri-add-line mr-2"></i>
          Nuevo Trabajador
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingWorker ? 'Editar Trabajador' : 'Nuevo Trabajador'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 text-gray-400 hover:text-gray-600 !rounded-button"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-close-line"></i>
                </div>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Departamento
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                >
                  <option value="">Seleccionar departamento</option>
                  <option value="Recursos Humanos">Recursos Humanos</option>
                  <option value="Desarrollo">Desarrollo</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Operaciones">Operaciones</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora Inicio
                  </label>
                  <input
                    type="time"
                    value={formData.workStart}
                    onChange={(e) => setFormData({...formData, workStart: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora Fin
                  </label>
                  <input
                    type="time"
                    value={formData.workEnd}
                    onChange={(e) => setFormData({...formData, workEnd: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descanso Inicio
                  </label>
                  <input
                    type="time"
                    value={formData.breakStart}
                    onChange={(e) => setFormData({...formData, breakStart: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descanso Fin
                  </label>
                  <input
                    type="time"
                    value={formData.breakEnd}
                    onChange={(e) => setFormData({...formData, breakEnd: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors !rounded-button"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors !rounded-button"
                >
                  {editingWorker ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {workers.map((worker) => (
          <div key={worker.id} className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-800">{worker.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    worker.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {worker.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><i className="ri-mail-line mr-2 text-gray-400"></i>{worker.email}</p>
                  <p><i className="ri-phone-line mr-2 text-gray-400"></i>{worker.phone}</p>
                  <p><i className="ri-briefcase-line mr-2 text-gray-400"></i>{worker.position} - {worker.department}</p>
                  <p><i className="ri-time-line mr-2 text-gray-400"></i>
                    {worker.workSchedule.start} - {worker.workSchedule.end} 
                    (Descanso: {worker.workSchedule.breakStart} - {worker.workSchedule.breakEnd})
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(worker)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors !rounded-button"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-edit-line"></i>
                  </div>
                </button>
                <button
                  onClick={() => handleDelete(worker.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors !rounded-button"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-delete-bin-line"></i>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {workers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <i className="ri-team-line text-4xl mb-4 block"></i>
            <p>No hay trabajadores registrados</p>
          </div>
        )}
      </div>
    </div>
  );
}
