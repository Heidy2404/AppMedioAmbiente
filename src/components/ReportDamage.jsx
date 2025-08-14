import { useEffect, useState } from "react";
import { api } from "../services/api";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] || "");
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function ReportDamage() {
  const token = localStorage.getItem("mmar_token");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [msg, setMsg] = useState(""); const [err, setErr] = useState(""); const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p)=>{ setLat(p.coords.latitude.toFixed(6)); setLng(p.coords.longitude.toFixed(6)); },
        ()=>{}, { enableHighAccuracy:true, timeout:8000 }
      );
    }
  }, []);

  const onPick = (e) => {
    const f = e.target.files?.[0] || null;
    setFoto(f); setPreview(f ? URL.createObjectURL(f) : "");
  };

  const onSubmit = async (e) => {
    e.preventDefault(); setMsg(""); setErr("");
    if (!token) { setErr("Debes iniciar sesión."); return; }
    if (!titulo.trim() || !descripcion.trim() || !foto || !lat || !lng) { setErr("Completa título, descripción, foto y ubicación."); return; }
    setLoading(true);
    try {
      const foto64 = await fileToBase64(foto);
      await api.crearReporte(token, {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        foto: foto64,
        latitud: Number(lat),
        longitud: Number(lng),
      });
      setMsg("Reporte enviado ✅"); setTitulo(""); setDescripcion(""); setFoto(null); setPreview("");
    } catch (e) { setErr("No se pudo enviar el reporte."); }
    finally { setLoading(false); }
  };

  return (
    <section className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-3">⚠️ Reportar Daño Ambiental</h2>
      <p className="text-xs text-gray-500 mb-2">Campos requeridos por el PDF: Título, Descripción, Foto (base64), Latitud y Longitud.</p>
      <form onSubmit={onSubmit} className="space-y-3 bg-white p-4 border rounded">
        <input className="border rounded px-3 py-2 w-full" placeholder="Título" value={titulo} onChange={(e)=>setTitulo(e.target.value)} />
        <textarea className="border rounded px-3 py-2 w-full min-h-[100px]" placeholder="Descripción" value={descripcion} onChange={(e)=>setDescripcion(e.target.value)} />
        <div>
          <label className="block text-sm font-medium">Foto</label>
          <input type="file" accept="image/*" onChange={onPick} />
          {preview && <img src={preview} alt="preview" className="mt-2 max-h-48 rounded border" />}
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <input className="border rounded px-3 py-2 w-full" placeholder="Latitud" value={lat} onChange={(e)=>setLat(e.target.value)} />
          <input className="border rounded px-3 py-2 w-full" placeholder="Longitud" value={lng} onChange={(e)=>setLng(e.target.value)} />
          <button type="button" className="border rounded px-3 py-2" onClick={()=>{
            if(!("geolocation" in navigator)) return;
            navigator.geolocation.getCurrentPosition((p)=>{ setLat(p.coords.latitude.toFixed(6)); setLng(p.coords.longitude.toFixed(6)); });
          }}>Usar mi ubicación</button>
        </div>
        {err && <p className="text-rose-600 text-sm">{err}</p>}
        {msg && <p className="text-emerald-700 text-sm">{msg}</p>}
        <button disabled={loading} className="px-4 py-2 rounded bg-emerald-600 text-white">{loading ? "Enviando..." : "Enviar reporte"}</button>
      </form>
    </section>
  );
}
