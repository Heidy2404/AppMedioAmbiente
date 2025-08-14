// src/components/VistaExtendida.jsx
export default function VistaExtendida({ go }) {
  return (
    <section className="grid md:grid-cols-3 gap-4">
      <button onClick={() => go("regulations")} className="p-6 rounded-xl shadow bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <div className="text-3xl mb-2">📜</div>
        <div className="font-semibold">Normativas</div>
      </button>

      <button onClick={() => go("report-damage")} className="p-6 rounded-xl shadow bg-gradient-to-r from-red-600 to-red-500 text-white">
        <div className="text-3xl mb-2">⚠️</div>
        <div className="font-semibold">Reportar Daño</div>
      </button>

      <button onClick={() => go("my-reports")} className="p-6 rounded-xl shadow bg-gradient-to-r from-purple-600 to-purple-500 text-white">
        <div className="text-3xl mb-2">📊</div>
        <div className="font-semibold">Mis Reportes</div>
      </button>

      <button onClick={() => go("reports-map")} className="p-6 rounded-xl shadow bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
        <div className="text-3xl mb-2">🗺️</div>
        <div className="font-semibold">Mapa Reportes</div>
      </button>

      <button onClick={() => go("change-password")} className="p-6 rounded-xl shadow bg-gradient-to-r from-slate-700 to-slate-600 text-white">
        <div className="text-3xl mb-2">🔐</div>
        <div className="font-semibold">Cambiar Clave</div>
      </button>
    </section>
  );
}
