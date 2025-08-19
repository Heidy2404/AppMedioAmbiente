import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function AreasList() {
  const [q, setQ] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [areas, setAreas] = useState([]);
  const [sel, setSel] = useState(null);
  const [err, setErr] = useState("");
  const [tiposDisponibles, setTiposDisponibles] = useState([]);
  const [isMobileView, setIsMobileView] = useState(false);
  const [loading, setLoading] = useState(true);

  // Detectar si es vista móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Cargar datos desde la API usando tu servicio
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true);
        // Usar directamente getAreasProtegidas que contiene los datos
        const areasData = await api.getAreasProtegidas();
        setAreas(areasData);
        
        // Extraer tipos únicos para el filtro
        const tiposUnicos = [...new Set(areasData.map(area => area.tipo))];
        setTiposDisponibles(tiposUnicos);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        setErr("Error cargando datos: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
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
    <section className="p-4 max-w-7xl mx-auto bg-gradient-to-b from-green-50 to-white min-h-screen">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-2">
          🗺️ Áreas Protegidas
        </h2>
        <p className="text-gray-600">República Dominicana</p>
      </div>
      
      {/* Controles de filtrado */}
      <div className="max-w-2xl mx-auto mb-6 space-y-3 md:space-y-0 md:grid md:grid-cols-2 md:gap-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input 
            className="pl-10 w-full border-2 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm" 
            placeholder="Buscar por nombre, ubicación..." 
            value={q} 
            onChange={e => setQ(e.target.value)} 
          />
        </div>
        
        <select 
          className="w-full border-2 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200 bg-white shadow-sm"
          value={tipoFiltro}
          onChange={e => setTipoFiltro(e.target.value)}
        >
          <option value="">Todos los tipos de áreas</option>
          {tiposDisponibles.map((tipo, index) => (
            <option key={index} value={tipo}>
              {tipo.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </option>
          ))}
        </select>
      </div>

      {err && (
        <div className="max-w-2xl mx-auto mb-6">
          <p className="text-rose-600 p-4 bg-rose-50 rounded-lg border border-rose-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {err}
          </p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Cargando áreas protegidas...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Vista para móviles */}
          {isMobileView ? (
            <div className="space-y-4">
              {sel ? (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="bg-green-600 p-4">
                    <button 
                      onClick={closeDetails}
                      className="mb-2 flex items-center text-white font-medium"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Volver
                    </button>
                    <h3 className="text-2xl font-bold text-white mb-2">{sel.nombre}</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                        {sel.tipo.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <span className="font-medium">{sel.area_km2} km²</span>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed">{sel.descripcion}</p>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Ubicación
                      </h4>
                      <p className="text-gray-600">{sel.ubicacion}</p>
                      {(sel.latitud || sel.longitud) && (
                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          {sel.latitud}, {sel.longitud}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filtered.length === 0 ? (
                    <div className="p-6 bg-gray-50 rounded-xl text-center">
                      <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12a4 4 0 00-4-4h-.01M12 12a4 4 0 01-4 4h-.01" />
                      </svg>
                      <p className="text-gray-500 font-medium">
                        {areas.length === 0 ? "Datos no disponibles" : "No se encontraron áreas"}
                      </p>
                    </div>
                  ) : (
                    filtered.map((a) => (
                      <div 
                        key={a.id} 
                        onClick={() => setSel(a)}
                        className="bg-white rounded-xl shadow-sm p-4 active:scale-98 transition-transform cursor-pointer border-2 border-transparent hover:border-green-500"
                      >
                        <h3 className="text-lg font-semibold text-green-800 mb-2">{a.nombre}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                            {a.tipo.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                          <span className="text-gray-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {a.ubicacion}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Vista para escritorio */
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-4 px-2">Lista de Áreas</h3>
                <div className="space-y-3 max-h-[70vh] overflow-y-auto px-2">
                  {filtered.length === 0 ? (
                    <div className="p-6 bg-gray-50 rounded-xl text-center">
                      <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12a4 4 0 00-4-4h-.01M12 12a4 4 0 01-4 4h-.01" />
                      </svg>
                      <p className="text-gray-500 font-medium">
                        {areas.length === 0 ? "Datos no disponibles" : "No se encontraron áreas"}
                      </p>
                    </div>
                  ) : (
                    filtered.map((a) => (
                      <div 
                        key={a.id} 
                        onClick={() => setSel(a)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                          sel?.id === a.id 
                            ? "bg-green-50 border-2 border-green-500" 
                            : "bg-white border-2 border-transparent hover:border-green-200"
                        }`}
                      >
                        <h3 className="font-semibold text-green-800 mb-2">{a.nombre}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                            {a.tipo.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                          <span className="text-gray-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            </svg>
                            {a.ubicacion}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="sticky top-4">
                {sel ? (
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-green-600 p-6">
                      <h3 className="text-2xl font-bold text-white mb-3">{sel.nombre}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                          {sel.tipo.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                        <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                          {sel.area_km2} km²
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <p className="text-gray-700 leading-relaxed">{sel.descripcion}</p>
                      
                      <div className="border-t pt-6">
                        <h4 className="font-semibold text-green-700 flex items-center gap-2 mb-3">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Ubicación
                        </h4>
                        <p className="text-gray-600">{sel.ubicacion}</p>
                        {(sel.latitud || sel.longitud) && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                            Coordenadas: {sel.latitud}, {sel.longitud}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Seleccione un área</h3>
                    <p className="text-gray-500">Elija un área protegida de la lista para ver su información detallada</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}