import { useState } from "react";
import { api } from "../services/api";

export default function VolunteerForm() {
  const [form, setForm] = useState({
    cedula: "", nombre: "", apellido: "", correo: "", password: "", telefono: "",
  });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault(); setMsg(""); setErr(""); setLoading(true);
    try {
      const payload = {
        cedula: form.cedula.replace(/\D/g, "").slice(0, 11),
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        correo: form.correo.trim(),
        password: form.password,
        telefono: form.telefono.replace(/\D/g, ""),
      };
      await api.solicitarVoluntario(payload);
      setMsg("Solicitud enviada ✅");
      setForm({ cedula:"", nombre:"", apellido:"", correo:"", password:"", telefono:"" });
    } catch (e) {
      setErr(e.body || e.message || "No se pudo enviar la solicitud.");
    } finally { setLoading(false); }
  };

  return (
    <section className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-3">🤝 Programa de Voluntariado</h2>
      <form onSubmit={onSubmit} className="space-y-3 bg-white p-4 border rounded">
        <div className="grid md:grid-cols-2 gap-3">
          <input className="border rounded px-3 py-2 w-full" placeholder="Cédula" name="cedula" value={form.cedula} onChange={onChange} required />
          <input className="border rounded px-3 py-2 w-full" placeholder="Teléfono" name="telefono" value={form.telefono} onChange={onChange} required />
          <input className="border rounded px-3 py-2 w-full" placeholder="Nombre" name="nombre" value={form.nombre} onChange={onChange} required />
          <input className="border rounded px-3 py-2 w-full" placeholder="Apellido" name="apellido" value={form.apellido} onChange={onChange} required />
          <input className="border rounded px-3 py-2 w-full" placeholder="Correo" type="email" name="correo" value={form.correo} onChange={onChange} required />
          <input className="border rounded px-3 py-2 w-full" placeholder="Contraseña" type="password" name="password" value={form.password} onChange={onChange} required />
        </div>

        {err && <p className="text-rose-600 text-sm">{err}</p>}
        {msg && <p className="text-emerald-700 text-sm">{msg}</p>}

        <button disabled={loading} className="px-4 py-2 rounded bg-emerald-600 text-white">
          {loading ? "Enviando..." : "Enviar solicitud"}
        </button>
      </form>
    </section>
  );
}
