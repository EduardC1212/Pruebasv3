
interface Worker {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  workSchedule: {
    start: string;
    end: string;
    breakStart: string;
    breakEnd: string;
  };
  isActive: boolean;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  person: string;
  department: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdBy: string;
  createdAt: string;
}

interface TimeEntry {
  id: string;
  workerId: string;
  date: string;
  hours: number;
  startTime?: string;
  endTime?: string;
  description?: string;
}

const STORAGE_KEYS = {
  WORKERS: 'app_workers',
  APPOINTMENTS: 'app_appointments',
  TIME_ENTRIES: 'app_time_entries'
};

export const saveWorkerData = (workerData: Worker | Omit<Worker, 'id'>) => {
  if (typeof window === 'undefined') return;

  const workers = getAllWorkers();

  if ('id' in workerData) {
    const index = workers.findIndex(w => w.id === workerData.id);
    if (index !== -1) {
      workers[index] = workerData;
    }
  } else {
    const newWorker: Worker = {
      ...workerData,
      id: generateId()
    };
    workers.push(newWorker);
  }

  localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(workers));
  initializeDefaultData();
};

export const getAllWorkers = (): Worker[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEYS.WORKERS);
  if (!stored) {
    const defaultWorkers = getDefaultWorkers();
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(defaultWorkers));
    return defaultWorkers;
  }
  return JSON.parse(stored);
};

export const deleteWorker = (workerId: string) => {
  if (typeof window === 'undefined') return;

  const workers = getAllWorkers();
  const updatedWorkers = workers.filter(w => w.id !== workerId);
  localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(updatedWorkers));
};

export const saveAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt'>) => {
  if (typeof window === 'undefined') return;

  const appointments = getAllAppointments();
  const newAppointment: Appointment = {
    ...appointmentData,
    id: generateId(),
    createdAt: new Date().toISOString()
  };

  appointments.push(newAppointment);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
};

export const getAllAppointments = (): Appointment[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  if (!stored) {
    const defaultAppointments = getDefaultAppointments();
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(defaultAppointments));
    return defaultAppointments;
  }
  return JSON.parse(stored);
};

export const updateAppointment = (appointmentId: string, updates: Partial<Appointment>) => {
  if (typeof window === 'undefined') return;

  const appointments = getAllAppointments();
  const index = appointments.findIndex(a => a.id === appointmentId);

  if (index !== -1) {
    appointments[index] = { ...appointments[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }
};

export const deleteAppointment = (appointmentId: string) => {
  if (typeof window === 'undefined') return;

  const appointments = getAllAppointments();
  const updatedAppointments = appointments.filter(a => a.id !== appointmentId);
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updatedAppointments));
};

export const saveTimeEntry = (timeEntryData: Omit<TimeEntry, 'id'>) => {
  if (typeof window === 'undefined') return;

  const timeEntries = getAllTimeEntries();
  const newTimeEntry: TimeEntry = {
    ...timeEntryData,
    id: generateId()
  };

  timeEntries.push(newTimeEntry);
  localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(timeEntries));
};

export const getAllTimeEntries = (): TimeEntry[] => {
  if (typeof window === 'undefined') return [];

  const stored = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
  if (!stored) {
    const defaultTimeEntries = getDefaultTimeEntries();
    localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(defaultTimeEntries));
    return defaultTimeEntries;
  }
  return JSON.parse(stored);
};

export const getWorkerSchedule = (workerId: string) => {
  const workers = getAllWorkers();
  const worker = workers.find(w => w.id === workerId);
  return worker?.workSchedule;
};

export const getAvailableTimeSlots = (date: string, personId: string) => {
  const workers = getAllWorkers();
  const person = workers.find(w => w.id === personId);

  if (!person) return [];

  const appointments = getAllAppointments();
  const dayAppointments = appointments.filter(apt =>
    apt.date === date && apt.person === person.name && apt.status !== 'cancelled'
  );

  const { start, end, breakStart, breakEnd } = person.workSchedule;

  const slots = [];
  const startHour = parseInt(start.split(':')[0]);
  const startMin = parseInt(start.split(':')[1]);
  const endHour = parseInt(end.split(':')[0]);
  const endMin = parseInt(end.split(':')[1]);
  const breakStartHour = parseInt(breakStart.split(':')[0]);
  const breakStartMin = parseInt(breakStart.split(':')[1]);
  const breakEndHour = parseInt(breakEnd.split(':')[0]);
  const breakEndMin = parseInt(breakEnd.split(':')[1]);

  for (let hour = startHour; hour < endHour; hour++) {
    for (let min = 0; min < 60; min += 30) {
      if (hour === endHour && min >= endMin) break;
      if (hour === startHour && min < startMin) continue;

      const timeSlot = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      const currentTime = hour * 60 + min;
      const breakStartTime = breakStartHour * 60 + breakStartMin;
      const breakEndTime = breakEndHour * 60 + breakEndMin;

      if (currentTime >= breakStartTime && currentTime < breakEndTime) continue;

      const isBooked = dayAppointments.some(apt => apt.time === timeSlot);
      if (!isBooked) {
        slots.push(timeSlot);
      }
    }
  }

  return slots;
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const getDefaultWorkers = (): Worker[] => [
  {
    id: 'worker_1',
    name: 'María González',
    email: 'maria.gonzalez@empresa.com',
    phone: '+1234567890',
    position: 'Gerente de RRHH',
    department: 'Recursos Humanos',
    workSchedule: {
      start: '08:00',
      end: '17:00',
      breakStart: '12:00',
      breakEnd: '13:00'
    },
    isActive: true
  },
  {
    id: 'worker_2',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@empresa.com',
    phone: '+1234567891',
    position: 'Desarrollador Senior',
    department: 'Desarrollo',
    workSchedule: {
      start: '09:00',
      end: '18:00',
      breakStart: '13:00',
      breakEnd: '14:00'
    },
    isActive: true
  },
  {
    id: 'worker_3',
    name: 'Ana Martínez',
    email: 'ana.martinez@empresa.com',
    phone: '+1234567892',
    position: 'Especialista en Marketing',
    department: 'Marketing',
    workSchedule: {
      start: '08:30',
      end: '17:30',
      breakStart: '12:30',
      breakEnd: '13:30'
    },
    isActive: true
  },
  {
    id: 'worker_4',
    name: 'Luis Fernández',
    email: 'luis.fernandez@empresa.com',
    phone: '+1234567893',
    position: 'Contador',
    department: 'Finanzas',
    workSchedule: {
      start: '08:00',
      end: '16:00',
      breakStart: '12:00',
      breakEnd: '13:00'
    },
    isActive: true
  },
  {
    id: 'worker_5',
    name: 'Elena López',
    email: 'elena.lopez@empresa.com',
    phone: '+1234567894',
    position: 'Ejecutiva de Ventas',
    department: 'Ventas',
    workSchedule: {
      start: '09:00',
      end: '17:00',
      breakStart: '13:00',
      breakEnd: '14:00'
    },
    isActive: true
  }
];

const getDefaultAppointments = (): Appointment[] => [
  {
    id: 'apt_1',
    date: '2024-01-15',
    time: '10:00',
    person: 'María González',
    department: 'Recursos Humanos',
    reason: 'Reunión de evaluación de desempeño',
    status: 'confirmed',
    createdBy: 'Juan Pérez',
    createdAt: '2024-01-10T09:00:00Z'
  },
  {
    id: 'apt_2',
    date: '2024-01-16',
    time: '14:30',
    person: 'Carlos Rodríguez',
    department: 'Desarrollo',
    reason: 'Revisión de proyecto de desarrollo',
    status: 'pending',
    createdBy: 'Ana Silva',
    createdAt: '2024-01-12T11:30:00Z'
  },
  {
    id: 'apt_3',
    date: '2024-01-17',
    time: '11:00',
    person: 'Ana Martínez',
    department: 'Marketing',
    reason: 'Planificación de campaña publicitaria',
    status: 'confirmed',
    createdBy: 'Pedro García',
    createdAt: '2024-01-13T16:15:00Z'
  }
];

const getDefaultTimeEntries = (): TimeEntry[] => [
  {
    id: 'time_1',
    workerId: 'worker_1',
    date: '2024-01-15',
    hours: 8,
    startTime: '08:00',
    endTime: '17:00',
    description: 'Trabajo regular'
  },
  {
    id: 'time_2',
    workerId: 'worker_2',
    date: '2024-01-15',
    hours: 9,
    startTime: '09:00',
    endTime: '18:00',
    description: 'Desarrollo de características'
  },
  {
    id: 'time_3',
    workerId: 'worker_3',
    date: '2024-01-15',
    hours: 8.5,
    startTime: '08:30',
    endTime: '17:30',
    description: 'Trabajo en campaña'
  }
];

const initializeDefaultData = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.WORKERS)) {
    localStorage.setItem(STORAGE_KEYS.WORKERS, JSON.stringify(getDefaultWorkers()));
  }

  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS)) {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(getDefaultAppointments()));
  }

  if (!localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES)) {
    localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(getDefaultTimeEntries()));
  }
};

// Funciones de autenticación
export const authService = {
  login: (email: string, password: string) => {
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (user) {
      // En un sistema real, verificarías la contraseña hash
      const loginData = {
        ...user,
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('user', JSON.stringify(loginData));
      return { success: true, user: loginData };
    }

    return { success: false, error: 'Credenciales inválidas' };
  },

  register: (userData: any) => {
    const users = getUsers();
    const existingUser = users.find(u => u.email === userData.email);

    if (existingUser) {
      return { success: false, error: 'El email ya está registrado' };
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      registrationDate: new Date().toISOString(),
      role: userData.role || 'user' // user, worker, admin
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login después del registro
    localStorage.setItem('user', JSON.stringify(newUser));

    return { success: true, user: newUser };
  },

  logout: () => {
    localStorage.removeItem('user');
    return { success: true };
  },

  getCurrentUser: () => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  },

  hasRole: (requiredRole: string) => {
    const user = authService.getCurrentUser();
    if (!user) return false;

    const roleHierarchy = {
      'admin': ['admin', 'worker', 'user'],
      'worker': ['worker', 'user'],
      'user': ['user']
    };

    return roleHierarchy[user.role]?.includes(requiredRole) || false;
  },

  canAccessModule: (module: string) => {
    const user = authService.getCurrentUser();
    if (!user) return false;

    const permissions = {
      'admin': ['dashboard', 'profile', 'appointments', 'admin', 'time-tracking'],
      'worker': ['dashboard', 'profile', 'appointments', 'time-tracking'],
      'user': ['dashboard', 'profile', 'appointments']
    };

    return permissions[user.role]?.includes(module) || false;
  }
};

if (typeof window !== 'undefined') {
  initializeDefaultData();
}

const getUsers = (): any[] => {
  const stored = localStorage.getItem('users');
  if (!stored) {
    const defaultUsers = [
      {
        id: 'user_admin',
        name: 'Administrador',
        lastName: 'Principal',
        email: 'admin@empresa.com',
        phone: '+1234567899',
        position: 'Administrador del Sistema',
        department: 'Administración',
        role: 'admin',
        password: 'admin123',
        registrationDate: new Date().toISOString()
      },
      {
        id: 'user_worker',
        name: 'María',
        lastName: 'González',
        email: 'maria@empresa.com',
        phone: '+1234567890',
        position: 'Desarrolladora Frontend',
        department: 'Desarrollo',
        role: 'worker',
        password: 'worker123',
        registrationDate: new Date().toISOString()
      },
      {
        id: 'user_client',
        name: 'Juan',
        lastName: 'Pérez',
        email: 'juan@cliente.com',
        phone: '+1234567891',
        position: 'Cliente',
        department: 'Externo',
        role: 'user',
        password: 'client123',
        registrationDate: new Date().toISOString()
      }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }
  return JSON.parse(stored);
};
