import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function NewsAPI() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getNoticias()
      .then(r => setItems(Array.isArray(r) ? r : (r?.data ?? [])))
      .catch(e => setErr(e.message || "No se pudieron cargar las noticias."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(n => JSON.stringify(n).toLowerCase().includes(q.toLowerCase()));

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-3">🗞️ Noticias</h2>
      <input className="border rounded px-3 py-2 w-full mb-3" placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)} />
      {loading && <p>Cargando…</p>}
      {err && <p className="text-rose-600">{err}</p>}
      <ul className="grid md:grid-cols-2 gap-3">
        {filtered.map((n,i) => {
          const titulo = n.titulo || n.title || "Noticia";
          const resumen = n.resumen || n.descripcion || n.extracto || "";
          const imagen = n.imagen || n.image || null;
          const fecha = n.fecha || n.publicacion || n.created_at || null;
          const link = n.enlace || n.url || null;
          return (
            <li key={n.id ?? i} className="bg-white border rounded p-3">
              <h3 className="font-semibold">{titulo}</h3>
              {fecha && <div className="text-xs text-gray-500">{String(fecha)}</div>}
              {imagen && <img src={imagen} alt="" className="rounded mt-2 max-h-56 w-full object-cover" />}
              <p className="text-sm text-gray-700 mt-2">{resumen}</p>
              {link && <a className="text-emerald-700 underline mt-2 inline-block" href={link} target="_blank" rel="noreferrer">Leer más</a>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
