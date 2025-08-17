import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { api } from "../services/api";
import ReportDamage from "./ReportDamage";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
L.Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl });

const CENTER_RD = [18.7357, -70.1627];

export default function ReportsMap() {
  const token = localStorage.getItem("mmar_token");
  const [items, setItems] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("map"); // "map" | "list" | "detail" | "create"

  const loadReports = async () => {
    if (!token) { 
      setErr("Debes iniciar sesión para ver tus reportes."); 
      setLoading(false); 
      return; 
    }
    
    setLoading(true);
    try {
      const r = await api.getReportes(token);
      setItems(Array.isArray(r) ? r : (r?.data ?? []));
      setErr("");
    } catch (e) {
      setErr(e.message || "No se pudieron cargar tus reportes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [token]);

  const handleReportCreated = () => {
    // Recargar reportes después de crear uno nuevo
    loadReports();
    // Volver a la vista de mapa para ver el nuevo reporte
    setView("map");
  };

  const markers = useMemo(() => 
    items.filter(x => Number.isFinite(+x.latitud) && Number.isFinite(+x.longitud)), 
    [items]
  );

  const handleReportClick = async (reportId) => {
    console.log(reportId)
    if (!token) return;
    
    try {
      const reportDetail = await api.getReporteById(token, reportId);
      setSelectedReport(reportDetail);
      setView("detail");
    } catch (e) {
      console.error("Error al cargar detalle del reporte:", e);
      setErr("No se pudo cargar el detalle del reporte.");
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      "pendiente": "bg-yellow-100 text-yellow-800",
      "en_proceso": "bg-blue-100 text-blue-800", 
      "resuelto": "bg-green-100 text-green-800",
      "rechazado": "bg-red-100 text-red-800"
    };
    
    const statusText = {
      "pendiente": "Pendiente",
      "en_proceso": "En Proceso",
      "resuelto": "Resuelto", 
      "rechazado": "Rechazado"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || statusColors.pendiente}`}>
        {statusText[status] || status || "Pendiente"}
      </span>
    );
  };

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      <span className="ml-2">Cargando reportes...</span>
    </div>
  );

  if (err) return (
    <div className="p-4">
      <div className="bg-red-50 border border-red-200 rounded p-4">
        <p className="text-red-600">{err}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <section className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🗺️ Mapa de Reportes</h2>
          <p className="text-gray-600">
            {items.length} reporte{items.length !== 1 ? 's' : ''} encontrado{items.length !== 1 ? 's' : ''}
            {markers.length > 0 && ` • ${markers.length} con ubicación`}
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex rounded-lg border border-gray-200 bg-white">
          <button
            onClick={() => setView("map")}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              view === "map" 
                ? "bg-emerald-600 text-white" 
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            🗺️ Mapa
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 text-sm font-medium ${
              view === "list" 
                ? "bg-emerald-600 text-white" 
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            📋 Lista
          </button>
          <button
            onClick={() => setView("create")}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              view === "create" 
                ? "bg-emerald-600 text-white" 
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            ➕ Crear
          </button>
        </div>
      </div>

      {/* Content */}
      {view === "map" && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="h-[70vh]">
            <MapContainer center={CENTER_RD} zoom={7} className="h-full w-full">
              <TileLayer 
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {markers.map((m, i) => (
                <Marker key={m.codigo ?? m.id ?? i} position={[+m.latitud, +m.longitud]}>
                  <Popup>
                    <div className="min-w-[200px]">
                      <div className="font-semibold text-gray-900 mb-2">
                        {m.titulo ?? "Reporte sin título"}
                      </div>
                      <div className="space-y-1 text-sm">
                        <div><strong>Código:</strong> {m.codigo ?? m.id ?? "N/A"}</div>
                        <div><strong>Fecha:</strong> {m.fecha ?? m.fecha_registro ?? "N/A"}</div>
                        <div><strong>Estado:</strong> {getStatusBadge(m.estado)}</div>
                        {m.descripcion && (
                          <div><strong>Descripción:</strong> {m.descripcion.substring(0, 50)}...</div>
                        )}
                      </div>
                      <button
                        onClick={() => handleReportClick(m.codigo ?? m.id)}
                        className="mt-3 w-full px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
          
          {markers.length === 0 && items.length > 0 && (
            <div className="p-4 text-center text-gray-500">
              <p>Ninguno de tus reportes tiene coordenadas de ubicación para mostrar en el mapa.</p>
              <button 
                onClick={() => setView("list")} 
                className="mt-2 text-emerald-600 hover:text-emerald-700 underline"
              >
                Ver lista de reportes
              </button>
            </div>
          )}
        </div>
      )}

      {view === "list" && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Lista de Reportes</h3>
            
            {items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No tienes reportes registrados.</p>
                <button 
                  onClick={() => setView("create")}
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Crear Primer Reporte
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, i) => (
                  <div 
                    key={item.codigo ?? item.id ?? i} 
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {item.titulo ?? "Reporte sin título"}
                          </h4>
                          {getStatusBadge(item.estado)}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {item.descripcion ?? "Sin descripción"}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                          <span>📅 {item.fecha ?? item.fecha_registro ?? "Fecha no disponible"}</span>
                          <span>🔖 {item.codigo ?? item.id ?? "Sin código"}</span>
                          {Number.isFinite(+item.latitud) && Number.isFinite(+item.longitud) && (
                            <span>📍 {item.latitud}, {item.longitud}</span>
                          )}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleReportClick( item.id)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 flex-shrink-0"
                      >
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {view === "detail" && selectedReport && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Detalle del Reporte</h3>
              <button
                onClick={() => setView("map")}
                className="px-3 py-1 text-gray-600 hover:text-gray-900 border rounded"
              >
                ← Volver
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Información Principal */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Información General</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Título:</span>
                      <span className="font-medium">{selectedReport.titulo ?? "Sin título"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Código:</span>
                      <span className="font-medium">{selectedReport.codigo ?? selectedReport.id ?? "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span>{getStatusBadge(selectedReport.estado)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fecha:</span>
                      <span className="font-medium">{selectedReport.fecha ?? selectedReport.fecha_registro ?? "N/A"}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Descripción</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedReport.descripcion ?? "Sin descripción disponible"}
                  </p>
                </div>
                
                {selectedReport.comentario_ministerio && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Comentario del Ministerio</h4>
                    <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                      {selectedReport.comentario_ministerio}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Ubicación e Imagen */}
              <div className="space-y-4">
                {Number.isFinite(+selectedReport.latitud) && Number.isFinite(+selectedReport.longitud) && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Ubicación</h4>
                    <div className="text-sm text-gray-600 mb-2">
                      📍 Lat: {selectedReport.latitud}, Lng: {selectedReport.longitud}
                    </div>
                    <div className="h-48 rounded border overflow-hidden">
                      <MapContainer 
                        center={[+selectedReport.latitud, +selectedReport.longitud]} 
                        zoom={15} 
                        className="h-full w-full"
                      >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[+selectedReport.latitud, +selectedReport.longitud]}>
                          <Popup>{selectedReport.titulo ?? "Ubicación del reporte"}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </div>
                )}
                
                {selectedReport.foto && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Evidencia Fotográfica</h4>
                    <img 
                      src={selectedReport.foto.startsWith('data:') ? selectedReport.foto : `data:image/jpeg;base64,${selectedReport.foto}`}
                      alt="Evidencia del reporte" 
                      className="w-full h-48 object-cover rounded border"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div className="w-full h-48 bg-gray-100 rounded border items-center justify-center" style={{display: 'none'}}>
                      <p className="text-gray-500 text-sm">No se pudo cargar la imagen</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "create" && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Crear Nuevo Reporte</h3>
              <button
                onClick={() => setView("map")}
                className="px-3 py-1 text-gray-600 hover:text-gray-900 border rounded"
              >
                ← Volver
              </button>
            </div>
            
            <ReportDamage onSuccess={handleReportCreated} />
          </div>
        </div>
      )}
    </section>
  );
}
