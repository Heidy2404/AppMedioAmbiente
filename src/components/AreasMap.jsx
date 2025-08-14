import { useEffect, useState } from "react";
import { api } from "../services/api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

export default function AreasMap() {
  const [areas, setAreas] = useState([]), [err, setErr] = useState(""), [loading,setLoading]=useState(true);

  useEffect(() => {
    setLoading(true);
    api.getAreasProtegidas()
      .then(r => setAreas(Array.isArray(r) ? r : (r?.data ?? [])))
      .catch(e => setErr(e.message || "No se pudieron cargar las áreas."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-3">🧭 Mapa de Áreas Protegidas</h2>
      {loading && <p>Cargando…</p>}
      {err && <p className="text-rose-600">{err}</p>}
      <div className="h-[70vh] rounded overflow-hidden border">
        <MapContainer center={[18.7357,-70.1627]} zoom={7} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {areas.map((a,i) => {
            const lat = Number(a.latitud ?? a.lat), lng = Number(a.longitud ?? a.lng);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
            return (
              <Marker key={a.id ?? i} position={[lat, lng]}>
                <Popup>
                  <strong>{a.nombre || a.titulo || "Área"}</strong><br/>
                  {(a.provincia || a.region || "")}
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </section>
  );
}
