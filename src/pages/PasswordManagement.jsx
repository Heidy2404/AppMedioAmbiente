import { useState } from "react";
import ChangePassword from "../components/ChangePassword";
import ForgotPassword from "../components/ForgotPassword";
import ResetPassword from "../components/ResetPassword";
import ResetPasswordWithCode from "../components/ResetPasswordWithCode";

export default function PasswordManagement() {
  const [currentView, setCurrentView] = useState("change"); // 'change', 'forgot', 'reset', 'resetWithCode'
  const [recoveryData, setRecoveryData] = useState({ code: "", email: "" });
  
  // Manejar cuando se recibe un código de recuperación
  const handleCodeReceived = (code, email) => {
    setRecoveryData({ code, email });
    setCurrentView("resetWithCode");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Navegación */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center mb-4">Gestión de Contraseñas</h1>
          <div className="flex justify-center space-x-2 flex-wrap">
            <button
              onClick={() => setCurrentView("change")}
              className={`px-3 py-2 rounded text-sm ${
                currentView === "change" 
                  ? "bg-emerald-600 text-white" 
                  : "bg-white text-emerald-600 border border-emerald-600"
              }`}
            >
              Cambiar Contraseña
            </button>
            <button
              onClick={() => setCurrentView("forgot")}
              className={`px-3 py-2 rounded text-sm ${
                currentView === "forgot" 
                  ? "bg-emerald-600 text-white" 
                  : "bg-white text-emerald-600 border border-emerald-600"
              }`}
            >
              Recuperar Contraseña
            </button>
            <button
              onClick={() => setCurrentView("resetWithCode")}
              className={`px-3 py-2 rounded text-sm ${
                currentView === "resetWithCode" 
                  ? "bg-emerald-600 text-white" 
                  : "bg-white text-emerald-600 border border-emerald-600"
              }`}
            >
              Con Código
            </button>
            <button
              onClick={() => setCurrentView("reset")}
              className={`px-3 py-2 rounded text-sm ${
                currentView === "reset" 
                  ? "bg-emerald-600 text-white" 
                  : "bg-white text-emerald-600 border border-emerald-600"
              }`}
            >
              Con Token (URL)
            </button>
          </div>
        </div>

        {/* Contenido dinámico */}
        {currentView === "change" && (
          <div>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-semibold text-blue-800">Cambiar Contraseña</h3>
              <p className="text-blue-600 text-sm">
                Para usuarios autenticados que desean cambiar su contraseña actual.
                Requiere contraseña actual y validación de nueva contraseña.
              </p>
            </div>
            <ChangePassword />
          </div>
        )}

        {currentView === "forgot" && (
          <div>
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h3 className="font-semibold text-yellow-800">Recuperar Contraseña</h3>
              <p className="text-yellow-600 text-sm">
                Para usuarios que olvidaron su contraseña. El sistema devuelve un código de recuperación.
                Utiliza el endpoint POST /auth/recover
              </p>
            </div>
            <ForgotPassword 
              onBackToLogin={() => setCurrentView("change")} 
              onCodeReceived={handleCodeReceived}
            />
          </div>
        )}

        {currentView === "resetWithCode" && (
          <div>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-semibold text-blue-800">Restablecer con Código</h3>
              <p className="text-blue-600 text-sm">
                Usa el código de recuperación que recibiste para establecer una nueva contraseña.
                Utiliza el endpoint POST /auth/reset con código
              </p>
            </div>
            <ResetPasswordWithCode 
              recoveryCode={recoveryData.code}
              email={recoveryData.email}
              onBackToRecover={() => setCurrentView("forgot")}
              onSuccess={() => {
                setCurrentView("change");
                setRecoveryData({ code: "", email: "" });
              }}
            />
          </div>
        )}

        {currentView === "reset" && (
          <div>
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-semibold text-green-800">Restablecer Contraseña</h3>
              <p className="text-green-600 text-sm">
                Página para restablecer contraseña usando el token recibido por correo.
                Utiliza el endpoint POST /auth/reset
              </p>
            </div>
            <ResetPassword />
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3">Funcionalidades Implementadas</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>Cambio de contraseña:</strong> Para usuarios autenticados con validación de contraseña actual
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>Recuperación con código:</strong> Sistema alternativo que devuelve código directamente
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>Recuperación de contraseña:</strong> Envío de enlace por correo electrónico (si está configurado)
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>Restablecimiento de contraseña:</strong> Usando token de recuperación
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>Validaciones robustas:</strong> Fortaleza de contraseña, confirmación, emails válidos
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 font-bold">✓</span>
              <div>
                <strong>UI mejorada:</strong> Indicadores visuales, mensajes claros, estados de carga
              </div>
            </div>
          </div>
        </div>

        {/* Endpoints utilizados */}
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Endpoints API:</h4>
          <div className="space-y-2 text-sm font-mono">
            <div><span className="text-blue-600">POST</span> /auth/recover - Solicitar recuperación (devuelve código: "CD5881")</div>
            <div><span className="text-blue-600">POST</span> /auth/reset - Restablecer con código/token</div>
            <div><span className="text-blue-600">POST</span> /auth/reset - Cambiar contraseña (con token de usuario)</div>
          </div>
          
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded">
            <h5 className="font-semibold text-amber-800 text-sm">💡 Nota sobre el Backend:</h5>
            <p className="text-amber-700 text-xs mt-1">
              El endpoint /auth/recover está devolviendo un código directamente en lugar de enviarlo por correo. 
              Esto es común cuando el sistema de correo no está configurado o se usa para testing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
