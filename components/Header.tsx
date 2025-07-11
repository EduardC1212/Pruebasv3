
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { authService } from '../lib/database';

interface HeaderProps {
  title?: string;
}

export default function Header({ title }: HeaderProps) {
  const [user, setUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/auth/login';
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'worker':
        return 'bg-green-100 text-green-700';
      case 'user':
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'worker':
        return 'Trabajador';
      case 'user':
      default:
        return 'Usuario';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center space-x-3">
          <Link href="/" className="text-2xl font-pacifico text-blue-600">
            logo
          </Link>
          {title && (
            <>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
            </>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {user && (
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
              {getRoleLabel(user.role)}
            </div>
          )}
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors !rounded-button"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-menu-line"></i>
              </div>
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                {user && (
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="font-medium text-gray-800">{user.name} {user.lastName}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                )}
                
                <Link
                  href="/profile"
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowMenu(false)}
                >
                  <i className="ri-user-line mr-3"></i>
                  Mi Perfil
                </Link>
                
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowMenu(false)}
                  >
                    <i className="ri-settings-line mr-3"></i>
                    Administración
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                >
                  <i className="ri-logout-circle-line mr-3"></i>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
