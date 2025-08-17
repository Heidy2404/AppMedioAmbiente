import { useState } from "react";
import { api } from "../services/api";

export default function ChangePassword() {
  const token = localStorage.getItem("mmar_token");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
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
    if (!token) { 
      setErr("Debes iniciar sesión."); 
      return; 
    }
    
    if (!oldPass || !newPass || !confirm) { 
      setErr("Completa todos los campos."); 
      return; 
    }
    
    if (newPass !== confirm) { 
      setErr("La confirmación de nueva contraseña no coincide."); 
      return; 
    }
    
    if (oldPass === newPass) {
      setErr("La nueva contraseña debe ser diferente a la actual.");
      return;
    }
    
    // Validar fortaleza de la nueva contraseña
    const passwordError = validatePassword(newPass);
    if (passwordError) {
      setErr(passwordError);
      return;
    }
    
    setLoading(true);
    try {
      await api.changePassword(token, oldPass, newPass);
      setMsg("Contraseña cambiada correctamente ✅");
      
      // Limpiar todos los campos después del éxito
      setOldPass(""); 
      setNewPass(""); 
      setConfirm("");
    } catch (e) {
      console.error("Error al cambiar contraseña:", e);
      setErr(e.message || "No se pudo cambiar la contraseña.");
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

  const passwordStrength = getPasswordStrength(newPass);

  return (
    <section className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Cambiar contraseña</h2>
      <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 border rounded-lg shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Contraseña actual</label>
          <input 
            className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
            type="password" 
            value={oldPass} 
            onChange={e => setOldPass(e.target.value)}
            placeholder="Ingresa tu contraseña actual"
            required 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Nueva contraseña</label>
          <input 
            className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
            type="password" 
            value={newPass} 
            onChange={e => setNewPass(e.target.value)}
            placeholder="Ingresa tu nueva contraseña"
            required 
          />
          {newPass && (
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
            value={confirm} 
            onChange={e => setConfirm(e.target.value)}
            placeholder="Confirma tu nueva contraseña"
            required 
          />
          {confirm && newPass && (
            <div className="mt-1">
              {confirm === newPass ? (
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
            <li className={newPass.length >= 8 ? "text-green-600" : ""}>• Mínimo 8 caracteres</li>
            <li className={/[A-Z]/.test(newPass) ? "text-green-600" : ""}>• Al menos una letra mayúscula</li>
            <li className={/[a-z]/.test(newPass) ? "text-green-600" : ""}>• Al menos una letra minúscula</li>
            <li className={/\d/.test(newPass) ? "text-green-600" : ""}>• Al menos un número</li>
            <li className={/[!@#$%^&*(),.?":{}|<>]/.test(newPass) ? "text-green-600" : ""}>• Al menos un carácter especial</li>
          </ul>
        </div>

        {err && <p className="text-rose-600 text-sm bg-rose-50 p-2 rounded">{err}</p>}
        {msg && <p className="text-emerald-700 text-sm bg-emerald-50 p-2 rounded">{msg}</p>}

        <button 
          disabled={loading || !oldPass || !newPass || !confirm || newPass !== confirm} 
          className="px-4 py-2 rounded bg-emerald-600 text-white w-full hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </section>
  );
}
