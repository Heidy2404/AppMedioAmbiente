import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Regulations() {
  const token = localStorage.getItem("mmar_token");
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getNormativas(token, { busqueda: q })
      .then(res => {
        const list = Array.isArray(res) ? res : (res?.data ?? res?.result ?? []);
        setItems(list);
      })
      .catch(e => setErr(e.message || "No se pudieron cargar las normativas."))
      .finally(() => setLoading(false));
  }, [q, token]);

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-3">📚 Normativas Ambientales</h2>
      <input className="border rounded px-3 py-2 w-full mb-3" placeholder="Buscar por palabra clave…"
             value={q} onChange={e=>setQ(e.target.value)} />
      {loading && <p>Cargando…</p>}
      {err && <p className="text-rose-600">{err}</p>}
      <ul className="space-y-3">
        {items.map((n,i)=>(
          <li key={n.id ?? i} className="bg-white border rounded p-3">
            <h3 className="font-semibold">{n.titulo || "Normativa"}</h3>
            <p className="text-sm text-gray-600">{n.descripcion || ""}</p>
            <div className="text-xs text-gray-500 mt-1">
              {n.tipo && <span>Tipo: {n.tipo}</span>}
              {n.numero && <span> · Nº {n.numero}</span>}
              {n.fecha_publicacion && <span> · {n.fecha_publicacion}</span>}
            </div>
            {n.url_documento && (
              <a className="text-emerald-700 underline mt-2 inline-block"
                 href={n.url_documento} target="_blank" rel="noreferrer">Ver documento</a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
