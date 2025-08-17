import { useState } from "react";
import { api } from "../services/api";

export default function ForgotPassword({ onBackToLogin, onCodeReceived }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    // Validaciones
    if (!email) {
      setErr("Por favor ingresa tu correo electrónico.");
      return;
    }

    if (!validateEmail(email)) {
      setErr("Por favor ingresa un correo electrónico válido.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.recover(email);
      
      // Si el backend devuelve un código en lugar de enviar correo
      if (response && response.codigo) {
        setRecoveryCode(response.codigo);
        setMsg(`${response.mensaje || "Se ha generado un código de recuperación"}`);
        
        // Notificar al componente padre que se recibió un código
        if (onCodeReceived) {
          onCodeReceived(response.codigo, email);
        }
      } else {
        setMsg("Se ha enviado un enlace de recuperación a tu correo electrónico. Por favor revisa tu bandeja de entrada y spam.");
        setEmail(""); // Limpiar email solo si no hay código
      }
      
    } catch (e) {
      console.error("Error al recuperar contraseña:", e);
      if (e.status === 404) {
        setErr("No se encontró una cuenta asociada a este correo electrónico.");
      } else {
        setErr(e.message || "No se pudo procesar la solicitud de recuperación. Inténtalo de nuevo más tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-4 max-w-md mx-auto">
      <div className="bg-white p-6 border rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">Recuperar contraseña</h2>
        <p className="text-gray-600 text-sm mb-4">
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Correo electrónico</label>
            <input 
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required 
            />
          </div>

          {err && (
            <div className="text-rose-600 text-sm bg-rose-50 p-3 rounded border border-rose-200">
              {err}
            </div>
          )}
          
          {msg && (
            <div className="text-emerald-700 text-sm bg-emerald-50 p-3 rounded border border-emerald-200">
              {msg}
              {recoveryCode && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                  <strong className="text-blue-800">Código de recuperación:</strong>
                  <div className="text-xl font-mono font-bold text-blue-900 mt-1 p-2 bg-white rounded border">
                    {recoveryCode}
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    ⚠️ Guarda este código, lo necesitarás para restablecer tu contraseña.
                  </p>
                </div>
              )}
            </div>
          )}

          <button 
            disabled={loading || !email} 
            className="px-4 py-2 rounded bg-emerald-600 text-white w-full hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Procesando..." : "Solicitar recuperación"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={onBackToLogin}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            ← Volver al inicio de sesión
          </button>
        </div>

        {/* Mostrar botón para usar el código si se generó uno */}
        {recoveryCode && (
          <div className="mt-4 text-center">
            <button 
              onClick={() => onCodeReceived && onCodeReceived(recoveryCode, email)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Usar código para restablecer contraseña
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
