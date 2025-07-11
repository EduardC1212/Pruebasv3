
'use client';
type Appointment = {
  id: number;
  date: string;
  time: string;
  participant: string;
  reason: string;
  status: string;
};

type Props = {
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
};

import { useState } from 'react';

export default function AppointmentList({ appointments, setAppointments }: Props) {
  const [filter, setFilter] = useState('todas');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  const filters = [
    { id: 'todas', name: 'Todas', icon: 'ri-list-check' },
    { id: 'pendiente', name: 'Pendientes', icon: 'ri-time-line' },
    { id: 'confirmada', name: 'Confirmadas', icon: 'ri-check-line' }
  ];

  const filteredAppointments = appointments.filter(apt => 
    filter === 'todas' || apt.status === filter
  );

  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setShowEditModal(true);
  };

  const handleCancel = (appointmentId) => {
    setAppointments(appointments.filter(apt => apt.id !== appointmentId));
  };

  const handleConfirm = (appointmentId) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId 
        ? { ...apt, status: 'confirmada' }
        : apt
    ));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmada':
        return 'bg-green-100 text-green-600 border-green-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-2xl p-1 shadow-sm">
        <div className="grid grid-cols-3 gap-1">
          {filters.map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              className={`px-3 py-2 rounded-xl transition-all duration-200 ${
                filter === filterOption.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 flex items-center justify-center mb-1">
                  <i className={`${filterOption.icon} text-sm`}></i>
                </div>
                <span className="text-xs font-medium">{filterOption.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Citas */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
                    <i className="ri-calendar-event-line text-white text-lg"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {appointment.participant}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {formatDate(appointment.date)} • {appointment.time}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                  {appointment.status}
                </span>
              </div>

              <p className="text-gray-700 text-sm mb-4 bg-gray-50 p-3 rounded-xl">
                <i className="ri-file-text-line mr-2"></i>
                {appointment.reason}
              </p>

              <div className="flex gap-2">
                {appointment.status === 'pendiente' && (
                  <button
                    onClick={() => handleConfirm(appointment.id)}
                    className="flex-1 bg-green-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-green-600 transition-colors !rounded-button"
                  >
                    <i className="ri-check-line mr-1"></i>
                    Confirmar
                  </button>
                )}
                
                <button
                  onClick={() => handleEdit(appointment)}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-blue-600 transition-colors !rounded-button"
                >
                  <i className="ri-edit-line mr-1"></i>
                  Editar
                </button>
                
                <button
                  onClick={() => handleCancel(appointment.id)}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-xl font-medium hover:bg-red-600 transition-colors !rounded-button"
                >
                  <i className="ri-close-line mr-1"></i>
                  Cancelar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="ri-calendar-line text-2xl text-gray-400"></i>
            </div>
            <h3 className="font-semibold text-gray-700 mb-2">
              No hay citas {filter !== 'todas' ? filter + 's' : ''}
            </h3>
            <p className="text-gray-500 text-sm">
              {filter === 'todas' 
                ? 'Aún no tienes citas programadas'
                : `No tienes citas ${filter}s en este momento`
              }
            </p>
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {showEditModal && editingAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">
                Editar Cita
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>
            
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-edit-line text-2xl text-blue-600"></i>
              </div>
              <p className="text-gray-600 mb-6">
                Funcionalidad de edición disponible próximamente
              </p>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-semibold !rounded-button"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
