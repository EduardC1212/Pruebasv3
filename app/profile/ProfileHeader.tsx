'use client';

export default function ProfileHeader() {
  return (
    <div className="bg-white rounded-xl p-6 card-shadow">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <img
            src="https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20a%20friendly%20female%20software%20developer%20with%20dark%20hair%2C%20wearing%20business%20casual%20attire%2C%20smiling%20confidently%2C%20clean%20studio%20lighting%2C%20white%20background%2C%20high%20quality%20portrait%20photography%2C%20professional%20appearance&width=80&height=80&seq=profile-avatar&orientation=squarish"
            alt="Foto de perfil"
            className="w-20 h-20 rounded-full object-cover"
          />
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
            <i className="ri-camera-line text-white text-sm"></i>
          </button>
        </div>
        
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900">María González</h2>
          <p className="text-gray-600 text-sm">Desarrolladora Frontend</p>
          <div className="flex items-center mt-2">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Activa</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">42</div>
          <div className="text-xs text-gray-600">Horas esta semana</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">8</div>
          <div className="text-xs text-gray-600">Citas pendientes</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">95%</div>
          <div className="text-xs text-gray-600">Asistencia</div>
        </div>
      </div>
    </div>
  );
}