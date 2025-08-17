import { useState } from "react";
import ChangePassword from "../components/ChangePassword";

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
          <p className="text-gray-600">Gestiona tu información personal y configuración de cuenta</p>
        </div>

        {/* Navegación de pestañas */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "profile"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Información Personal
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "password"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Cambiar Contraseña
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "settings"
                    ? "border-emerald-500 text-emerald-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Configuración
              </button>
            </nav>
          </div>

          {/* Contenido de las pestañas */}
          <div className="p-6">
            {activeTab === "profile" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre</label>
                    <input 
                      type="text" 
                      className="border rounded px-3 py-2 w-full"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Apellido</label>
                    <input 
                      type="text" 
                      className="border rounded px-3 py-2 w-full"
                      placeholder="Tu apellido"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                      type="email" 
                      className="border rounded px-3 py-2 w-full"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Teléfono</label>
                    <input 
                      type="tel" 
                      className="border rounded px-3 py-2 w-full"
                      placeholder="Tu teléfono"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
                    Guardar Cambios
                  </button>
                </div>
              </div>
            )}

            {activeTab === "password" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Seguridad de la Cuenta</h3>
                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">
                        Mantén tu cuenta segura
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Usa una contraseña fuerte y única que no hayas usado en otras cuentas.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Aquí se usa el componente ChangePassword */}
                <ChangePassword />
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Configuración de la Cuenta</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Notificaciones por email</h4>
                      <p className="text-sm text-gray-500">Recibir actualizaciones importantes por correo</p>
                    </div>
                    <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-emerald-600 transition-colors duration-200 ease-in-out focus:outline-none">
                      <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Autenticación de dos factores</h4>
                      <p className="text-sm text-gray-500">Agregar una capa extra de seguridad</p>
                    </div>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      Configurar
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium">Historial de sesiones</h4>
                      <p className="text-sm text-gray-500">Ver dónde has iniciado sesión</p>
                    </div>
                    <button className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                      Ver historial
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botón de cerrar sesión */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-600">Zona de Peligro</h3>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium">Cerrar sesión</h4>
              <p className="text-sm text-gray-500">Terminar tu sesión actual en este dispositivo</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
