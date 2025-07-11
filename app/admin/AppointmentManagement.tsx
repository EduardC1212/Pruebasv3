
'use client';

import { useState, useEffect } from 'react';
import { getAllAppointments, updateAppointment, deleteAppointment } from '../../lib/database';

interface Appointment {
  id: string;
  date: string;
  time: string;
  person: string;
  department: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [filters, setFilters] = useState({
    status: 'all',
    date: '',
    person: ''
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [editFormData, setEditFormData] = useState({
    date: '',
    time: '',
    reason: '',
    status: 'pending' as 'pending' | 'confirmed' | 'cancelled'
  });

  useEffect(() => {
    loadAppointments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [appointments, filters]);

  const loadAppointments = () => {
    const allAppointments = getAllAppointments();
    setAppointments(allAppointments);
  };

  const applyFilters = () => {
    let filtered = [...appointments];

    if (filters.status !== 'all') {
      filtered = filtered.filter(apt => apt.status === filters.status);
    }

    if (filters.date) {
      filtered = filtered.filter(apt => apt.date === filters.date);
    }

    if (filters.person) {
      filtered = filtered.filter(apt => 
        apt.person.toLowerCase().includes(filters.person.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredAppointments(filtered);
  };

  const handleStatusChange = (appointmentId: string, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    updateAppointment(appointmentId, { status: newStatus });
    loadAppointments();
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setEditFormData({
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
      status: appointment.status
    });
    setShowEditForm(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    updateAppointment(editingAppointment.id, {
      date: editFormData.date,
      time: editFormData.time,
      reason: editFormData.reason,
      status: editFormData.status
    });

    setShowEditForm(false);
    setEditingAppointment(null);
    loadAppointments();
  };

  const handleDelete = (appointmentId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      deleteAppointment(appointmentId);
      loadAppointments();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Pendiente';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Gestión de Citas</h2>
        <div className="text-sm text-gray-600">
          Total: {filteredAppointments.length} citas
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="font-medium text-gray-800 mb-3">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendientes</option>
              <option value="confirmed">Confirmadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({...filters, date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Persona</label>
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={filters.person}
              onChange={(e) => setFilters({...filters, person: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {showEditForm && editingAppointment && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Editar Cita</h3>
              <button
                onClick={() => setShowEditForm(false)}
                className="p-2 text-gray-400 hover:text-gray-600 !rounded-button"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-close-line"></i>
                </div>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  value={editFormData.date}
                  onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <input
                  type="time"
                  value={editFormData.time}
                  onChange={(e) => setEditFormData({...editFormData, time: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo
                </label>
                <textarea
                  value={editFormData.reason}
                  onChange={(e) => setEditFormData({...editFormData, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  rows={3}
                  maxLength={500}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({...editFormData, status: e.target.value as 'pending' | 'confirmed' | 'cancelled'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="cancelled">Cancelada</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors !rounded-button"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors !rounded-button"
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredAppointments.map((appointment) => (
          <div key={appointment.id} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-800">{appointment.person}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><i className="ri-calendar-line mr-2 text-gray-400"></i>
                    {new Date(appointment.date).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} - {appointment.time}
                  </p>
                  <p><i className="ri-building-line mr-2 text-gray-400"></i>{appointment.department}</p>
                  <p><i className="ri-file-text-line mr-2 text-gray-400"></i>{appointment.reason}</p>
                  <p><i className="ri-user-line mr-2 text-gray-400"></i>Creada por: {appointment.createdBy}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2 ml-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(appointment)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors !rounded-button"
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-edit-line"></i>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDelete(appointment.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors !rounded-button"
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-delete-bin-line"></i>
                    </div>
                  </button>
                </div>
                {appointment.status === 'pending' && (
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                      className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors !rounded-button"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors !rounded-button"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredAppointments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <i className="ri-calendar-line text-4xl mb-4 block"></i>
            <p>No se encontraron citas con los filtros aplicados</p>
          </div>
        )}
      </div>
    </div>
  );
}
