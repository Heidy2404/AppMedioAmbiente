import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function MeasuresAPI() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getMedidas()
      .then(r => setItems(Array.isArray(r) ? r : (r?.data ?? [])))
      .catch(e => setErr(e.message || "No se pudieron cargar las medidas."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(m => JSON.stringify(m).toLowerCase().includes(q.toLowerCase()));

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-3">🧩 Medidas Ambientales</h2>
      <input className="border rounded px-3 py-2 w-full mb-3" placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)} />
      {loading && <p>Cargando…</p>}
      {err && <p className="text-rose-600">{err}</p>}
      <ul className="space-y-3">
        {filtered.map((m,i)=>(
          <li key={m.id ?? i} className="bg-white border rounded p-3">
            <h3 className="font-semibold">{m.titulo || m.nombre || "Medida"}</h3>
            <p className="text-sm text-gray-600">{m.descripcion || ""}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
