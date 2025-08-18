// src/services/api.js
// usa "" por defecto para que las rutas sean relativas en dev y pasen por el proxy
const BASE = (process.env.REACT_APP_API_BASE ?? "").replace(/\/$/, "");


// Helper: evita preflight en GET (no seteamos Content-Type si no hay body)
async function http(path, { method = "GET", token, body, headers } = {}) {
  const url = `${BASE}${path}`;
  const h = { ...(headers || {}) };
  if (token) h.Authorization = `Bearer ${token}`;
  if (body && !(body instanceof FormData)) h["Content-Type"] = "application/json";

  const res = await fetch(url, { method, headers: h, body: body && !(body instanceof FormData) ? JSON.stringify(body) : body });

  if (!res.ok) {
    let text = await res.text().catch(() => "");
    try { const j = JSON.parse(text); if (j?.message) text = j.message; } catch {}
    const err = new Error(text || `HTTP ${res.status} ${res.statusText}`);
    err.status = res.status; err.url = url; err.body = text;
    throw err;
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : res.text();
}

// Algunas instancias exponen /recurso y otras /api/recurso
async function tryPaths(paths, opts) {
  let last;
  for (const p of paths) {
    try { return await http(p, opts); }
    catch (e) { last = e; }
  }
  throw last || new Error("Ruta no válida");
}

export const api = {
  // ------- Autenticación -------
  register: (payload) =>
    tryPaths(["/auth/register"], { method: "POST", body: payload }),
  login: (correo, password) =>
    tryPaths(["/auth/login"], { method: "POST", body: { correo, password } }),
  recover: (correo) =>
    tryPaths(["/auth/recover"], { method: "POST", body: { correo } }),
  resetPass: (payload) =>
    tryPaths(["/auth/recover"], { method: "POST", body: payload }),
  changePassword: async (token, oldPassword, newPassword) => {
    // Obtener el correo del usuario desde localStorage
    const userData = localStorage.getItem("mmar_user");
    const userEmail = userData ? JSON.parse(userData).email : null;
    
    if (!userEmail) {
      throw new Error("No se pudo obtener el correo del usuario");
    }
    
    try {
      // Paso 1: Solicitar código de recuperación
      const recoverResponse = await tryPaths(["/auth/recover"], { 
        method: "POST", 
        body: { correo: userEmail } 
      });
      
      // Extraer el código de la respuesta
      let recoveryCode = null;
      if (typeof recoverResponse === 'string') {
        // Si la respuesta es texto, buscar el código (normalmente 6 dígitos)
        const codeMatch = recoverResponse.match(/\b\d{6}\b/);
        if (codeMatch) {
          recoveryCode = codeMatch[0];
        }
      } else if (recoverResponse && recoverResponse.codigo) {
        // Si la respuesta es JSON con campo codigo
        recoveryCode = recoverResponse.codigo;
      }
      
      if (!recoveryCode) {
        throw new Error("No se pudo obtener el código de recuperación");
      }
      
      // Paso 2: Usar el código para cambiar la contraseña
      return await tryPaths(["/auth/reset"], { 
        method: "POST", 
        body: { 
          correo: userEmail, 
          codigo: recoveryCode, 
          nueva_password: newPassword 
        } 
      });
      
    } catch (error) {
      throw new Error(`Error al cambiar contraseña: ${error.message}`);
    }
  },

  // ------- Públicos -------
  getServicios: () => tryPaths(["/servicios"]),
  getServicioById: (id) => tryPaths([`/servicios/${id}`]),
  getNoticias: () => tryPaths(["/noticias"]),
  getVideos: () => tryPaths(["/videos"]),
  getAreasProtegidas: () => {
    // Datos mock mientras el endpoint no está implementado en el servidor
    return Promise.resolve([
      {
        id: 1,
        nombre: "Parque Nacional del Este",
        tipo: "parque_nacional",
        descripcion: "Parque nacional ubicado en la provincia La Altagracia, conocido por sus playas vírgenes y diversidad marina.",
        ubicacion: "La Altagracia",
        area_km2: 420,
        fecha_creacion: "1975-09-13",
        latitud: 18.3207,
        longitud: -68.7990,
        estado: "activo"
      },
      {
        id: 2,
        nombre: "Parque Nacional Armando Bermúdez",
        tipo: "parque_nacional", 
        descripcion: "Parque montañoso que protege parte de la Cordillera Central, incluyendo el Pico Duarte.",
        ubicacion: "Santiago, La Vega",
        area_km2: 766,
        fecha_creacion: "1956-07-03",
        latitud: 19.0220,
        longitud: -70.9978,
        estado: "activo"
      },
      {
        id: 3,
        nombre: "Parque Nacional José del Carmen Ramírez",
        tipo: "parque_nacional",
        descripcion: "Área protegida en la Cordillera Central, complemento del Parque Armando Bermúdez.",
        ubicacion: "San Juan, Azua",
        area_km2: 764,
        fecha_creacion: "1958-08-05",
        latitud: 18.8500,
        longitud: -71.2000,
        estado: "activo"
      },
      {
        id: 4,
        nombre: "Reserva Científica Ébano Verde",
        tipo: "reserva_cientifica",
        descripcion: "Reserva que protege los últimos bosques de ébano verde en la Cordillera Central.",
        ubicacion: "La Vega",
        area_km2: 23,
        fecha_creacion: "1989-03-18",
        latitud: 19.0464,
        longitud: -70.5169,
        estado: "activo"
      },
      {
        id: 5,
        nombre: "Parque Nacional Los Haitises",
        tipo: "parque_nacional",
        descripcion: "Parque famoso por sus mogotes kársticos, manglares y arte rupestre taíno.",
        ubicacion: "Hato Mayor, Monte Plata, Samaná",
        area_km2: 1600,
        fecha_creacion: "1976-06-03",
        latitud: 19.0500,
        longitud: -69.4167,
        estado: "activo"
      },
      {
        id: 6,
        nombre: "Refugio de Vida Silvestre Laguna de Cabral",
        tipo: "refugio_vida_silvestre",
        descripcion: "Humedal importante para aves acuáticas migratorias y residentes.",
        ubicacion: "Barahona",
        area_km2: 26,
        fecha_creacion: "1983-12-15",
        latitud: 18.1667,
        longitud: -71.1333,
        estado: "activo"
      }
    ]);
  },
  getMedidas: () => tryPaths(["/medidas"]),
  getEquipo: () => tryPaths(["/equipo"]),
  solicitarVoluntario: (payload) =>
    tryPaths(["/voluntarios"], { method: "POST", body: payload }),

  // ------- Protegidos -------
  // GET /normativas?tipo=&busqueda=
  getNormativas: (token, { tipo, busqueda } = {}) => {
    const qs = new URLSearchParams();
    if (tipo) qs.set("tipo", tipo);
    if (busqueda) qs.set("busqueda", busqueda);
    const tail = qs.toString() ? `?${qs}` : "";
    return tryPaths([`/normativas${tail}`], { token });
  },

  getReportes: (token) => tryPaths(["/reportes"], { token }),
  crearReporte: (token, payload) =>
    tryPaths(["/reportes"], { method: "POST", token, body: payload }),
  getReporteById: (token, id) =>
    tryPaths([`/reportes/${id}`], { token }),

  // PUT /usuarios (perfil/cambio de clave según doc)
  updateUsuario: (token, payload) =>
    tryPaths(["/usuarios"], { method: "PUT", token, body: payload }),
};
