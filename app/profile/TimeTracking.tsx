'use client';

import { useState } from 'react';

export default function TimeTracking() {
  const [workTime, setWorkTime] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    breakTime: '60',
    description: ''
  });
  
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState({
    startTime: null as Date | null,
    elapsed: 0
  });

  const handleStartTracking = () => {
    setIsTracking(true);
    setCurrentSession({
      startTime: new Date(),
      elapsed: 0
    });
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    setCurrentSession({
      startTime: null,
      elapsed: 0
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const calculateHours = () => {
    if (!workTime.startTime || !workTime.endTime) return 0;
    const start = new Date(`2024-01-01T${workTime.startTime}`);
    const end = new Date(`2024-01-01T${workTime.endTime}`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60);
    return Math.max(0, diff - parseInt(workTime.breakTime || '0'));
  };

  return (
    <div className="space-y-6">
      {/* Tracking en tiempo real */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Registro en Tiempo Real</h3>
        
        <div className="text-center py-8">
          <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-4 ${
            isTracking ? 'bg-red-50 border-4 border-red-200' : 'bg-green-50 border-4 border-green-200'
          }`}>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {isTracking ? formatTime(currentSession.elapsed) : '00:00'}
              </div>
              <div className="text-sm text-gray-600">
                {isTracking ? 'Trabajando' : 'Detenido'}
              </div>
            </div>
          </div>
          
          <button
            onClick={isTracking ? handleStopTracking : handleStartTracking}
            className={`px-8 py-3 font-medium !rounded-button transition-colors ${
              isTracking
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isTracking ? 'Detener' : 'Iniciar'}
          </button>
        </div>
      </div>

      {/* Registro manual */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Registro Manual</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={workTime.date}
              onChange={(e) => setWorkTime({...workTime, date: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-gray-900"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora inicio
              </label>
              <input
                type="time"
                value={workTime.startTime}
                onChange={(e) => setWorkTime({...workTime, startTime: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-gray-900"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora fin
              </label>
              <input
                type="time"
                value={workTime.endTime}
                onChange={(e) => setWorkTime({...workTime, endTime: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-gray-900"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiempo de descanso (minutos)
            </label>
            <input
              type="number"
              value={workTime.breakTime}
              onChange={(e) => setWorkTime({...workTime, breakTime: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-gray-900"
              placeholder="60"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              value={workTime.description}
              onChange={(e) => setWorkTime({...workTime, description: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 border-none rounded-lg text-gray-900 resize-none"
              rows={3}
              placeholder="Describe las actividades realizadas..."
              maxLength={500}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {workTime.description.length}/500
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total de horas:</span>
              <span className="text-lg font-bold text-blue-600">
                {formatTime(calculateHours())}
              </span>
            </div>
          </div>
          
          <button className="w-full py-3 bg-blue-600 text-white font-medium !rounded-button hover:bg-blue-700 transition-colors">
            Registrar Tiempo
          </button>
        </div>
      </div>
    </div>
  );
}