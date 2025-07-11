
'use client';

import Header from '../../components/Header';
import Navigation from '../../components/Navigation';
import ProfileHeader from './ProfileHeader';
import TimeTracking from './TimeTracking';
import TimeHistory from './TimeHistory';
import AuthGuard from '../../components/AuthGuard';
import RoleGuard from '../../components/RoleGuard';
import { useState, useEffect } from 'react';
import { authService } from '../../lib/database';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('perfil');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const getAvailableTabs = () => {
    if (!user) return [];

    const baseTabs = [
      { id: 'perfil', name: 'Perfil', roles: ['user', 'worker', 'admin'] }
    ];

    const workerTabs = [
      { id: 'tiempo', name: 'Tiempo', roles: ['worker', 'admin'] },
      { id: 'historial', name: 'Historial', roles: ['worker', 'admin'] }
    ];

    return [...baseTabs, ...workerTabs].filter(tab => 
      tab.roles.includes(user.role)
    );
  };

  const availableTabs = getAvailableTabs();

  // Si el tab actual no está disponible para el rol, cambiar a perfil
  useEffect(() => {
    if (user && !availableTabs.find(tab => tab.id === activeTab)) {
      setActiveTab('perfil');
    }
  }, [user, availableTabs, activeTab]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header title="Mi Perfil" />
        
        <div className="pt-20 pb-20 px-4">
          <ProfileHeader />
          
          {availableTabs.length > 1 && (
            <div className="mt-6">
              <div className="flex bg-gray-100 rounded-full p-1">
                {availableTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            {activeTab === 'perfil' && <ProfileForm />}
            
            <RoleGuard requiredModule="time-tracking">
              {activeTab === 'tiempo' && <TimeTracking />}
              {activeTab === 'historial' && <TimeHistory />}
            </RoleGuard>
          </div>
        </div>
        
        <Navigation />
      </div>
    </AuthGuard>
  );
}

function ProfileForm() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: ''
  });

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setProfile({
        name: `${currentUser.name} ${currentUser.lastName || ''}`.trim(),
        email: currentUser.email,
        phone: currentUser.phone,
        position: currentUser.position,
        department: currentUser.department
      });
    }
  }, []);

  const handleSave = () => {
    // En un sistema real, aquí actualizarías los datos del usuario
    alert('Cambios guardados correctamente');
  };

  const isReadOnly = user?.role === 'user';

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
        
        {user?.role === 'user' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-blue-700 text-sm">
              <i className="ri-information-line mr-2"></i>
              Como usuario, puedes ver tu información pero no modificarla. Contacta al administrador para cambios.
            </p>
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre completo
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => !isReadOnly && setProfile({...profile, name: e.target.value})}
              className={`w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-gray-900 ${
                isReadOnly ? 'cursor-not-allowed opacity-60' : ''
              }`}
              readOnly={isReadOnly}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => !isReadOnly && setProfile({...profile, email: e.target.value})}
              className={`w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-gray-900 ${
                isReadOnly ? 'cursor-not-allowed opacity-60' : ''
              }`}
              readOnly={isReadOnly}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => !isReadOnly && setProfile({...profile, phone: e.target.value})}
              className={`w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-gray-900 ${
                isReadOnly ? 'cursor-not-allowed opacity-60' : ''
              }`}
              readOnly={isReadOnly}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cargo
            </label>
            <input
              type="text"
              value={profile.position}
              onChange={(e) => !isReadOnly && setProfile({...profile, position: e.target.value})}
              className={`w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-gray-900 ${
                isReadOnly ? 'cursor-not-allowed opacity-60' : ''
              }`}
              readOnly={isReadOnly}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departamento
            </label>
            <input
              type="text"
              value={profile.department}
              onChange={(e) => !isReadOnly && setProfile({...profile, department: e.target.value})}
              className={`w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-gray-900 ${
                isReadOnly ? 'cursor-not-allowed opacity-60' : ''
              }`}
              readOnly={isReadOnly}
            />
          </div>
        </div>
        
        {!isReadOnly && (
          <button 
            onClick={handleSave}
            className="w-full mt-6 py-3 bg-blue-600 text-white font-medium !rounded-button hover:bg-blue-700 transition-colors"
          >
            Guardar Cambios
          </button>
        )}

        {user?.role === 'user' && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="font-medium text-gray-800 mb-3">Información del Rol</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="ri-user-line text-purple-600"></i>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Usuario/Cliente</p>
                  <p className="text-sm text-gray-600">Puedes agendar citas y ver perfiles de trabajadores</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
