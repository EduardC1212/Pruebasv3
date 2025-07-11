
'use client';

import { useState } from 'react';
import AdminHeader from './AdminHeader';
import WorkerManagement from './WorkerManagement';
import AppointmentManagement from './AppointmentManagement';
import ReportsSection from './ReportsSection';
import AuthGuard from '../../components/AuthGuard';
import RoleGuard from '../../components/RoleGuard';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('workers');

  return (
    <AuthGuard>
      <RoleGuard requiredRole="admin">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
          <AdminHeader />
          
          <main className="pt-20 pb-6 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel de Administración</h1>
                
                <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab('workers')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all !rounded-button ${
                      activeTab === 'workers'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <i className="ri-team-line mr-2"></i>
                    Trabajadores
                  </button>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all !rounded-button ${
                      activeTab === 'appointments'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <i className="ri-calendar-line mr-2"></i>
                    Citas
                  </button>
                  <button
                    onClick={() => setActiveTab('reports')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all !rounded-button ${
                      activeTab === 'reports'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <i className="ri-bar-chart-line mr-2"></i>
                    Reportes
                  </button>
                </div>

                {activeTab === 'workers' && <WorkerManagement />}
                {activeTab === 'appointments' && <AppointmentManagement />}
                {activeTab === 'reports' && <ReportsSection />}
              </div>
            </div>
          </main>
        </div>
      </RoleGuard>
    </AuthGuard>
  );
}
