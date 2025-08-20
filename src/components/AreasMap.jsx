// src/components/AreasMap.jsx
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
  const [areas, setAreas] = useState([]),
        [err, setErr] = useState(""),
        [loading,setLoading]=useState(true);

  useEffect(() => {
    setLoading(true);
    api.getAreasProtegidas() // sin filtros; puedes pasar {tipo, busqueda} si quieres
      .then(r => setAreas(Array.isArray(r) ? r : (r?.data ?? [])))
      .catch(e => setErr(e.message || "No se pudieron cargar las áreas."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-3">🧭 Mapa de Áreas Protegidas</h2>
      {loading && <p>Cargando…</p>}
      {err && <p className="text-rose-600">{err}</p>}
      
      <div className="h-[60vh] rounded overflow-hidden border mb-6">
        <MapContainer center={[18.7357,-70.1627]} zoom={7} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {areas.map((a,i) => {
            const lat = Number(a.latitud), lng = Number(a.longitud);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
            return (
              <Marker key={a.id ?? i} position={[lat, lng]}>
                <Popup>
                  <div className="min-w-[260px]">
                    {a.imagen && (
                      <img
                        src={a.imagen}
                        alt={a.nombre}
                        className="w-full h-32 object-cover rounded mb-2"
                        loading="lazy"
                      />
                    )}
                    <strong className="text-lg text-green-700">{a.nombre || "Área"}</strong><br/>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Tipo:</span> {a.tipo?.replaceAll('_', ' ') || 'N/A'}<br/>
                      <span className="font-medium">Ubicación:</span> {a.ubicacion || 'N/A'}<br/>
                      <span className="font-medium">Superficie:</span> {a.superficie || 'N/D'}
                    </p>
                    {a.descripcion && (
                      <p className="text-sm mt-2 text-gray-700">{a.descripcion}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Lista de áreas */}
      {areas.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="text-lg font-semibold mb-3 text-green-700">📋 Lista de Áreas Protegidas ({areas.length})</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {areas.map((area, i) => (
              <div key={area.id ?? i} className="p-3 border rounded-lg hover:bg-green-50 transition-colors">
                <h4 className="font-medium text-green-800">{area.nombre}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">
                    {area.tipo?.replaceAll('_', ' ') || 'N/A'}
                  </span>
                  {area.ubicacion}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {area.superficie ? `Superficie: ${area.superficie}` : ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
