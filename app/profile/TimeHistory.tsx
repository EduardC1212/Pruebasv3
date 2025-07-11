'use client';

import { useState } from 'react';

export default function TimeHistory() {
  const [viewMode, setViewMode] = useState('table');
  
  const timeEntries = [
    { id: 1, date: '2024-01-15', hours: 8.5, description: 'Desarrollo de componentes React' },
    { id: 2, date: '2024-01-14', hours: 7.0, description: 'Reuniones y planificación' },
    { id: 3, date: '2024-01-13', hours: 8.0, description: 'Corrección de bugs y testing' },
    { id: 4, date: '2024-01-12', hours: 9.0, description: 'Implementación de API' },
    { id: 5, date: '2024-01-11', hours: 7.5, description: 'Documentación técnica' },
    { id: 6, date: '2024-01-10', hours: 8.0, description: 'Desarrollo frontend' },
    { id: 7, date: '2024-01-09', hours: 6.5, description: 'Revisión de código' },
  ];

  const weeklyData = [
    { week: 'Sem 3', hours: 42 },
    { week: 'Sem 2', hours: 38 },
    { week: 'Sem 1', hours: 45 },
  ];

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Historial de Tiempo</h3>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Tabla
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1 rounded text-sm font-medium transition-all ${
                viewMode === 'chart'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Gráfico
            </button>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalHours}h</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">5.8h</div>
              <div className="text-xs text-gray-600">Promedio/día</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">40.5h</div>
              <div className="text-xs text-gray-600">Esta semana</div>
            </div>
          </div>
        </div>

        {viewMode === 'table' ? (
          <div className="space-y-3">
            {timeEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">
                      {new Date(entry.date).toLocaleDateString('es-ES', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </span>
                    <span className="font-semibold text-blue-600">{entry.hours}h</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <img
              src="https://readdy.ai/api/search-image?query=Modern%20bar%20chart%20showing%20weekly%20work%20hours%20data%20visualization%2C%20clean%20minimal%20design%20with%20blue%20gradients%2C%20professional%20business%20analytics%20dashboard%20style%2C%20white%20background%2C%20high%20quality%20digital%20illustration%2C%20data%20bars%20showing%20progress%20from%2035%20to%2045%20hours%2C%20labeled%20axes%2C%20contemporary%20UI%20design&width=300&height=200&seq=time-chart&orientation=landscape"
              alt="Gráfico de horas trabajadas"
              className="w-full h-48 object-cover rounded-lg"
            />
            
            <div className="space-y-2">
              {weeklyData.map((week, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{week.week}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(week.hours / 50) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{week.hours}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}