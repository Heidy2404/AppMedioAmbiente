import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Servicios() {
  const [items, setItems] = useState([]), [q, setQ] = useState(""), [err, setErr] = useState("");

  useEffect(() => { api.getServicios()
    .then((r)=>setItems(Array.isArray(r)?r:(r?.data??[])))
    .catch((e)=>setErr(e.message)); }, []);

  const filtered = items.filter(s => JSON.stringify(s).toLowerCase().includes(q.toLowerCase()));
  return (
    <section className="p-4">
      <h2 className="text-xl font-semibold mb-2">Servicios</h2>
      <input className="border px-3 py-2 rounded w-full mb-3" placeholder="Buscar..." value={q} onChange={e=>setQ(e.target.value)} />
      {err && <p className="text-rose-600">{err}</p>}
      <ul className="grid md:grid-cols-2 gap-3">
        {filtered.map((s,i)=>(
          <li key={s.id??i} className="p-3 rounded border bg-white">
            <h3 className="font-bold">{s.nombre??"Servicio"}</h3>
            <p className="text-sm text-gray-600">{s.descripcion??""}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
