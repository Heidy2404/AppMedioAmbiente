// src/components/ContentSection.jsx
import ChangePassword from "./ChangePassword";
import ReportsMap from "./ReportsMap";
import Regulations from "./Regulations";
import ReportDamage from "./ReportDamage";
import MyReports from "./MyReports";
import ServicesAPI from "./ServicesAPI";
import NewsAPI from "./NewsAPI";
import VideosAPI from "./VideosAPI";
import AreasList from "./AreasList";
import AreasMap from "./AreasMap";
import MeasuresAPI from "./MeasuresAPI";
import TeamAPI from "./TeamAPI";
import VolunteerForm from "./VolunteerForm";

const ContentSection = ({ section }) => {
  const token = localStorage.getItem("mmar_token");
  const needAuth = (node) =>
    token ? node : <p className="p-4 text-rose-600">Debes iniciar sesión para ver esta sección.</p>;

  let view = null;

  switch (section) {
    // Públicos
    case "about":
      view = (
        <>
          <h2 className="text-2xl font-bold text-env-dark mb-4">🏛️ Sobre Nosotros</h2>
          <p className="text-gray-700">
            El Ministerio de Medio Ambiente fue creado en el año 2000 para proteger los
            recursos naturales de la República Dominicana.
          </p>
        </>
      );
      break;
    case "services":     view = <ServicesAPI />; break;
    case "news":         view = <NewsAPI />; break;
    case "videos":       view = <VideosAPI />; break;
    case "areas":        view = <AreasList />; break;
    case "areas-map":    view = <AreasMap />; break;
    case "measures":     view = <MeasuresAPI />; break;
    case "team":         view = <TeamAPI />; break;
    case "volunteer":    view = <VolunteerForm />; break;

    // Privados
    case "regulations":     view = needAuth(<Regulations />); break;
    case "report-damage":   view = needAuth(<ReportDamage />); break;
    case "my-reports":      view = needAuth(<MyReports />); break;
    case "reports-map":     view = needAuth(<ReportsMap />); break;
    case "change-password": view = needAuth(<ChangePassword />); break;

    default:
      view = (
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">🌿</div>
          <h2 className="text-2xl font-bold text-env-dark mb-2">Bienvenido</h2>
          <p>Selecciona una opción del menú para comenzar</p>
        </div>
      );
  }

  // Wrapper mínimo (sin fondo/padding extra) + ancla para hacer scroll
  return (
    <section id="content" className="mt-6">
      {view}
    </section>
  );
};

export default ContentSection;
