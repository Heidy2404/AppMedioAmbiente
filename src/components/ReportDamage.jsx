import { useEffect, useState } from "react";
import { api } from "../services/api";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(",")[1] || "");
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

export default function ReportDamage({ onSuccess }) {
  const token = localStorage.getItem("mmar_token");
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [msg, setMsg] = useState(""); 
  const [err, setErr] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if ("geolocation" in navigator) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (p) => { 
          setLat(p.coords.latitude.toFixed(6)); 
          setLng(p.coords.longitude.toFixed(6)); 
          setLocationLoading(false);
        },
        () => { setLocationLoading(false); }, 
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  const onPick = (e) => {
    const f = e.target.files?.[0] || null;
    setFoto(f); 
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  const getLocation = () => {
    if (!("geolocation" in navigator)) {
      setErr("Geolocalización no disponible en este navegador.");
      return;
    }
    
    setLocationLoading(true);
    setErr("");
    
    navigator.geolocation.getCurrentPosition(
      (p) => { 
        setLat(p.coords.latitude.toFixed(6)); 
        setLng(p.coords.longitude.toFixed(6)); 
        setLocationLoading(false);
        setMsg("Ubicación obtenida correctamente 📍");
        setTimeout(() => setMsg(""), 3000);
      },
      (error) => {
        setLocationLoading(false);
        let errorMsg = "Error al obtener ubicación.";
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Permiso de ubicación denegado.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Ubicación no disponible.";
            break;
          case error.TIMEOUT:
            errorMsg = "Tiempo de espera agotado.";
            break;
        }
        setErr(errorMsg);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const onSubmit = async (e) => {
    e.preventDefault(); 
    setMsg(""); 
    setErr("");
    
    if (!token) { 
      setErr("Debes iniciar sesión."); 
      return; 
    }
    
    if (!titulo.trim()) {
      setErr("El título es requerido.");
      return;
    }
    
    if (!descripcion.trim()) {
      setErr("La descripción es requerida.");
      return;
    }
    
    if (!foto) {
      setErr("La foto es requerida.");
      return;
    }
    
    if (!lat || !lng) {
      setErr("La ubicación (latitud y longitud) es requerida.");
      return;
    }
    
    if (isNaN(Number(lat)) || isNaN(Number(lng))) {
      setErr("Las coordenadas deben ser números válidos.");
      return;
    }
    
    setLoading(true);
    try {
      const foto64 = await fileToBase64(foto);
      await api.crearReporte(token, {
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        foto: foto64,
        latitud: Number(lat),
        longitud: Number(lng),
      });
      
      setMsg("✅ Reporte enviado correctamente"); 
      
      // Limpiar formulario
      setTitulo(""); 
      setDescripcion(""); 
      setFoto(null); 
      setPreview("");
      setLat("");
      setLng("");
      
      // Llamar callback si existe
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500); // Dar tiempo para mostrar el mensaje de éxito
      }
      
    } catch (e) { 
      console.error("Error al crear reporte:", e);
      setErr(e.message || "No se pudo enviar el reporte."); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <section className={onSuccess ? "" : "p-4 max-w-2xl mx-auto"}>
      <div className={onSuccess ? "" : "bg-white rounded-lg shadow-sm border p-6"}>
        {!onSuccess && (
          <>
            <h2 className="text-2xl font-bold mb-2 text-gray-900">⚠️ Reportar Daño Ambiental</h2>
            <p className="text-sm text-gray-600 mb-6">
              Completa todos los campos para reportar un daño o incidente ambiental.
            </p>
          </>
        )}
        
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del reporte *
            </label>
            <input 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="Ej: Contaminación en río, Deforestación, etc."
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción detallada *
            </label>
            <textarea 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 min-h-[120px] focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
              placeholder="Describe en detalle el problema ambiental observado..."
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </div>

          {/* Foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evidencia fotográfica *
            </label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={onPick}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
            {preview && (
              <div className="mt-3">
                <img 
                  src={preview} 
                  alt="Vista previa" 
                  className="max-h-48 rounded-lg border object-cover"
                />
              </div>
            )}
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input 
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                placeholder="Latitud"
                value={lat} 
                onChange={(e) => setLat(e.target.value)}
                required
              />
              <input 
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500" 
                placeholder="Longitud"
                value={lng} 
                onChange={(e) => setLng(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={getLocation}
                disabled={locationLoading}
                className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {locationLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Obteniendo...
                  </>
                ) : (
                  "📍 Mi ubicación"
                )}
              </button>
            </div>
            {locationLoading && (
              <p className="text-sm text-blue-600 mt-2">
                Obteniendo tu ubicación actual...
              </p>
            )}
          </div>

          {/* Mensajes */}
          {err && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{err}</p>
            </div>
          )}
          
          {msg && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-600 text-sm">{msg}</p>
            </div>
          )}

          {/* Botón de envío */}
          <button 
            type="submit"
            disabled={loading || !titulo.trim() || !descripcion.trim() || !foto || !lat || !lng}
            className="w-full bg-emerald-600 text-white rounded-lg px-6 py-3 font-medium hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando reporte...
              </>
            ) : (
              "🚀 Enviar reporte"
            )}
          </button>
        </form>
        
        {!onSuccess && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">ℹ️ Información importante:</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Todos los campos son obligatorios</li>
              <li>• La foto se convierte automáticamente al formato requerido</li>
              <li>• Tu ubicación se detecta automáticamente al cargar la página</li>
              <li>• Puedes actualizar la ubicación manualmente si es necesario</li>
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
