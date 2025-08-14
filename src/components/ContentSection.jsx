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
import AboutMinisterio from "./AboutMinisterio";
import AboutDev from "./AboutDev";

const ContentSection = ({ section }) => {
  const token = localStorage.getItem("mmar_token");
  const needAuth = (node) =>
    token ? node : <p className="p-4 text-rose-600">Debes iniciar sesión para ver esta sección.</p>;

  let view = null;

  switch (section) {
    // Públicos
    case "about":       view = <AboutMinisterio />; break;  // 🏛️ Sobre el Ministerio
    case "acerca":      view = <AboutDev />; break;         // ℹ️ Acerca del equipo
    case "services":    view = <ServicesAPI />; break;
    case "news":        view = <NewsAPI />; break;
    case "videos":      view = <VideosAPI />; break;
    case "areas":       view = <AreasList />; break;
    case "areas-map":   view = <AreasMap />; break;
    case "measures":    view = <MeasuresAPI />; break;
    case "team":        view = <TeamAPI />; break;
    case "volunteer":   view = <VolunteerForm />; break;

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

  return (
    <section id="content" className="mt-6">
      {view}
    </section>
  );
};

export default ContentSection;
