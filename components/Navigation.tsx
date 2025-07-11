
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authService } from '../lib/database';

export default function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  if (!user) return null;

  const getNavigationItems = () => {
    const baseItems = [
      {
        id: 'dashboard',
        name: 'Inicio',
        href: '/',
        icon: 'ri-home-line',
        activeIcon: 'ri-home-fill',
        roles: ['user', 'worker', 'admin']
      }
    ];

    const roleBasedItems = [
      {
        id: 'profile',
        name: 'Perfil',
        href: '/profile',
        icon: 'ri-user-line',
        activeIcon: 'ri-user-fill',
        roles: ['user', 'worker', 'admin']
      },
      {
        id: 'appointments',
        name: 'Citas',
        href: '/appointments',
        icon: 'ri-calendar-line',
        activeIcon: 'ri-calendar-fill',
        roles: ['user', 'worker', 'admin']
      }
    ];

    const adminItems = [
      {
        id: 'admin',
        name: 'Admin',
        href: '/admin',
        icon: 'ri-settings-line',
        activeIcon: 'ri-settings-fill',
        roles: ['admin']
      }
    ];

    const allItems = [...baseItems, ...roleBasedItems, ...adminItems];
    
    return allItems.filter(item => item.roles.includes(user.role));
  };

  const navigationItems = getNavigationItems();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="grid grid-cols-4 h-16">
        {navigationItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
              isActive(item.href)
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={`text-lg ${isActive(item.href) ? item.activeIcon : item.icon}`}></i>
            </div>
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
