import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function TeamAPI() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getEquipo()
      .then(r => setItems(Array.isArray(r) ? r : (r?.data ?? [])))
      .catch(e => setErr(e.message || "No se pudo cargar el equipo."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(p => JSON.stringify(p).toLowerCase().includes(q.toLowerCase()));

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-3">👥 Equipo del Ministerio</h2>
      <input className="border rounded px-3 py-2 w-full mb-3" placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)} />
      {loading && <p>Cargando…</p>}
      {err && <p className="text-rose-600">{err}</p>}

      <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((p,i)=>(
          <li key={p.id ?? i} className="bg-white border rounded p-3 flex gap-3 items-center">
            <img src={p.foto || p.imagen || "https://via.placeholder.com/96"} alt="" className="w-20 h-20 object-cover rounded-full border" />
            <div>
              <h3 className="font-semibold">{p.nombre || `${p.nombres ?? ""} ${p.apellidos ?? ""}` || "Miembro"}</h3>
              <p className="text-sm text-gray-600">{p.cargo || p.rol || ""}</p>
              {p.telefono && <div className="text-xs text-gray-500 mt-1">📞 {p.telefono}</div>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
