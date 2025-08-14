import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function MyReports() {
  const token = localStorage.getItem("mmar_token");
  const [items, setItems] = useState([]); const [err,setErr]=useState(""); const [loading,setLoading]=useState(true);

  useEffect(() => {
    if (!token) { setErr("Debes iniciar sesión."); setLoading(false); return; }
    api.getReportes(token)
      .then(r => setItems(Array.isArray(r) ? r : (r?.data ?? [])))
      .catch(e => setErr(e.message || "No se pudieron cargar tus reportes."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="p-4">Cargando…</p>;
  if (err) return <p className="p-4 text-rose-600">{err}</p>;

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-3">📊 Mis Reportes</h2>
      <ul className="space-y-3">
        {items.map((it,i)=>(
          <li key={it.codigo ?? i} className="bg-white border rounded p-3">
            <div className="flex flex-wrap gap-2 justify-between">
              <strong>{it.titulo ?? "Reporte"}</strong>
              <span className="text-sm text-gray-500">{it.fecha ?? it.fecha_registro ?? ""}</span>
            </div>
            <p className="text-sm text-gray-700 mt-1">{it.descripcion ?? ""}</p>
            {it.foto && <img src={it.foto} alt="" className="mt-2 max-h-56 rounded" />}
            <div className="text-sm mt-2">
              <div><b>Código:</b> {it.codigo ?? "-"}</div>
              <div><b>Estado:</b> {it.estado ?? "-"}</div>
              <div><b>Comentario:</b> {it.comentario_ministerio ?? "-"}</div>
              {Number.isFinite(+it.latitud) && Number.isFinite(+it.longitud) &&
               <div><b>Ubicación:</b> {it.latitud}, {it.longitud}</div>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
