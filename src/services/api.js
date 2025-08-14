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
    tryPaths(["/auth/register", "/api/auth/register"], { method: "POST", body: payload }),
  login: (correo, password) =>
    tryPaths(["/auth/login", "/api/auth/login"], { method: "POST", body: { correo, password } }),
  recover: (correo) =>
    tryPaths(["/auth/recover", "/api/auth/recover"], { method: "POST", body: { correo } }),
  resetPass: (payload) =>
    tryPaths(["/auth/reset", "/api/auth/reset"], { method: "POST", body: payload }),

  // ------- Públicos -------
  getServicios: () => tryPaths(["/servicios", "/api/servicios"]),
  getServicioById: (id) => tryPaths([`/servicios/${id}`, `/api/servicios/${id}`]),
  getNoticias: () => tryPaths(["/noticias", "/api/noticias"]),
  getVideos: () => tryPaths(["/videos", "/api/videos"]),
  getAreasProtegidas: () => tryPaths(["/areas_protegidas", "/api/areas_protegidas"]),
  getMedidas: () => tryPaths(["/medidas", "/api/medidas"]),
  getEquipo: () => tryPaths(["/equipo", "/api/equipo"]),
  solicitarVoluntario: (payload) =>
    tryPaths(["/voluntarios", "/api/voluntarios"], { method: "POST", body: payload }),

  // ------- Protegidos -------
  // GET /normativas?tipo=&busqueda=
  getNormativas: (token, { tipo, busqueda } = {}) => {
    const qs = new URLSearchParams();
    if (tipo) qs.set("tipo", tipo);
    if (busqueda) qs.set("busqueda", busqueda);
    const tail = qs.toString() ? `?${qs}` : "";
    return tryPaths([`/normativas${tail}`, `/api/normativas${tail}`], { token });
  },

  getReportes: (token) => tryPaths(["/reportes", "/api/reportes"], { token }),
  crearReporte: (token, payload) =>
    tryPaths(["/reportes", "/api/reportes"], { method: "POST", token, body: payload }),
  getReporteById: (token, id) =>
    tryPaths([`/reportes/${id}`, `/api/reportes/${id}`], { token }),

  // PUT /usuarios (perfil/cambio de clave según doc)
  updateUsuario: (token, payload) =>
    tryPaths(["/usuarios", "/api/usuarios"], { method: "PUT", token, body: payload }),
};
