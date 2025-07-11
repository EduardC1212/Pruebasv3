
'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getAllWorkers, getAllAppointments, getAllTimeEntries } from '../../lib/database';

interface ReportData {
  totalWorkers: number;
  activeWorkers: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  cancelledAppointments: number;
  totalHoursWorked: number;
  averageHoursPerWorker: number;
}

export default function ReportsSection() {
  const [reportData, setReportData] = useState<ReportData>({
    totalWorkers: 0,
    activeWorkers: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    cancelledAppointments: 0,
    totalHoursWorked: 0,
    averageHoursPerWorker: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    generateReports();
  }, [dateRange]);

  const generateReports = () => {
    const workers = getAllWorkers();
    const appointments = getAllAppointments();
    const timeEntries = getAllTimeEntries();

    const filteredAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return aptDate >= startDate && aptDate <= endDate;
    });

    const filteredTimeEntries = timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return entryDate >= startDate && entryDate <= endDate;
    });

    const totalHours = filteredTimeEntries.reduce((sum, entry) => sum + entry.hours, 0);
    const activeWorkers = workers.filter(w => w.isActive).length;

    setReportData({
      totalWorkers: workers.length,
      activeWorkers,
      totalAppointments: filteredAppointments.length,
      pendingAppointments: filteredAppointments.filter(apt => apt.status === 'pending').length,
      confirmedAppointments: filteredAppointments.filter(apt => apt.status === 'confirmed').length,
      cancelledAppointments: filteredAppointments.filter(apt => apt.status === 'cancelled').length,
      totalHoursWorked: totalHours,
      averageHoursPerWorker: activeWorkers > 0 ? totalHours / activeWorkers : 0
    });

    const departmentData = workers.reduce((acc: any, worker) => {
      if (!acc[worker.department]) {
        acc[worker.department] = { name: worker.department, workers: 0, hours: 0 };
      }
      acc[worker.department].workers += 1;
      
      const workerHours = filteredTimeEntries
        .filter(entry => entry.workerId === worker.id)
        .reduce((sum, entry) => sum + entry.hours, 0);
      acc[worker.department].hours += workerHours;
      
      return acc;
    }, {});

    setChartData(Object.values(departmentData));
  };

  const exportData = (format: 'csv' | 'json') => {
    const workers = getAllWorkers();
    const appointments = getAllAppointments();
    const timeEntries = getAllTimeEntries();

    const data = {
      workers,
      appointments: appointments.filter(apt => {
        const aptDate = new Date(apt.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return aptDate >= startDate && aptDate <= endDate;
      }),
      timeEntries: timeEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        return entryDate >= startDate && entryDate <= endDate;
      }),
      summary: reportData
    };

    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === 'csv') {
      const csvContent = [
        'Resumen del Reporte',
        `Total Trabajadores,${reportData.totalWorkers}`,
        `Trabajadores Activos,${reportData.activeWorkers}`,
        `Total Citas,${reportData.totalAppointments}`,
        `Citas Pendientes,${reportData.pendingAppointments}`,
        `Citas Confirmadas,${reportData.confirmedAppointments}`,
        `Citas Canceladas,${reportData.cancelledAppointments}`,
        `Total Horas Trabajadas,${reportData.totalHoursWorked.toFixed(2)}`,
        `Promedio Horas por Trabajador,${reportData.averageHoursPerWorker.toFixed(2)}`
      ].join('\n');
      
      content = csvContent;
      filename = `reporte_${dateRange.start}_${dateRange.end}.csv`;
      mimeType = 'text/csv';
    } else {
      content = JSON.stringify(data, null, 2);
      filename = `reporte_${dateRange.start}_${dateRange.end}.json`;
      mimeType = 'application/json';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Reportes y Estadísticas</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => exportData('csv')}
            className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm !rounded-button"
          >
            <i className="ri-file-excel-line mr-1"></i>
            CSV
          </button>
          <button
            onClick={() => exportData('json')}
            className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm !rounded-button"
          >
            <i className="ri-file-code-line mr-1"></i>
            JSON
          </button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <h3 className="font-medium text-gray-800 mb-3">Rango de Fechas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Trabajadores</p>
              <p className="text-2xl font-bold text-gray-800">{reportData.totalWorkers}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="ri-team-line text-blue-600"></i>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {reportData.activeWorkers} activos
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Citas</p>
              <p className="text-2xl font-bold text-gray-800">{reportData.totalAppointments}</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="ri-calendar-line text-green-600"></i>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {reportData.confirmedAppointments} confirmadas
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Horas Trabajadas</p>
              <p className="text-2xl font-bold text-gray-800">{reportData.totalHoursWorked.toFixed(1)}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="ri-time-line text-purple-600"></i>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {reportData.averageHoursPerWorker.toFixed(1)} promedio
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Citas Pendientes</p>
              <p className="text-2xl font-bold text-gray-800">{reportData.pendingAppointments}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="ri-clock-line text-yellow-600"></i>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {reportData.cancelledAppointments} canceladas
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Horas Trabajadas por Departamento</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
