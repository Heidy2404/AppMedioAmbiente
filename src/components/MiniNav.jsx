
export default function MiniNav({ go, current, isLoggedIn }) {
  const pub = [
    { key: "about", label: "Sobre", emoji: "🏛️" },
    { key: "services", label: "Servicios", emoji: "🛠️" },
    { key: "news", label: "Noticias", emoji: "📰" },
    { key: "videos", label: "Videos", emoji: "🎥" },
    { key: "areas", label: "Áreas", emoji: "🗺️" },
    { key: "areas-map", label: "Mapa Áreas", emoji: "🧭" },
    { key: "measures", label: "Medidas", emoji: "🧩" },
    { key: "team", label: "Equipo", emoji: "👥" },
    { key: "volunteer", label: "Voluntariado", emoji: "🤝" },

    { key: "acerca", label: "Acerca", emoji: "ℹ️" },

  ];

  const priv = [
    { key: "regulations", label: "Normativas", emoji: "📜" },
    { key: "report-damage", label: "Reportar", emoji: "⚠️" },
    { key: "my-reports", label: "Mis Reportes", emoji: "📊" },
    { key: "reports-map", label: "Mapa Reportes", emoji: "🗺️" },
    { key: "change-password", label: "Cambiar Clave", emoji: "🔐" },

  ];

  const Chip = ({ k, label, emoji }) => {
    const active = current === k;
    return (
      <button
        onClick={() => go(k)}
        className={
          "px-3 py-2 rounded-lg border whitespace-nowrap " +
          (active
            ? "bg-emerald-600 text-white border-emerald-600"
            : "bg-white hover:bg-emerald-50")
        }
      >
        <span className="mr-1">{emoji}</span>{label}
      </button>
    );
  };

  return (
    <nav className="mb-4 overflow-x-auto sticky top-2 z-20 bg-white/80 backdrop-blur rounded-xl p-2 border">
      <div className="flex gap-2 items-center">
        <button
          onClick={() => go("home")}
          className="px-3 py-2 rounded-lg border bg-white hover:bg-emerald-50 whitespace-nowrap"
        >
          🏠 Inicio
        </button>

        {pub.map(i => <Chip key={i.key} k={i.key} label={i.label} emoji={i.emoji} />)}
        {isLoggedIn && priv.map(i => <Chip key={i.key} k={i.key} label={i.label} emoji={i.emoji} />)}
      </div>
    </nav>
  );
}
