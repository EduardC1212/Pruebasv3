
'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import AuthGuard from '../../components/AuthGuard';
import AppointmentForm from './AppointmentForm';
import AppointmentCalendar from './AppointmentCalendar';
import AppointmentList from './AppointmentList';
import { authService } from '../../lib/database';

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      date: '2024-12-20',
      time: '09:00',
      participant: 'Ana García',
      reason: 'Reunión de proyecto',
      status: 'confirmada'
    },
    {
      id: 2,
      date: '2024-12-22',
      time: '14:30',
      participant: 'Carlos López',
      reason: 'Revisión de presupuesto',
      status: 'pendiente'
    },
    {
      id: 3,
      date: '2024-12-23',
      time: '11:00',
      participant: 'María Rodríguez',
      reason: 'Entrevista técnica',
      status: 'confirmada'
    }
  ]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const getAvailableTabs = () => {
    if (!user) return [];

    const baseTabs = [
      { id: 'calendar', name: 'Calendario', icon: 'ri-calendar-line', roles: ['user', 'worker', 'admin'] },
      { id: 'list', name: 'Mis Citas', icon: 'ri-list-check', roles: ['user', 'worker', 'admin'] }
    ];

    // Solo usuarios y admins pueden agendar nuevas citas
    if (user.role === 'user' || user.role === 'admin') {
      baseTabs.splice(1, 0, { id: 'form', name: 'Agendar', icon: 'ri-add-line', roles: ['user', 'admin'] });
    }

    return baseTabs.filter(tab => tab.roles.includes(user.role));
  };

  const availableTabs = getAvailableTabs();

  const handleNewAppointment = (newAppointment) => {
    const appointment = {
      id: appointments.length + 1,
      ...newAppointment,
      status: 'pendiente'
    };
    setAppointments([...appointments, appointment]);
    setActiveTab('calendar');
  };

  const getRoleTitle = () => {
    switch (user?.role) {
      case 'admin':
        return 'Gestión de Citas - Administrador';
      case 'worker':
        return 'Mis Citas - Trabajador';
      case 'user':
      default:
        return 'Citas';
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header title={getRoleTitle()} />
        
        <main className="pt-16 pb-20 px-4">
          <div className="max-w-md mx-auto">
            {user?.role === 'worker' && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="ri-briefcase-line text-blue-600"></i>
                  </div>
                  <div>
                    <p className="font-medium text-blue-800">Modo Trabajador</p>
                    <p className="text-blue-600 text-sm">Puedes ver y gestionar las citas que tienes programadas contigo</p>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-2xl p-1 mb-6 shadow-sm">
              <div className={`grid gap-1 ${availableTabs.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {availableTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-5 h-5 flex items-center justify-center mb-1">
                        <i className={`${tab.icon} text-lg`}></i>
                      </div>
                      <span className="text-xs font-medium">{tab.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            {activeTab === 'calendar' && (
              <AppointmentCalendar appointments={appointments} userRole={user?.role} />
            )}
            
            {activeTab === 'form' && (user?.role === 'user' || user?.role === 'admin') && (
              <AppointmentForm onSubmit={handleNewAppointment} />
            )}
            
            {activeTab === 'list' && (
              <AppointmentList 
                appointments={appointments} 
                setAppointments={setAppointments}
                userRole={user?.role}
              />
            )}
          </div>
        </main>

        <Navigation />
      </div>
    </AuthGuard>
  );
}
