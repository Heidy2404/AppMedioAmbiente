import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";

export default function ModalLogin({ visible, closeModal, onSuccess }) {
  const [mode, setMode] = useState("login"); // 'login' | 'recover' | 'register' | 'resetWithCode'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const dialogRef = useRef(null);

  // login
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);

  // recover
  const [recoverEmail, setRecoverEmail] = useState("");

  // resetWithCode
  const [resetCode, setResetCode] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // register
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [correoReg, setCorreoReg] = useState("");
  const [passwordReg, setPasswordReg] = useState("");
  const [telefono, setTelefono] = useState("");
  const [matricula, setMatricula] = useState("");

  useEffect(() => {
    function onKey(e){ if(e.key==="Escape") closeModal?.(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeModal]);

  if (!visible) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); setMsg(""); setLoading(true);
    try {
      const data = await api.login(email.trim(), pass);
      localStorage.setItem("mmar_token", data.token || "");
      onSuccess?.(data.user || { email });
      setMsg("¡Sesión iniciada!");
      closeModal?.();
    } catch (err) {
      setError("Credenciales inválidas o servicio no disponible.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async (e) => {
    e.preventDefault();
    setError(""); setMsg(""); setLoading(true);
    try {
      const response = await api.recover(recoverEmail.trim());
      
      if (response && response.codigo) {
        setRecoveryCode(response.codigo);
        setResetCode(response.codigo);
        setResetEmail(recoverEmail.trim());
        setMsg(`${response.mensaje || "Código de recuperación generado"}. Código: ${response.codigo}`);
        
        // Cambiar automáticamente al modo de reset con código
        setTimeout(() => {
          setMode("resetWithCode");
          setMsg("");
        }, 2000);
      } else {
        setMsg("Si el correo existe, recibirás instrucciones.");
        setMode("login");
      }
    } catch (err) {
      setError("No se pudo iniciar la recuperación.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetWithCode = async (e) => {
    e.preventDefault();
    setError(""); setMsg(""); setLoading(true);
    
    try {
      // Validaciones básicas
      if (!resetCode || !resetEmail || !newPassword || !confirmPassword) {
        setError("Por favor completa todos los campos.");
        return;
      }
      
      if (newPassword !== confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
      
      if (newPassword.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
      
      await api.resetPass({
        codigo: resetCode,
        correo: resetEmail,
        nueva_password: newPassword
      });
      
      setMsg("Contraseña restablecida correctamente. Ahora puedes iniciar sesión.");
      
      // Limpiar formularios y volver al login
      setTimeout(() => {
        setMode("login");
        setResetCode("");
        setResetEmail("");
        setNewPassword("");
        setConfirmPassword("");
        setMsg("");
      }, 2000);
    } catch (err) {
      if (err.status === 400) {
        setError("Código inválido o expirado. Solicita un nuevo código.");
      } else {
        setError("No se pudo restablecer la contraseña.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(""); setMsg(""); setLoading(true);
    try {
      const payload = {
        cedula: cedula.trim(),
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        correo: correoReg.trim(),
        password: passwordReg,
        telefono: telefono.trim(),
        matricula: matricula.trim(),
      };
      // registro
      await api.register(payload);
      // login automático
      const data = await api.login(correoReg.trim(), passwordReg);
      localStorage.setItem("mmar_token", data.token || "");
      onSuccess?.(data.user || { email: correoReg.trim() });
      setMsg("Usuario registrado e ingresado ✅");
      setMode("login");
      closeModal?.();
    } catch (err) {
      setError("No se pudo registrar. Revisa los datos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" ref={dialogRef}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        {/* ===== LOGIN ===== */}
        {mode === "login" && (
          <>
            <h3 className="text-xl font-bold mb-4">Iniciar sesión</h3>
            <form onSubmit={handleLogin} className="space-y-3">
              <input className="border rounded px-3 py-2 w-full" placeholder="Correo"
                     type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
              <div className="flex gap-2">
                <input className="border rounded px-3 py-2 w-full" placeholder="Contraseña"
                       type={showPass?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} required />
                <button type="button" onClick={()=>setShowPass(s=>!s)} className="px-3 border rounded">{showPass?"🙈":"👁️"}</button>
              </div>
              {error && <p className="text-rose-600 text-sm">{error}</p>}
              {msg && <p className="text-emerald-700 text-sm">{msg}</p>}
              <button disabled={loading} className="w-full px-4 py-2 rounded bg-emerald-600 text-white">
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
            <div className="flex justify-between items-center mt-3 text-sm">
              <button className="text-emerald-700 underline" onClick={()=>setMode("recover")}>¿Olvidaste tu contraseña?</button>
              <button className="text-emerald-700 underline" onClick={()=>setMode("register")}>Crear cuenta</button>
            </div>
            <div className="text-right mt-2"><button className="text-sm" onClick={closeModal}>Cerrar</button></div>
          </>
        )}

        {/* ===== RECOVER ===== */}
        {mode === "recover" && (
          <>
            <h3 className="text-xl font-bold mb-4">Recuperar contraseña</h3>
            <p className="text-gray-600 text-sm mb-4">
              Ingresa tu correo electrónico y te daremos un código para restablecer tu contraseña.
            </p>
            <form onSubmit={handleRecover} className="space-y-3">
              <input 
                className="border rounded px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                placeholder="tu@email.com"
                type="email" 
                value={recoverEmail} 
                onChange={e=>setRecoverEmail(e.target.value)} 
                required 
              />
              {error && <p className="text-rose-600 text-sm bg-rose-50 p-2 rounded">{error}</p>}
              {msg && (
                <div className="text-emerald-700 text-sm bg-emerald-50 p-2 rounded">
                  {msg}
                  {recoveryCode && (
                    <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                      <strong>Código: {recoveryCode}</strong>
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-2">
                <button 
                  disabled={loading || !recoverEmail} 
                  className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? "Enviando..." : "Obtener código"}
                </button>
                <button 
                  type="button" 
                  className="px-4 py-2 rounded border hover:bg-gray-50" 
                  onClick={()=>setMode("login")}
                >
                  Volver
                </button>
              </div>
            </form>
          </>
        )}

        {/* ===== RESET WITH CODE ===== */}
        {mode === "resetWithCode" && (
          <>
            <h3 className="text-xl font-bold mb-4">Restablecer contraseña</h3>
            <p className="text-gray-600 text-sm mb-4">
              Usa el código que recibiste para establecer tu nueva contraseña.
            </p>
            <form onSubmit={handleResetWithCode} className="space-y-3">
              <input 
                className="border rounded px-3 py-2 w-full font-mono" 
                placeholder="Código (ej: CD5881)"
                type="text" 
                value={resetCode} 
                onChange={e=>setResetCode(e.target.value.toUpperCase())} 
                maxLength={6}
                required 
              />
              <input 
                className="border rounded px-3 py-2 w-full" 
                placeholder="tu@email.com"
                type="email" 
                value={resetEmail} 
                onChange={e=>setResetEmail(e.target.value)} 
                required 
              />
              <input 
                className="border rounded px-3 py-2 w-full" 
                placeholder="Nueva contraseña"
                type="password" 
                value={newPassword} 
                onChange={e=>setNewPassword(e.target.value)} 
                required 
              />
              <input 
                className="border rounded px-3 py-2 w-full" 
                placeholder="Confirmar contraseña"
                type="password" 
                value={confirmPassword} 
                onChange={e=>setConfirmPassword(e.target.value)} 
                required 
              />
              {error && <p className="text-rose-600 text-sm bg-rose-50 p-2 rounded">{error}</p>}
              {msg && <p className="text-emerald-700 text-sm bg-emerald-50 p-2 rounded">{msg}</p>}
              <div className="flex gap-2">
                <button 
                  disabled={loading || !resetCode || !resetEmail || !newPassword || !confirmPassword} 
                  className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-gray-400"
                >
                  {loading ? "Restableciendo..." : "Cambiar contraseña"}
                </button>
                <button 
                  type="button" 
                  className="px-4 py-2 rounded border hover:bg-gray-50" 
                  onClick={()=>setMode("recover")}
                >
                  Volver
                </button>
              </div>
            </form>
          </>
        )}

        {/* ===== REGISTER ===== */}
        {mode === "register" && (
          <>
            <h3 className="text-xl font-bold mb-4">Crear cuenta</h3>
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input className="border rounded px-3 py-2 w-full" placeholder="Cédula" value={cedula} onChange={e=>setCedula(e.target.value)} required />
                <input className="border rounded px-3 py-2 w-full" placeholder="Matrícula" value={matricula} onChange={e=>setMatricula(e.target.value)} required />
                <input className="border rounded px-3 py-2 w-full" placeholder="Nombre" value={nombre} onChange={e=>setNombre(e.target.value)} required />
                <input className="border rounded px-3 py-2 w-full" placeholder="Apellido" value={apellido} onChange={e=>setApellido(e.target.value)} required />
                <input className="border rounded px-3 py-2 w-full" placeholder="Correo" type="email" value={correoReg} onChange={e=>setCorreoReg(e.target.value)} required />
                <input className="border rounded px-3 py-2 w-full" placeholder="Teléfono" value={telefono} onChange={e=>setTelefono(e.target.value)} required />
              </div>
              <input className="border rounded px-3 py-2 w-full" placeholder="Contraseña" type="password" value={passwordReg} onChange={e=>setPasswordReg(e.target.value)} required />
              {error && <p className="text-rose-600 text-sm">{error}</p>}
              {msg && <p className="text-emerald-700 text-sm">{msg}</p>}
              <div className="flex gap-2">
                <button disabled={loading} className="px-4 py-2 rounded bg-emerald-600 text-white">
                  {loading ? "Creando..." : "Crear cuenta"}
                </button>
                <button type="button" className="px-4 py-2 rounded border" onClick={()=>setMode("login")}>Volver</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
