import { useEffect, useState } from "react";
import areasData from "../services/areas_protegidas_rd.json";

export default function AreasList() {
  const [q, setQ] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [areas, setAreas] = useState([]);
  const [sel, setSel] = useState(null);
  const [err, setErr] = useState("");
  const [tiposDisponibles, setTiposDisponibles] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false);

  // Detectar si es vista móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cargar datos
  useEffect(() => {
    try {
      setAreas(areasData);
      
      // Extraer tipos únicos para el filtro
      const tiposUnicos = [...new Set(areasData.map(area => area.tipo))];
      setTiposDisponibles(tiposUnicos);
    } catch (error) {
      setErr("Error cargando datos locales: " + error.message);
    }
  }, []);

  // Filtrar áreas
  const filtered = areas.filter(area => {
    const coincideTexto = JSON.stringify(area).toLowerCase().includes(q.toLowerCase());
    const coincideTipo = tipoFiltro ? area.tipo === tipoFiltro : true;
    return coincideTexto && coincideTipo;
  });

  // Función para cerrar detalles en móvil
  const closeDetails = () => {
    setSel(null);
  };

  return (
    <section className="p-4 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-3 text-green-800">🗺️ Áreas Protegidas de República Dominicana</h2>
      
      {/* Controles de filtrado */}
      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <input 
          className="border rounded px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none" 
          placeholder="Buscar por nombre, descripción..." 
          value={q} 
          onChange={e => setQ(e.target.value)} 
        />
        
        <select 
          className="border rounded px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
          value={tipoFiltro}
          onChange={e => setTipoFiltro(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          {tiposDisponibles.map((tipo, index) => (
            <option key={index} value={tipo}>{tipo}</option>
          ))}
        </select>
      </div>

      {err && <p className="text-rose-600 p-3 bg-rose-50 rounded">{err}</p>}
      
      {/* Vista para móviles */}
      {isMobileView ? (
        <div className="space-y-4">
          {sel ? (
            <div className="p-4 border rounded bg-white shadow-md">
              <button 
                onClick={closeDetails}
                className="mb-3 flex items-center text-blue-600 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Volver a la lista
              </button>
              
              <h3 className="text-xl font-bold mb-2 text-green-800">{sel.nombre}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {sel.tipo}
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  {sel.superficie}
                </span>
              </div>
              
              <p className="text-gray-700 mb-3">{sel.descripcion}</p>
              
              <div className="mb-3">
                <h4 className="font-semibold text-green-700">📍 Ubicación</h4>
                <p className="text-gray-600">{sel.ubicacion}</p>
                {(sel.latitud || sel.longitud) && (
                  <p className="text-sm text-gray-500 mt-1">
                    Coordenadas: {sel.latitud}, {sel.longitud}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {filtered.length === 0 ? (
                <li className="p-3 border rounded bg-gray-50 text-center text-gray-500">
                  {areas.length === 0 ? "Datos no disponibles" : "No se encontraron áreas"}
                </li>
              ) : (
                filtered.map((a) => (
                  <li 
                    key={a.id} 
                    onClick={() => setSel(a)}
                    className="p-3 border rounded bg-white cursor-pointer hover:bg-green-50 transition"
                  >
                    <h3 className="font-semibold text-green-700">{a.nombre}</h3>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {a.tipo}
                      </span>
                      <span className="text-gray-500">{a.ubicacion}</span>
                    </div>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>
      ) : (
        /* Vista para escritorio */
        <div className="grid md:grid-cols-2 gap-3">
          <ul className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
            {filtered.length === 0 ? (
              <li className="p-3 border rounded bg-gray-50 text-center text-gray-500">
                {areas.length === 0 ? "Datos no disponibles" : "No se encontraron áreas"}
              </li>
            ) : (
              filtered.map((a) => (
                <li 
                  key={a.id} 
                  onClick={() => setSel(a)}
                  className={`p-3 border rounded bg-white cursor-pointer hover:bg-green-50 transition ${
                    sel?.id === a.id ? "ring-2 ring-green-500 border-green-200" : ""
                  }`}
                >
                  <h3 className="font-semibold text-green-700">{a.nombre}</h3>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {a.tipo}
                    </span>
                    <span className="text-gray-500">{a.ubicacion}</span>
                  </div>
                </li>
              ))
            )}
          </ul>

          <div className="p-4 border rounded bg-white shadow-md sticky top-4">
            {sel ? (
              <>
                <h3 className="text-xl font-bold mb-2 text-green-800">{sel.nombre}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {sel.tipo}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {sel.superficie}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-3">{sel.descripcion}</p>
                
                <div className="mb-3">
                  <h4 className="font-semibold text-green-700">📍 Ubicación</h4>
                  <p className="text-gray-600">{sel.ubicacion}</p>
                  {(sel.latitud || sel.longitud) && (
                    <p className="text-sm text-gray-500 mt-1">
                      Coordenadas: {sel.latitud}, {sel.longitud}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                <div className="text-5xl mb-3">🗺️</div>
                <p className="text-center">Seleccione un área protegida para ver su información detallada</p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}