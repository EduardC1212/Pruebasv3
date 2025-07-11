'use client';

import { useEffect, useState } from 'react';
import { authService } from '../lib/database';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  requiredModule?: string;
  fallback?: React.ReactNode;
}

export default function RoleGuard({ 
  children, 
  requiredRole, 
  requiredModule, 
  fallback 
}: RoleGuardProps) {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAccess = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);

      if (!currentUser) {
        setHasAccess(false);
        return;
      }

      let access = true;

      if (requiredRole) {
        access = access && authService.hasRole(requiredRole);
      }

      if (requiredModule) {
        access = access && authService.canAccessModule(requiredModule);
      }

      setHasAccess(access);
    };

    checkAccess();
  }, [requiredRole, requiredModule]);

  if (hasAccess === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="ri-lock-line text-2xl text-red-600"></i>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Acceso Restringido</h3>
        <p className="text-gray-600">
          No tienes permisos para acceder a esta sección
        </p>
        <div className="text-sm text-gray-500 mt-2">
          Tu rol actual: <span className="font-medium capitalize">{user?.role}</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}