'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-lock-line text-2xl text-blue-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Requerido</h2>
          <p className="text-gray-600 mb-8">
            Necesitas iniciar sesión para acceder a esta página
          </p>
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="block w-full py-3 bg-blue-600 text-white font-medium !rounded-button hover:bg-blue-700 transition-colors"
            >
              Iniciar Sesión
            </Link>
            <Link
              href="/auth/register"
              className="block w-full py-3 border border-gray-300 text-gray-700 !rounded-button hover:bg-gray-50 transition-colors"
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!requireAuth && isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="ri-check-line text-2xl text-green-600"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ya tienes sesión activa</h2>
          <p className="text-gray-600 mb-8">
            Bienvenido de vuelta, {user?.name}
          </p>
          <Link
            href="/"
            className="block w-full py-3 bg-green-600 text-white font-medium !rounded-button hover:bg-green-700 transition-colors"
          >
            Ir al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}