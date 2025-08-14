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

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(""); setErr("");
    if (!token) { setErr("Debes iniciar sesión."); return; }
    if (!oldPass || !newPass) { setErr("Completa todos los campos."); return; }
    if (newPass !== confirm) { setErr("La confirmación no coincide."); return; }
    setLoading(true);
    try {
      await api.changePassword(token, oldPass, newPass);
      setMsg("Contraseña cambiada correctamente ✅");
      setOldPass(""); setNewPass(""); setConfirm("");
    } catch (e) {
      setErr(e.message || "No se pudo cambiar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Cambiar contraseña</h2>
      <form onSubmit={onSubmit} className="space-y-3 bg-white p-4 border rounded">
        <div>
          <label className="block text-sm font-medium">Contraseña actual</label>
          <input className="border rounded px-3 py-2 w-full" type="password" value={oldPass} onChange={e=>setOldPass(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Nueva contraseña</label>
          <input className="border rounded px-3 py-2 w-full" type="password" value={newPass} onChange={e=>setNewPass(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Confirmar nueva contraseña</label>
          <input className="border rounded px-3 py-2 w-full" type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} />
        </div>

        {err && <p className="text-rose-600 text-sm">{err}</p>}
        {msg && <p className="text-emerald-700 text-sm">{msg}</p>}

        <button disabled={loading} className="px-4 py-2 rounded bg-emerald-600 text-white w-full">
          {loading ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </section>
  );
}
