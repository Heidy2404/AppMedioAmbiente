import { useState } from "react";
import { api } from "../services/api";

export default function ResetPasswordWithCode({ recoveryCode: initialCode, email: userEmail, onBackToRecover, onSuccess }) {
  const [code, setCode] = useState(initialCode || "");
  const [email, setEmail] = useState(userEmail || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Validación de contraseña segura
  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!hasUpperCase) {
      return "La contraseña debe contener al menos una letra mayúscula";
    }
    if (!hasLowerCase) {
      return "La contraseña debe contener al menos una letra minúscula";
    }
    if (!hasNumbers) {
      return "La contraseña debe contener al menos un número";
    }
    if (!hasSpecialChar) {
      return "La contraseña debe contener al menos un carácter especial";
    }
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");

    // Validaciones
    if (!code) {
      setErr("Por favor ingresa el código de recuperación.");
      return;
    }

    if (!email) {
      setErr("Por favor ingresa tu correo electrónico.");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setErr("Por favor completa todos los campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErr("Las contraseñas no coinciden.");
      return;
    }

    // Validar fortaleza de la contraseña
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setErr(passwordError);
      return;
    }

    setLoading(true);
    try {
      // Ajustar el payload según lo que espere el backend
      await api.resetPass({
        codigo: code,  // Usar 'codigo' en lugar de 'token'
        correo: email,
        nueva_password: newPassword
      });
      
      setMsg("Contraseña restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña.");
      
      // Limpiar todos los campos
      setCode("");
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Notificar al componente padre del éxito
      if (onSuccess) {
        onSuccess();
      }
      
      // Redireccionar al login después de 3 segundos
      setTimeout(() => {
        if (onBackToRecover) {
          onBackToRecover();
        }
      }, 3000);
    } catch (e) {
      console.error("Error al restablecer contraseña:", e);
      if (e.status === 400) {
        setErr("El código de recuperación ha expirado o no es válido. Solicita un nuevo código.");
      } else if (e.status === 404) {
        setErr("No se encontró una cuenta asociada a este correo electrónico.");
      } else {
        setErr(e.message || "No se pudo restablecer la contraseña. Inténtalo de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Indicadores de fortaleza de contraseña
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, text: "", color: "" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    if (score <= 2) return { score, text: "Débil", color: "text-red-600" };
    if (score <= 3) return { score, text: "Media", color: "text-yellow-600" };
    if (score <= 4) return { score, text: "Fuerte", color: "text-green-600" };
    return { score, text: "Muy fuerte", color: "text-green-700" };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <section className="p-4 max-w-md mx-auto">
      <div className="bg-white p-6 border rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-2">Restablecer contraseña</h2>
        <p className="text-gray-600 text-sm mb-4">
          Ingresa el código de recuperación que recibiste y tu nueva contraseña.
        </p>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Código de recuperación</label>
            <input 
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono" 
              type="text" 
              value={code} 
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="CD5881"
              maxLength={6}
              required 
            />
            <p className="text-xs text-gray-500 mt-1">Ingresa el código de 6 caracteres que aparece en la pantalla anterior</p>
          </div>

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
          
          <div>
            <label className="block text-sm font-medium mb-1">Nueva contraseña</label>
            <input 
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              type="password" 
              value={newPassword} 
              onChange={e => setNewPassword(e.target.value)}
              placeholder="Ingresa tu nueva contraseña"
              required 
            />
            {newPassword && (
              <div className="mt-1">
                <span className={`text-xs ${passwordStrength.color}`}>
                  Fortaleza: {passwordStrength.text}
                </span>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-300 ${
                      passwordStrength.score <= 2 ? 'bg-red-500' :
                      passwordStrength.score <= 3 ? 'bg-yellow-500' :
                      passwordStrength.score <= 4 ? 'bg-green-500' : 'bg-green-600'
                    }`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Confirmar nueva contraseña</label>
            <input 
              className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirma tu nueva contraseña"
              required 
            />
            {confirmPassword && newPassword && (
              <div className="mt-1">
                {confirmPassword === newPassword ? (
                  <span className="text-xs text-green-600">✓ Las contraseñas coinciden</span>
                ) : (
                  <span className="text-xs text-red-600">✗ Las contraseñas no coinciden</span>
                )}
              </div>
            )}
          </div>

          <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded">
            <strong>Requisitos de la contraseña:</strong>
            <ul className="mt-1 space-y-1">
              <li className={newPassword.length >= 8 ? "text-green-600" : ""}>• Mínimo 8 caracteres</li>
              <li className={/[A-Z]/.test(newPassword) ? "text-green-600" : ""}>• Al menos una letra mayúscula</li>
              <li className={/[a-z]/.test(newPassword) ? "text-green-600" : ""}>• Al menos una letra minúscula</li>
              <li className={/\d/.test(newPassword) ? "text-green-600" : ""}>• Al menos un número</li>
              <li className={/[!@#$%^&*(),.?":{}|<>]/.test(newPassword) ? "text-green-600" : ""}>• Al menos un carácter especial</li>
            </ul>
          </div>

          {err && (
            <div className="text-rose-600 text-sm bg-rose-50 p-3 rounded border border-rose-200">
              {err}
            </div>
          )}
          
          {msg && (
            <div className="text-emerald-700 text-sm bg-emerald-50 p-3 rounded border border-emerald-200">
              {msg}
            </div>
          )}

          <button 
            disabled={loading || !code || !email || !newPassword || !confirmPassword || newPassword !== confirmPassword} 
            className="px-4 py-2 rounded bg-emerald-600 text-white w-full hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Restableciendo..." : "Restablecer contraseña"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={onBackToRecover}
            className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
          >
            ← Solicitar nuevo código
          </button>
        </div>
      </div>
    </section>
  );
}
