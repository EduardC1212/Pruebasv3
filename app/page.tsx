
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import AuthGuard from '../components/AuthGuard';
import { authService } from '../lib/database';

export default function HomePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const getDashboardContent = () => {
    if (!user) return null;

    switch (user.role) {
      case 'admin':
        return <AdminDashboard user={user} />;
      case 'worker':
        return <WorkerDashboard user={user} />;
      case 'user':
        return <UserDashboard user={user} />;
      default:
        return <UserDashboard user={user} />;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header />
        
        <main className="pt-16 pb-20 px-4">
          <div className="max-w-md mx-auto">
            {getDashboardContent()}
          </div>
        </main>

        <Navigation />
      </div>
    </AuthGuard>
  );
}

function AdminDashboard({ user }: { user: any }) {
  const quickActions = [
    {
      title: 'Gestión de Trabajadores',
      description: 'Administrar perfiles y horarios',
      href: '/admin',
      icon: 'ri-team-line',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Gestión de Citas',
      description: 'Ver y administrar todas las citas',
      href: '/admin',
      icon: 'ri-calendar-event-line',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Reportes',
      description: 'Estadísticas y análisis',
      href: '/admin',
      icon: 'ri-bar-chart-line',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Mi Perfil',
      description: 'Configurar mi cuenta',
      href: '/profile',
      icon: 'ri-user-settings-line',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <i className="ri-shield-star-line text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Bienvenido, {user.name}
            </h2>
            <p className="text-gray-600">Panel de Administración</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">24</div>
            <div className="text-xs text-gray-600">Trabajadores</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">127</div>
            <div className="text-xs text-gray-600">Citas este mes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">98%</div>
            <div className="text-xs text-gray-600">Eficiencia</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-3`}>
              <i className={`${action.icon} text-white text-xl`}></i>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm mb-1">
              {action.title}
            </h3>
            <p className="text-gray-600 text-xs">{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function WorkerDashboard({ user }: { user: any }) {
  const quickActions = [
    {
      title: 'Mis Citas',
      description: 'Ver citas programadas',
      href: '/appointments',
      icon: 'ri-calendar-check-line',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Registro de Tiempo',
      description: 'Marcar entrada y salida',
      href: '/profile',
      icon: 'ri-time-line',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Mi Perfil',
      description: 'Ver mi información',
      href: '/profile',
      icon: 'ri-user-line',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
            <i className="ri-briefcase-line text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Hola, {user.name}
            </h2>
            <p className="text-gray-600">{user.position}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">8.5h</div>
            <div className="text-xs text-gray-600">Hoy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">5</div>
            <div className="text-xs text-gray-600">Citas pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">42h</div>
            <div className="text-xs text-gray-600">Esta semana</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all flex items-center space-x-4"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center`}>
              <i className={`${action.icon} text-white text-xl`}></i>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-arrow-right-line text-gray-400"></i>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function UserDashboard({ user }: { user: any }) {
  const quickActions = [
    {
      title: 'Agendar Cita',
      description: 'Programa una nueva reunión',
      href: '/appointments',
      icon: 'ri-calendar-event-line',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Mis Citas',
      description: 'Ver citas programadas',
      href: '/appointments',
      icon: 'ri-calendar-check-line',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Mi Perfil',
      description: 'Ver mi información',
      href: '/profile',
      icon: 'ri-user-line',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <i className="ri-user-smile-line text-white text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Bienvenido, {user.name}
            </h2>
            <p className="text-gray-600">Panel de Usuario</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">3</div>
            <div className="text-xs text-gray-600">Citas pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">12</div>
            <div className="text-xs text-gray-600">Citas completadas</div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all flex items-center space-x-4"
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center`}>
              <i className={`${action.icon} text-white text-xl`}></i>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{action.title}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </div>
            <div className="w-6 h-6 flex items-center justify-center">
              <i className="ri-arrow-right-line text-gray-400"></i>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
