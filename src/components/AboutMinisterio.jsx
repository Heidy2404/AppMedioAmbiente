export default function AboutMinisterio() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      {/* Sección principal */}
      <h2 className="text-3xl font-bold text-env-dark mb-6">🏛️ Sobre el Ministerio</h2>
      
      <div className="space-y-8">
        {/* Historia ampliada */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-env-dark mb-4">📜 Nuestra Historia</h3>
          <p className="text-gray-700 mb-3">
            El Ministerio de Medio Ambiente y Recursos Naturales de República Dominicana fue creado el 
            <span className="font-semibold"> 18 de agosto del año 2000</span> mediante la 
            <span className="font-semibold"> Ley General sobre Medio Ambiente y Recursos Naturales No. 64-00</span>, 
            marcando un hito en la conservación ambiental del país :cite[1].
          </p>
          <p className="text-gray-700 mb-3">
            Sin embargo, la protección ambiental en el país se remonta a 1844 con el decreto sobre conservación de bosques. 
            Otros hitos históricos incluyen:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1 mb-3">
            <li><span className="font-semibold">1928:</span> Ley de protección de montes y aguas</li>
            <li><span className="font-semibold">1931:</span> Primera ley sobre biodiversidad y vida silvestre</li>
            <li><span className="font-semibold">1965:</span> Creación del Instituto Nacional de Recursos Hidráulicos (INDRHI)</li>
          </ul>
          <p className="text-gray-700">
            En 2010, mediante el decreto No. 56-10, se convirtió formalmente en Ministerio, consolidando su rol rector 
            en la gestión ambiental nacional :cite[1].
          </p>
        </div>

        {/* Estructura organizativa */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-env-dark mb-4">🏢 Estructura Organizacional</h3>
          <p className="text-gray-700 mb-4">
            El Ministerio opera a través de seis viceministerios especializados que cubren todas las dimensiones ambientales:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-env-green mb-2">Viceministerios Especializados:</h4>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Gestión Ambiental</li>
                <li>Áreas Protegidas y Biodiversidad</li>
                <li>Suelos y Aguas</li>
                <li>Cooperación Internacional</li>
                <li>Recursos Costeros y Marinos</li>
                <li>Recursos Forestales</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-env-green mb-2">Instituciones Adscritas:</h4>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Parque Zoológico Nacional</li>
                <li>Museo Nacional de Historia Natural</li>
                <li>Jardín Botánico Nacional</li>
                <li>Instituto Nacional de Recursos Hidráulicos (INDRHI)</li>
                <li>Acuario Nacional</li>
                <li>Fondo Nacional para el Medio Ambiente (FONDOMARENA)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Misión y Visión */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-env-dark mb-4">🎯 Misión</h3>
            <p className="text-gray-700">
              <span className="font-semibold">"Regir la gestión del medio ambiente, los ecosistemas y los recursos naturales"</span> 
              para contribuir al desarrollo sostenible de la República Dominicana, protegiendo la biodiversidad y aplicando 
              medidas contra la deforestación y daños ambientales :cite[1].
            </p>
          </div>
          
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-env-dark mb-4">🔭 Visión</h3>
            <p className="text-gray-700">
              Ser una institución <span className="font-semibold">"eficaz, eficiente y transparente"</span> que integra 
              la dimensión ambiental en todas las decisiones nacionales, garantizando la sostenibilidad como pilar del 
              desarrollo nacional.
            </p>
          </div>
        </div>

        {/* Logros recientes */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-env-dark mb-4">🚀 Logros Recientes (2023-2025)</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-env-green mb-2">📊 Transparencia en Permisos</h4>
              <p className="text-gray-700 mb-2">
                Implementación de plataforma digital para gestión ambiental:
              </p>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li><span className="font-semibold">4,021</span> solicitudes procesadas digitalmente</li>
                <li><span className="font-semibold">43%</span> de trámites concluidos</li>
                <li>Reducción de tiempos de gestión a <span className="font-semibold">63 días</span> promedio</li>
                <li>Eliminación completa de expedientes físicos</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-env-green mb-2">🌿 Innovación Ambiental</h4>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>Automatización de permisos para materiales de construcción</li>
                <li>Seguimiento en tiempo real de trámites ambientales</li>
                <li>Control de extracción y transporte de recursos naturales</li>
                <li>Plataforma única de consulta ciudadana</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-env-light rounded-lg border-l-4 border-env-green">
            <p className="text-gray-700 italic">
              "Los permisos ambientales garantizan la protección de los ecosistemas. No podemos permitir que acaben con los ríos o montañas para que alguien se gane unos pesitos. El desarrollo debe ser sostenible."
              <span className="block font-semibold mt-2">- Miguel Ceara Hatton, Ministro de Medio Ambiente :cite[3]</span>
            </p>
          </div>
        </div>

        {/* Videos institucionales */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-env-dark mb-4">📹 Contenido Multimedia Institucional</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            {/* Video 1 */}
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                className="w-full h-48 rounded-lg"
                src="https://www.youtube.com/embed/c1MQJofzHF0" 
                title="Video institucional del Ministerio"
                allowFullScreen
              ></iframe>
              <p className="mt-2 text-sm text-gray-600">Presentación institucional</p>
            </div>
            
            {/* Video 2 */}
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                className="w-full h-48 rounded-lg"
                src="https://www.youtube.com/embed/ZP8nNCoyfN8" 
                title="Programa REDD+ de reforestación"
                allowFullScreen
              ></iframe>
              <p className="mt-2 text-sm text-gray-600">Programa REDD+</p>
            </div>
            
            {/* Video 3 */}
            <div className="aspect-w-16 aspect-h-9">
              <iframe 
                className="w-full h-48 rounded-lg"
                src="https://www.youtube.com/embed/r54n_Z2h4wQ" 
                title="Gestión ministerial"
                allowFullScreen
              ></iframe>
              <p className="mt-2 text-sm text-gray-600">Informe de gestión</p>
            </div>
          </div>
        </div>

        {/* Información de contacto */}
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-env-dark mb-4">📍 Información de Contacto</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-env-green mb-2">Sede Central</h4>
              <p className="text-gray-700">
                Av. Cayetano Germosén, esq. Gregorio Luperón<br/>
                Urbanización Pradera Verde, Honduras del Norte<br/>
                Santo Domingo, Distrito Nacional<br/>
                <span className="font-semibold">Teléfono:</span> (809) 567-4300<br/>
                <span className="font-semibold">Web:</span> www.ambiente.gob.do
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-env-green mb-2">Redes Sociales</h4>
              <p className="text-gray-700">
                <span className="font-semibold">Twitter:</span> @AmbienteRD<br/>
                <span className="font-semibold">Facebook:</span> MinisterioMedioAmbienteRD<br/>
                <span className="font-semibold">Instagram:</span> AmbienteRD<br/>
                <span className="font-semibold">YouTube:</span> MinisterioMedioAmbienteRD
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}