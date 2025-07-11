
'use client';

import Link from 'next/link';

export default function AdminHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-pacifico text-blue-600">
              logo
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h2 className="text-lg font-semibold text-gray-800">Administración</h2>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              <i className="ri-shield-check-line mr-1"></i>
              Supervisor
            </div>
            <Link 
              href="/"
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors !rounded-button"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-home-line"></i>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
