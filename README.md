# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

# Ministerio de Medio Ambiente — App Web

Aplicación web educativa e informativa sobre medio ambiente en República Dominicana. Permite consultar medidas ambientales, regulaciones, áreas protegidas, servicios, noticias y videos, además de reportar daños y ver reportes en mapa.

##  Tech Stack
- **Frontend:** React + Vite, TailwindCSS
- **Estado/IO:** Hooks (`useState`, `useEffect`), Fetch/Axios (según servicio)
- **Mapas:** (según implementación en `ReportsMap`/`AreasMap`)
- **Estilo:** Componentes propios con utilidades Tailwind

### `npm start`
npm run start -- es lo que se utiliza para correr el sistema




**Note: this is a one-way operation. Once you `eject`, you can't go back!**
### 🌿 App Ministerio de Medio Ambiente (React)

Proyecto de Apps Móviles – ITLA
Construí una SPA en React que consume la API de adamix.net/medioambiente para mostrar servicios, noticias, videos, áreas protegidas y, con sesión iniciada, normativas y reportes (crear, listar y ver en mapa).

### 🧭 Cómo navega la app (visión general)

No uso react-router por simplicidad. En su lugar, manejo una sección activa en memoria:

En App.js tengo:

section (estado de la vista actual)

isLoggedIn (si hay sesión)

go(seccion) (cambia de vista y hace scroll al contenido)

La vista actual se resuelve en ContentSection.jsx con un switch(section).

En home muestro tarjetas:

públicas: NavigationGrid

privadas (si hay sesión): VistaExtendida

### Fuera de home muestro un menú compacto: MiniNav (chips para saltar rápido entre vistas y volver al inicio).

Home (tarjetas) ──► go("news") ─► ContentSection ─► <NewsAPI />
                         ▲
                         │
                     MiniNav (chips)

### ⚙️ Arranque del proyecto
1) Instalar
npm install
npm i -D http-proxy-middleware

2) Dev (sin CORS)

package.json (nivel raíz):

"proxy": "https://adamix.net/medioambiente"


.env.development

REACT_APP_API_BASE=
REACT_APP_DEMO_LOGIN=1


En dev uso rutas relativas (pasan por el proxy y evito CORS).
REACT_APP_DEMO_LOGIN=1 me permite maquetar aunque la API de login esté caída; lo quito antes de entregar.

### src/setupProxy.js

const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/servicios","/noticias","/videos","/areas_protegidas","/medidas","/equipo","/voluntarios","/normativas","/reportes","/usuarios","/auth","/api"],
    createProxyMiddleware({ target: "https://adamix.net/medioambiente", changeOrigin: true, secure: true })
  );
};

3) Producir build

.env.production

### REACT_APP_API_BASE=https://adamix.net/medioambiente


Build:

npm run build

### 🧱 Arquitectura (src)
src/
  App.js
  services/api.js
  components/
    Header.jsx
    Slider.jsx
    ModalLogin.jsx
    NavigationGrid.jsx
    VistaExtendida.jsx
    MiniNav.jsx
    ContentSection.jsx
    ServicesAPI.jsx
    NewsAPI.jsx
    VideosAPI.jsx
    AreasList.jsx
    AreasMap.jsx
    MeasuresAPI.jsx
    TeamAPI.jsx
    VolunteerForm.jsx
    Regulations.jsx
    ReportDamage.jsx
    MyReports.jsx
    ReportsMap.jsx
    ChangePassword.jsx
setupProxy.js (solo dev)

### 🔌 Capa de API (src/services/api.js)

Escribí un helper http(path, opts) y un tryPaths([...]):

http() evita preflight en GET (no manda Content-Type si no hay body), parsea JSON y, si hay error, lanza err.status, err.body y err.url con el mensaje del backend.

tryPaths() prueba /recurso y /api/recurso (según cómo exponga la instancia).

Endpoints que consumo

Públicos

GET /servicios

GET /noticias

GET /videos

GET /areas_protegidas

GET /medidas

GET /equipo

POST /voluntarios

Privados (requieren token)

GET /normativas?tipo=&busqueda=

GET /reportes

POST /reportes

GET /reportes/{id}

PUT /usuarios (según instancia para actualizar datos/clave)

Auth

POST /auth/register, POST /auth/login, POST /auth/recover, (y reset/cambio de clave según instancia)

🧠 Estado global (App.js)

isLoggedIn lo leo de localStorage (mmar_login y mmar_token).

go(seccion) → seteo section y hago scroll suave hacia #content (ancla de ContentSection).

const go = (s) => {
  setSection(s);
  setTimeout(() => document.getElementById("content")?.scrollIntoView({behavior:"smooth"}), 0);
};


### Conexión de navegación:

NavigationGrid y VistaExtendida reciben go para cambiar de vista.

MiniNav aparece fuera de home para no “perder” navegación.

📄 Vistas y lógica (archivo → propósito → conexiones)



### Header.jsx

Para qué: encabezado con branding y botón de sesión.

Lógica: si no hay sesión, muestro “Iniciar sesión” (abre ModalLogin); si hay sesión, “Cerrar sesión” (limpia mmar_* y me lleva a home).

Conecta con: ModalLogin (abrir/cerrar), App.js (logout).

### Slider.jsx

Para qué: banner de héroe; puramente visual.

Lógica: no consume API; carousel simple.

Conecta con: Home.

### NavigationGrid.jsx (home → público)

Para qué: tarjetas para entrar a vistas públicas.

Lógica: cada tarjeta llama go("clave").

Conecta con: ContentSection via section.

Claves: about, services, news, videos, areas, areas-map, measures, team, volunteer.

### VistaExtendida.jsx (home → privado)

Para qué: tarjetas a módulos con token.

Lógica: solo se renderiza si isLoggedIn es true; llama go("clave").

Conecta con: ContentSection (vistas privadas).

Claves: regulations, report-damage, my-reports, reports-map, change-password.

### MiniNav.jsx (barra compacta fuera de home)

Para qué: no perder navegación cuando abro un módulo.

Lógica: chips que llaman go("clave") + botón “Inicio”.

Conecta con: todas las vistas (públicas y privadas).

### ContentSection.jsx (router de vistas)

Para qué: resuelve qué componente mostrar según section.

Lógica:

tengo needAuth(node) → si no hay token, muestro “Debes iniciar sesión…”.

retorno dentro de <section id="content"> para que go() haga scroll suave aquí.

Conecta con: todos los componentes de contenido.

### ModalLogin.jsx

Para qué: flujo de Login / Recuperar / Registrar.

Lógica:

Register: mando el cuerpo exacto { cedula, nombre, apellido, correo, password, telefono, matricula }.
Si responde 409 (usuario ya existe), intento login automático con los mismos datos.

Login: { correo, password }.

Al loguear: guardo mmar_token, mmar_login=true y cierro modal.

Conecta con: api.js (auth), App.js (cambiar isLoggedIn).

### ServicesAPI.jsx

Para qué: listar Servicios.

Lógica:

GET /servicios

estados: items, q, loading, err.

filtro por texto en cliente.

Conecta con: api.getServicios().

UI: cards con nombre, descripcion, y enlace (si hay).

### NewsAPI.jsx

Para qué: listar Noticias.

Lógica:

GET /noticias

mapeo tolerante de campos: titulo|title, resumen|descripcion, imagen|image, enlace|url, fecha|publicacion.

Conecta con: api.getNoticias().

### VideosAPI.jsx

Para qué: listar Videos (YouTube embebido si aplica).

Lógica:

GET /videos

extraigo el YouTube ID de varias formas (v=, youtu.be/, embed/); si no, dejo link.

Conecta con: api.getVideos().

### AreasList.jsx

Para qué: Áreas protegidas (lista + detalle).

Lógica:

GET /areas_protegidas

al hacer click en un área, muestro descripcion, imagen y latitud/longitud (si existen).

Conecta con: api.getAreasProtegidas().

### AreasMap.jsx

Para qué: Mapa de Áreas con marcadores.

Lógica:

GET /areas_protegidas

pinto latitud/longitud con react-leaflet, centrado en RD.

Conecta con: api.getAreasProtegidas().

### MeasuresAPI.jsx

Para qué: Medidas ambientales.

Lógica:

GET /medidas y muestro titulo + descripcion.

Conecta con: api.getMedidas().

### TeamAPI.jsx

Para qué: Equipo del ministerio.

Lógica:

GET /equipo; mapeo foto|imagen, cargo|rol, nombre o nombres/apellidos.

Conecta con: api.getEquipo().

### VolunteerForm.jsx

Para qué: Voluntariado (formulario).

Lógica:

POST /voluntarios

sanitizo cedula (11 dígitos) y telefono (10) antes de enviar.

Conecta con: api.solicitarVoluntario().

### Regulations.jsx (privado)

Para qué: Normativas ambientales.

Lógica:

GET /normativas?tipo=&busqueda= con token.

pinto campos titulo, tipo, numero, fecha_publicacion, descripcion, url_documento.

buscador por palabra clave (envío como busqueda).

Conecta con: api.getNormativas(token, { busqueda }).

Flujo textual
MiniNav → go("regulations") → ContentSection llama <Regulations /> → useEffect llama api.getNormativas(token,{busqueda}) → http() → proxy → backend → render lista.

### ReportDamage.jsx (privado)

Para qué: Crear reporte de daño ambiental.

Lógica:

formulario con titulo, descripcion, foto (si instancia lo permite), latitud, longitud.

POST /reportes (con token).

si OK → mensaje y limpio el form.

Conecta con: api.crearReporte(token, payload).

### MyReports.jsx (privado)

Para qué: ver mis reportes.

Lógica:

GET /reportes (con token).

muestro codigo, estado, comentario_ministerio, fecha, foto.

Conecta con: api.getReportes(token).

### ReportsMap.jsx (privado)

Para qué: mapa con mis reportes.

Lógica:

GET /reportes (con token)

pinto marcadores con latitud/longitud si están presentes.

Conecta con: api.getReportes(token).

### ChangePassword.jsx (privado)

Para qué: cambiar contraseña del usuario.

Lógica:

según la instancia: POST /auth/change-password o PUT /usuarios con el payload que pide.

validación de campos (confirmación).

Conecta con: api.changePassword(...) o api.updateUsuario(token, payload).

### 🔒 Autenticación y almacenamiento

Registro → Login → guardo mmar_token y mmar_login=true en localStorage.

Header muestra Cerrar sesión si hay token; al salir, limpio los mmar_* y regreso a home.

Los módulos privados pasan por needAuth() (si no hay token, mensaje de bloqueo).

### 🔁 Flujo típico 
Ver noticias
Home → click tarjeta “Noticias” → go("news") → ContentSection renderiza <NewsAPI /> → api.getNoticias() → lista.

Buscar normativa
Login → MiniNav → “Normativas” → <Regulations /> → api.getNormativas(token,{busqueda:q}).

Crear reporte
Login → “Reportar Daño” → <ReportDamage /> → api.crearReporte(token, payload) → OK → “Mis Reportes” → <MyReports /> (ver el nuevo) → “Mapa Reportes” → <ReportsMap />.