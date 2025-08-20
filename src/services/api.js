// src/services/api.js
import { Capacitor } from '@capacitor/core';
import { Http } from '@capacitor-community/http';

// En APK siempre base absoluta; en web puede quedar vacío para usar proxy en dev
const BASE = (
  process.env.REACT_APP_API_BASE?.trim() ||
  (Capacitor.isNativePlatform() ? 'https://adamix.net/medioambiente' : '')
).replace(/\/$/, '');

const isNative = Capacitor.isNativePlatform();

// Helper HTTP (nativo en APK para evitar CORS)
async function http(path, { method = "GET", token, body, headers } = {}) {
  const url = `${BASE}${path}`;
  const h = { ...(headers || {}) };
  if (token) h.Authorization = `Bearer ${token}`;

  const hasJsonBody = body && !(body instanceof FormData);

  if (isNative) {
    const options = { url, method, headers: { ...h }, params: {} };
    if (hasJsonBody) {
      options.headers['Content-Type'] = 'application/json';
      options.data = body;
    } else if (body instanceof FormData) {
      const obj = {};
      body.forEach((v, k) => { obj[k] = v; });
      options.data = obj;
    }
    const res = await Http.request(options);
    const status = res.status ?? 0;
    if (status < 200 || status >= 300) {
      const text = typeof res.data === 'string' ? res.data : JSON.stringify(res.data || {});
      const err = new Error(text || `HTTP ${status}`);
      err.status = status; err.url = url; err.body = text;
      throw err;
    }
    return res.data;
  } else {
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

// Intenta varias rutas conocidas
async function tryPaths(paths, opts) {
  let last;
  for (const p of paths) {
    try { return await http(p, opts); }
    catch (e) { last = e; }
  }
  throw last || new Error("Ruta no válida");
}

// Helpers de variantes típicas
const v = (name) => [
  `/api/${name}`,
  `/${name}`,
  `/api/${name.toLowerCase()}`,
  `/${name.toLowerCase()}`
];

export const api = {
  // ------- Autenticación (tu backend) -------
  register: (payload) =>
    tryPaths(['/auth/register', '/api/auth/register'], { method: "POST", body: payload }),

  login: (correo, password) =>
    tryPaths(['/auth/login', '/api/auth/login'], { method: "POST", body: { correo, password } }),

  recover: (correo) =>
    tryPaths(['/auth/recover', '/api/auth/recover'], { method: "POST", body: { correo } }),

  resetPass: (payload) =>
    tryPaths(['/auth/reset', '/api/auth/reset', '/auth/recover', '/api/auth/recover'], { method: "POST", body: payload }),

  changePassword: async (token, oldPassword, newPassword) => {
    const userData = localStorage.getItem("mmar_user");
    const userEmail = userData ? JSON.parse(userData).email : null;
    if (!userEmail) throw new Error("No se pudo obtener el correo del usuario");

    try {
      const recoverResponse = await tryPaths(['/auth/recover', '/api/auth/recover'], { method: "POST", body: { correo: userEmail } });
      let recoveryCode = null;
      if (typeof recoverResponse === 'string') {
        const codeMatch = recoverResponse.match(/\b\d{6}\b/);
        if (codeMatch) recoveryCode = codeMatch[0];
      } else if (recoverResponse && recoverResponse.codigo) {
        recoveryCode = recoverResponse.codigo;
      }
      if (!recoveryCode) throw new Error("No se pudo obtener el código de recuperación");

      return await tryPaths(['/auth/reset', '/api/auth/reset'], {
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

  // ✅ Áreas protegidas (schema oficial)
  // GET /areas_protegidas?tipo=parque_nacional|reserva_cientifica|monumento_natural|refugio_vida_silvestre&busqueda=...
  getAreasProtegidas: ({ tipo, busqueda } = {}) => {
    const qs = new URLSearchParams();
    if (tipo) qs.set('tipo', tipo);
    if (busqueda) qs.set('busqueda', busqueda);
    const tail = qs.toString() ? `?${qs}` : '';
    // En adamix vive en la raíz (no /api)
    return http(`/areas_protegidas${tail}`, { method: 'GET' });
  },

  // ------- Protegidos (tu backend) -------
  getNormativas: (token, { tipo, busqueda } = {}) => {
    const qs = new URLSearchParams();
    if (tipo) qs.set("tipo", tipo);
    if (busqueda) qs.set("busqueda", busqueda);
    const tail = qs.toString() ? `?${qs}` : "";
    return tryPaths([`/normativas${tail}`, `/api/normativas${tail}`], { token });
  },

  getReportes: (token) => tryPaths(['/reportes', '/api/reportes'], { token }),
  crearReporte: (token, payload) => tryPaths(['/reportes', '/api/reportes'], { method: "POST", token, body: payload }),
  getReporteById: (token, id) => tryPaths([`/reportes/${id}`, `/api/reportes/${id}`], { token }),
  updateUsuario: (token, payload) => tryPaths(['/usuarios', '/api/usuarios'], { method: "PUT", token, body: payload }),
};
