
'use client';

type Appointment = {
  id: string;
  date: string;
  time: string;
  participant: string;
  reason: string;
  status: 'confirmada' | 'pendiente' | string;
};

type Props = {
  appointments: Appointment[];
};
import { useState } from 'react';

export default function AppointmentCalendar({ appointments }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevMonthDay = new Date(year, month, -i);
      days.push({
        date: prevMonthDay,
        isCurrentMonth: false,
        day: prevMonthDay.getDate()
      });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDay = new Date(year, month, day);
      days.push({
        date: currentDay,
        isCurrentMonth: true,
        day: day
      });
    }

    // Días del próximo mes para completar la grilla
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextMonthDay = new Date(year, month + 1, day);
      days.push({
        date: nextMonthDay,
        isCurrentMonth: false,
        day: day
      });
    }

    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = formatDate(date);
    return appointments.filter(apt => apt.date === dateStr);
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const todayStr = formatDate(today);

  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header del Calendario */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <i className="ri-arrow-left-s-line text-lg"></i>
          </button>
          
          <div className="text-center">
            <h2 className="text-xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          
          <button
            onClick={() => navigateMonth(1)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <i className="ri-arrow-right-s-line text-lg"></i>
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium py-2">
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Grilla del Calendario */}
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {days.map((dayInfo, index) => {
            const dateStr = formatDate(dayInfo.date);
            const dayAppointments = getAppointmentsForDate(dayInfo.date);
            const isToday = dateStr === todayStr;
            const isSelected = selectedDate && formatDate(selectedDate) === dateStr;

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(dayInfo.date)}
                className={`
                  relative p-2 h-12 text-sm rounded-lg transition-all duration-200
                  ${!dayInfo.isCurrentMonth ? 'text-gray-300' : ''}
                  ${isToday ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold' : ''}
                  ${isSelected && !isToday ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                  ${!isToday && !isSelected ? 'hover:bg-gray-100' : ''}
                `}
              >
                <span>{dayInfo.day}</span>
                {dayAppointments.length > 0 && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className={`w-2 h-2 rounded-full ${
                      isToday ? 'bg-white' : 'bg-orange-500'
                    }`}></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Citas del Día Seleccionado */}
      {selectedDate && (
        <div className="border-t border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-3">
            <i className="ri-calendar-event-line mr-2"></i>
            Citas para {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
          </h3>
          
          {selectedDateAppointments.length > 0 ? (
            <div className="space-y-3">
              {selectedDateAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-l-4 border-blue-500"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="ri-time-line text-white"></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-blue-600">
                        {appointment.time}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'confirmada'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <p className="text-gray-800 font-medium text-sm">
                      {appointment.participant}
                    </p>
                    <p className="text-gray-600 text-xs">
                      {appointment.reason}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              <i className="ri-calendar-line text-2xl mb-2 block"></i>
              No hay citas programadas para este día
            </p>
          )}
        </div>
      )}
    </div>
  );
}
