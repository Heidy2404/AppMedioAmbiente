// src/components/NavigationGrid.jsx
export default function NavigationGrid({ go }) {
  return (
    <section className="grid md:grid-cols-4 gap-4">
      <button onClick={() => go("about")} className="p-6 bg-white rounded-xl shadow hover:shadow-md border">
        <div className="text-3xl mb-2">🏛️</div>
        <div className="font-semibold">Sobre Nosotros</div>
      </button>

      <button onClick={() => go("services")} className="p-6 bg-white rounded-xl shadow hover:shadow-md border">
        <div className="text-3xl mb-2">🛠️</div>
        <div className="font-semibold">Servicios</div>
      </button>

      <button onClick={() => go("news")} className="p-6 bg-white rounded-xl shadow hover:shadow-md border">
        <div className="text-3xl mb-2">📰</div>
        <div className="font-semibold">Noticias</div>
      </button>

      <button onClick={() => go("videos")} className="p-6 bg-white rounded-xl shadow hover:shadow-md border">
        <div className="text-3xl mb-2">🎥</div>
        <div className="font-semibold">Videos</div>
      </button>

      {/* 👇 nuevos módulos públicos */}
      <button onClick={() => go("areas")} className="p-6 bg-white rounded-xl shadow hover:shadow-md border">
        <div className="text-3xl mb-2">🗺️</div>
        <div className="font-semibold">Áreas Protegidas</div>
      </button>

      <button onClick={() => go("areas-map")} className="p-6 bg-white rounded-xl shadow hover:shadow-md border">
        <div className="text-3xl mb-2">🧭</div>
        <div className="font-semibold">Mapa de Áreas</div>
      </button>

      <button onClick={() => go("measures")} className="p-6 bg-white rounded-xl shadow hover:shadow-md border">
        <div className="text-3xl mb-2">🧩</div>
        <div className="font-semibold">Medidas</div>
      </button>

      <button onClick={() => go("team")} className="p-6 bg-white rounded-xl shadow hover:shadow-md border">
        <div className="text-3xl mb-2">👥</div>
        <div className="font-semibold">Equipo</div>
      </button>

      <button onClick={() => go("volunteer")} className="p-6 bg-white rounded-xl shadow hover:shadow-md border md:col-span-2">
        <div className="text-3xl mb-2">🤝</div>
        <div className="font-semibold">Voluntariado</div>
      </button>
    </section>
  );
}
