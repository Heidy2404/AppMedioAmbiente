
export default function AboutMinisterio() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-env-dark mb-4">🏛️ Sobre el Ministerio</h2>
      <p className="text-gray-700 mb-4">
        El Ministerio de Medio Ambiente y Recursos Naturales de la República Dominicana
        tiene como misión proteger, conservar y gestionar sosteniblemente los recursos
        naturales y el ambiente del país.
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Objetivos</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Conservación de la biodiversidad y áreas protegidas.</li>
            <li>Gestión integral de residuos y educación ambiental.</li>
            <li>Fiscalización y cumplimiento de normativas ambientales.</li>
          </ul>
        </div>
        <div className="bg-white rounded-xl border p-4">
          <h3 className="font-semibold mb-2">¿Qué verás en esta app?</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Servicios, noticias y videos educativos.</li>
            <li>Áreas protegidas (lista y mapa).</li>
            <li>Normativas y reportes (con inicio de sesión).</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
