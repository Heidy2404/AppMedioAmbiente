import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function ServicesAPI() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getServicios()
      .then(r => setItems(Array.isArray(r) ? r : (r?.data ?? [])))
      .catch(() => setErr("No se pudieron cargar los servicios."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(s => JSON.stringify(s).toLowerCase().includes(q.toLowerCase()));

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-3">🛠️ Servicios</h2>
      <input className="border rounded px-3 py-2 w-full mb-3" placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)} />
      {loading && <p>Cargando…</p>}
      {err && <p className="text-rose-600">{err}</p>}
      <ul className="grid md:grid-cols-2 gap-3">
        {filtered.map((s,i)=>(
          <li key={s.id ?? i} className="bg-white p-3 border rounded">
            <h3 className="font-semibold">{s.nombre ?? "Servicio"}</h3>
            <p className="text-sm text-gray-600">{s.descripcion ?? ""}</p>
            {s.enlace && <a href={s.enlace} target="_blank" rel="noreferrer" className="text-emerald-700 underline">Ir</a>}
          </li>
        ))}
      </ul>
    </section>
  );
}
