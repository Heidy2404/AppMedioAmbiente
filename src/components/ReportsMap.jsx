import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { api } from "../services/api";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const CENTER_RD = [18.7357, -70.1627];

export default function ReportsMap() {
  const token = localStorage.getItem("mmar_token");
  const [items, setItems] = useState([]); const [err, setErr] = useState(""); const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setErr("Debes iniciar sesión."); setLoading(false); return; }
    api.misReportes(token)
      .then((r)=>setItems(Array.isArray(r)?r:(r?.data??[])))
      .catch(()=>setErr("No se pudieron cargar tus reportes."))
      .finally(()=>setLoading(false));
  }, [token]);

  const markers = useMemo(()=> items.filter(x => Number.isFinite(+x.latitud) && Number.isFinite(+x.longitud)), [items]);

  return (
    <section className="space-y-4 p-4">
      <h2 className="text-2xl font-bold">🗺️ Mapa de tus Reportes</h2>
      {err && <p className="text-rose-600">{err}</p>}
      <div className="h-[70vh] rounded border overflow-hidden">
        <MapContainer center={CENTER_RD} zoom={7} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markers.map((m, i)=>(
            <Marker key={m.codigo ?? i} position={[+m.latitud, +m.longitud]}>
              <Popup>
                <strong>{m.titulo ?? "Reporte"}</strong><br/>
                {m.fecha ?? ""}<br/>
                {m.estado ? `Estado: ${m.estado}` : ""}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
}
