import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function AreasList() {
  const [q, setQ] = useState("");
  const [areas, setAreas] = useState([]);
  const [sel, setSel] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getAreasProtegidas()
      .then(r => setAreas(Array.isArray(r) ? r : (r?.data ?? [])))
      .catch(e => setErr(e.message || "No se pudieron cargar las áreas."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = areas.filter(a => JSON.stringify(a).toLowerCase().includes(q.toLowerCase()));

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-3">🗺️ Áreas Protegidas</h2>
      <input className="border rounded px-3 py-2 w-full mb-3" placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)} />
      {loading && <p>Cargando…</p>}
      {err && <p className="text-rose-600">{err}</p>}
      <div className="grid md:grid-cols-2 gap-3">
        <ul className="space-y-2">
          {filtered.map((a,i)=>(
            <li key={a.id ?? i} onClick={()=>setSel(a)}
                className={`p-3 border rounded bg-white cursor-pointer ${sel?.id===a.id ? "ring-2 ring-emerald-500" : ""}`}>
              <h3 className="font-semibold">{a.nombre || a.titulo || "Área"}</h3>
              <p className="text-sm text-gray-600">{a.provincia || a.region || ""}</p>
            </li>
          ))}
        </ul>
        <div className="p-3 border rounded bg-white">
          {sel ? (
            <>
              <h3 className="text-lg font-bold">{sel.nombre || sel.titulo}</h3>
              <p className="text-sm text-gray-600">{sel.descripcion || ""}</p>
              {sel.imagen && <img src={sel.imagen} alt="" className="rounded mt-2" />}
              {(sel.latitud ?? sel.lat) && (sel.longitud ?? sel.lng) && (
                <p className="text-sm mt-2">Ubicación: {sel.latitud ?? sel.lat}, {sel.longitud ?? sel.lng}</p>
              )}
            </>
          ) : <p className="text-gray-500">Selecciona un área…</p>}
        </div>
      </div>
    </section>
  );
}
