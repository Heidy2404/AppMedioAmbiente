import { Capacitor } from '@capacitor/core';
import { Http } from '@capacitor-community/http';

// SIEMPRE base absoluta en APK; en web puede quedar vacío para usar el proxy
const BASE = (
  process.env.REACT_APP_API_BASE?.trim() ||
  (Capacitor.isNativePlatform() ? 'https://adamix.net/medioambiente' : '')
).replace(/\/$/, '');

const isNative = Capacitor.isNativePlatform();

// HTTP helper (elige nativo en APK para evitar CORS)
async function http(path, { method = "GET", token, body, headers } = {}) {
  const url = `${BASE}${path}`;
  const h = { ...(headers || {}) };
  if (token) h.Authorization = `Bearer ${token}`;

  // Si hay body y no es FormData, usar JSON
  const hasJsonBody = body && !(body instanceof FormData);

  if (isNative) {
    // ---- Nativo (APK) ----
    const options = {
      url,
      method,
      headers: { ...h },
      params: {},
    };

    if (hasJsonBody) {
      options.headers['Content-Type'] = 'application/json';
      options.data = body;
    } else if (body instanceof FormData) {
      // Para FormData en nativo usamos data como objeto (si ya lo traes como FormData, conviene adaptarlo antes)
      const obj = {};
      body.forEach((v, k) => { obj[k] = v; });
      options.data = obj;
    }

    const res = await Http.request(options);
    // res.data ya viene parseado si es JSON
    const status = res.status ?? 0;
    if (status < 200 || status >= 300) {
      const text = typeof res.data === 'string' ? res.data : JSON.stringify(res.data || {});
      const err = new Error(text || `HTTP ${status}`);
      err.status = status; err.url = url; err.body = text;
      throw err;
    }
    return res.data;
  } else {
    // ---- Web (navegador / dev) ----
    if (hasJsonBody) h["Content-Type"] = "application/json";
    const res = await fetch(url, { method, headers: h, body: hasJsonBody ? JSON.stringify(body) : body });
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
}

// Intenta varias rutas (diferentes prefijos y capitalización)
async function tryPaths(paths, opts) {
  let last;
  for (const p of paths) {
    try { return await http(p, opts); }
    catch (e) { last = e; }
  }
  throw last || new Error("Ruta no válida");
}

// Helpers para probar variantes típicas del API de adamix (y similares)
const v = (name) => [
  `/api/${name}`,           // ej: /api/Medidas
  `/${name}`,               // ej: /Medidas
  `/api/${name.toLowerCase()}`,
  `/${name.toLowerCase()}`
];

export const api = {
  // ------- Autenticación (tu backend) -------
  register: (payload) =>
    tryPaths([
      '/auth/register', '/api/auth/register'
    ], { method: "POST", body: payload }),

  login: (correo, password) =>
    tryPaths([
      '/auth/login', '/api/auth/login'
    ], { method: "POST", body: { correo, password } }),

  recover: (correo) =>
    tryPaths([
      '/auth/recover', '/api/auth/recover'
    ], { method: "POST", body: { correo } }),

  resetPass: (payload) =>
    tryPaths([
      '/auth/reset', '/api/auth/reset', '/auth/recover', '/api/auth/recover'
    ], { method: "POST", body: payload }),

  changePassword: async (token, oldPassword, newPassword) => {
    // Obtener el correo del usuario desde localStorage
    const userData = localStorage.getItem("mmar_user");
    const userEmail = userData ? JSON.parse(userData).email : null;
    if (!userEmail) throw new Error("No se pudo obtener el correo del usuario");

    try {
      // 1) Pedir código
      const recoverResponse = await tryPaths([
        '/auth/recover', '/api/auth/recover'
      ], { method: "POST", body: { correo: userEmail } });

      let recoveryCode = null;
      if (typeof recoverResponse === 'string') {
        const codeMatch = recoverResponse.match(/\b\d{6}\b/);
        if (codeMatch) recoveryCode = codeMatch[0];
      } else if (recoverResponse && recoverResponse.codigo) {
        recoveryCode = recoverResponse.codigo;
      }
      if (!recoveryCode) throw new Error("No se pudo obtener el código de recuperación");

      // 2) Usar el código
      return await tryPaths([
        '/auth/reset', '/api/auth/reset'
      ], {
        method: "POST",
        body: { correo: userEmail, codigo: recoveryCode, nueva_password: newPassword }
      });
    } catch (error) {
      throw new Error(`Error al cambiar contraseña: ${error.message}`);
    }
  },

  // ------- Públicos (adamix) -------
  getServicios: () => tryPaths(v('Servicios')),
  getServicioById: (id) => tryPaths(v(`Servicios/${id}`)),

  getNoticias: () => tryPaths(v('Noticias')),
  getVideos: () => tryPaths(v('Videos')),
  getMedidas: () => tryPaths(v('Medidas')),
  getEquipo: () => tryPaths(v('Equipo')),

  // Datos mock mientras no exista endpoint real
  getAreasProtegidas: () => Promise.resolve([
    { id: 1, nombre: "Parque Nacional del Este", tipo: "parque_nacional", descripcion: "Parque nacional ubicado en la provincia La Altagracia, conocido por sus playas vírgenes y diversidad marina.", ubicacion: "La Altagracia", area_km2: 420, fecha_creacion: "1975-09-13", latitud: 18.3207, longitud: -68.7990, estado: "activo" },
    { id: 2, nombre: "Parque Nacional Armando Bermúdez", tipo: "parque_nacional", descripcion: "Parque montañoso que protege parte de la Cordillera Central, incluyendo el Pico Duarte.", ubicacion: "Santiago, La Vega", area_km2: 766, fecha_creacion: "1956-07-03", latitud: 19.0220, longitud: -70.9978, estado: "activo" },
    { id: 3, nombre: "Parque Nacional José del Carmen Ramírez", tipo: "parque_nacional", descripcion: "Área protegida en la Cordillera Central, complemento del Parque Armando Bermúdez.", ubicacion: "San Juan, Azua", area_km2: 764, fecha_creacion: "1958-08-05", latitud: 18.8500, longitud: -71.2000, estado: "activo" },
    { id: 4, nombre: "Reserva Científica Ébano Verde", tipo: "reserva_cientifica", descripcion: "Reserva que protege los últimos bosques de ébano verde en la Cordillera Central.", ubicacion: "La Vega", area_km2: 23, fecha_creacion: "1989-03-18", latitud: 19.0464, longitud: -70.5169, estado: "activo" },
    { id: 5, nombre: "Parque Nacional Los Haitises", tipo: "parque_nacional", descripcion: "Parque famoso por sus mogotes kársticos, manglares y arte rupestre taíno.", ubicacion: "Hato Mayor, Monte Plata, Samaná", area_km2: 1600, fecha_creacion: "1976-06-03", latitud: 19.0500, longitud: -69.4167, estado: "activo" },
    { id: 6, nombre: "Refugio de Vida Silvestre Laguna de Cabral", tipo: "refugio_vida_silvestre", descripcion: "Humedal importante para aves acuáticas migratorias y residentes.", ubicacion: "Barahona", area_km2: 26, fecha_creacion: "1983-12-15", latitud: 18.1667, longitud: -71.1333, estado: "activo" }
  ]),

  // ------- Protegidos (tu backend) -------
  // GET /normativas?tipo=&busqueda=
  getNormativas: (token, { tipo, busqueda } = {}) => {
    const qs = new URLSearchParams();
    if (tipo) qs.set("tipo", tipo);
    if (busqueda) qs.set("busqueda", busqueda);
    const tail = qs.toString() ? `?${qs}` : "";
    return tryPaths([
      `/normativas${tail}`, `/api/normativas${tail}`
    ], { token });
  },

  getReportes: (token) =>
    tryPaths(['/reportes', '/api/reportes'], { token }),

  crearReporte: (token, payload) =>
    tryPaths(['/reportes', '/api/reportes'], { method: "POST", token, body: payload }),

  getReporteById: (token, id) =>
    tryPaths([`/reportes/${id}`, `/api/reportes/${id}`], { token }),

  updateUsuario: (token, payload) =>
    tryPaths(['/usuarios', '/api/usuarios'], { method: "PUT", token, body: payload }),
};
