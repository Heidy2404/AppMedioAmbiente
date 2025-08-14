import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

function ytIdFrom(url="") {
  const m = String(url).match(/(?:v=|\.be\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m?.[1] || null;
}

export default function VideosAPI() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getVideos()
      .then(r => setItems(Array.isArray(r) ? r : (r?.data ?? [])))
      .catch(e => setErr(e.message || "No se pudieron cargar los videos."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(
    () => items.filter(v => JSON.stringify(v).toLowerCase().includes(q.toLowerCase())),
    [items, q]
  );

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-3">🎬 Videos educativos</h2>
      <input className="border rounded px-3 py-2 w-full mb-3" placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)} />
      {loading && <p>Cargando…</p>}
      {err && <p className="text-rose-600">{err}</p>}

      <div className="grid md:grid-cols-2 gap-3">
        {filtered.map((v,i) => {
          const titulo = v.titulo || v.nombre || v.title || "Video";
          const url = v.url || v.enlace || v.link || "";
          const id = ytIdFrom(url);
          const desc = v.descripcion || "";
          return (
            <div key={v.id ?? i} className="bg-white border rounded p-3">
              <h3 className="font-semibold mb-2">{titulo}</h3>
              {id ? (
                <div className="aspect-video w-full overflow-hidden rounded">
                  <iframe title={titulo} src={`https://www.youtube.com/embed/${id}`} className="w-full h-full" allowFullScreen />
                </div>
              ) : (
                url && <a className="text-emerald-700 underline" href={url} target="_blank" rel="noreferrer">Ver video</a>
              )}
              {desc && <p className="text-sm text-gray-600 mt-2">{desc}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
