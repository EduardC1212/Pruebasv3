
'use client';

import { useState } from 'react';
import { saveAppointment, getAllWorkers, getAvailableTimeSlots } from '../../lib/database';

export default function AppointmentForm({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    person: '',
    date: '',
    time: '',
    reason: ''
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  // Datos simulados de usuarios disponibles
  const availableUsers = [
    { id: 1, name: 'Ana García', department: 'Marketing' },
    { id: 2, name: 'Carlos López', department: 'Finanzas' },
    { id: 3, name: 'María Rodríguez', department: 'Recursos Humanos' },
    { id: 4, name: 'Juan Martínez', department: 'Desarrollo' },
    { id: 5, name: 'Laura Sánchez', department: 'Ventas' }
  ];

  // Datos simulados de horarios de trabajo por usuario
  const workSchedules = {
    'Ana García': { start: '09:00', end: '17:00', breaks: ['12:00-13:00'] },
    'Carlos López': { start: '08:30', end: '16:30', breaks: ['12:30-13:30'] },
    'María Rodríguez': { start: '09:30', end: '17:30', breaks: ['13:00-14:00'] },
    'Juan Martínez': { start: '10:00', end: '18:00', breaks: ['14:00-15:00'] },
    'Laura Sánchez': { start: '08:00', end: '16:00', breaks: ['12:00-13:00'] }
  };

  // Citas existentes simuladas
  const existingAppointments = {
    'Ana García': [
      { date: '2024-12-20', time: '10:00' },
      { date: '2024-12-20', time: '15:30' }
    ],
    'Carlos López': [
      { date: '2024-12-22', time: '11:00' }
    ]
  };

  const workers = availableUsers.map(user => ({ id: user.id, name: user.name, department: user.department }));

  const generateTimeSlots = (date, person) => {
    if (!date || !person) return;

    const schedule = workSchedules[person];
    if (!schedule) return;

    const slots = [];
    const startHour = parseInt(schedule.start.split(':')[0]);
    const startMinute = parseInt(schedule.start.split(':')[1]);
    const endHour = parseInt(schedule.end.split(':')[0]);
    const endMinute = parseInt(schedule.end.split(':')[1]);

    // Generar slots de 30 minutos
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === startHour && minute < startMinute) continue;
        if (hour === endHour - 1 && minute >= endMinute) continue;

        const timeSlot = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        // Verificar si está en horario de descanso
        const isBreakTime = schedule.breaks.some(breakTime => {
          const [breakStart, breakEnd] = breakTime.split('-');
          return timeSlot >= breakStart && timeSlot < breakEnd;
        });

        // Verificar si ya tiene cita agendada
        const hasAppointment = existingAppointments[person]?.some(
          apt => apt.date === date && apt.time === timeSlot
        );

        if (!isBreakTime && !hasAppointment) {
          slots.push(timeSlot);
        }
      }
    }

    setAvailableSlots(slots);
    setShowTimeSlots(true);
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setFormData({ ...formData, date: newDate, time: '' });

    if (newDate && formData.person) {
      generateTimeSlots(newDate, formData.person);
    }
  };

  const handlePersonChange = (e) => {
    const newPerson = e.target.value;
    setFormData({ ...formData, person: newPerson, time: '' });

    if (formData.date && newPerson) {
      generateTimeSlots(formData.date, newPerson);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedWorker = workers.find(w => w.name === formData.person);
    if (!selectedWorker) return;

    saveAppointment({
      date: formData.date,
      time: formData.time,
      person: selectedWorker.name,
      department: selectedWorker.department,
      reason: formData.reason,
      status: 'pending',
      createdBy: 'Usuario Actual'
    });

    setFormData({
      person: '',
      date: '',
      time: '',
      reason: ''
    });

    onClose();
  };

  // Obtener fecha mínima (hoy)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
          <i className="ri-calendar-event-line text-white text-xl"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Agendar Cita</h2>
          <p className="text-gray-500 text-sm">Programa una nueva reunión</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de Persona */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <i className="ri-user-line mr-2"></i>
            Persona para la Cita
          </label>
          <select
            value={formData.person}
            onChange={handlePersonChange}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-800"
            required
          >
            <option value="">Seleccionar persona...</option>
            {workers.map((worker) => (
              <option key={worker.id} value={worker.name}>
                {worker.name} - {worker.department}
              </option>
            ))}
          </select>
        </div>

        {/* Selección de Fecha */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <i className="ri-calendar-line mr-2"></i>
            Fecha
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={handleDateChange}
            min={today}
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-800"
            required
          />
        </div>

        {/* Horarios Disponibles */}
        {showTimeSlots && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <i className="ri-time-line mr-2"></i>
              Horarios Disponibles
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
              {availableSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setFormData({ ...formData, time: slot })}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    formData.time === slot
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            {availableSlots.length === 0 && (
              <p className="text-gray-500 text-center py-4">
                No hay horarios disponibles para esta fecha
              </p>
            )}
          </div>
        )}

        {/* Motivo de la Cita */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            <i className="ri-file-text-line mr-2"></i>
            Motivo de la Cita
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Describe el motivo de la reunión..."
            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 text-gray-800 resize-none"
            rows="3"
            maxLength="500"
            required
          />
          <div className="text-xs text-gray-400 mt-1 text-right">
            {formData.reason.length}/500 caracteres
          </div>
        </div>

        {/* Botón Enviar */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 !rounded-button"
        >
          <i className="ri-calendar-check-line mr-2"></i>
          Agendar Cita
        </button>
      </form>

      {/* Información de Horarios */}
      {formData.person && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <h4 className="font-semibold text-gray-700 mb-2">
            <i className="ri-information-line mr-2"></i>
            Horario de {formData.person}
          </h4>
          {workSchedules[formData.person] && (
            <div className="text-sm text-gray-600">
              <p> Horario: {workSchedules[formData.person].start} - {workSchedules[formData.person].end}</p>
              <p> Descanso: {workSchedules[formData.person].breaks.join(', ')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
