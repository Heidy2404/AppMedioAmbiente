
import DevTeam from "./DevTeam";

export default function AboutDev() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-env-dark mb-4">👩‍💻 Acerca del equipo</h2>
      <p className="text-gray-700 mb-4">
        Esta aplicación fue desarrollada como proyecto de la asignatura de Apps Móviles (ITLA).
        Aquí presentamos al equipo, con su matrícula y medios de contacto.
      </p>
      <DevTeam />
    </section>
  );
}
