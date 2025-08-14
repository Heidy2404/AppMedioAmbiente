import { useEffect, useState } from "react";
import Header from "./components/Header";
import ModalLogin from "./components/ModalLogin";
import ContentSection from "./components/ContentSection";
import Slider from "./components/Slider";
import NavigationGrid from "./components/NavigationGrid";
import VistaExtendida from "./components/VistaExtendida";
import MiniNav from "./components/MiniNav";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [section, setSection] = useState("home");
  const [showModal, setShowModal] = useState(false);


  const go = (s) => {
    setSection(s);
    // cuando cambia la sección, baja al contenido
    setTimeout(() => {
      document.getElementById("content")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  // Persistencia simple
  useEffect(() => {
    const saved = localStorage.getItem("mmar_login");
    if (saved === "true") setIsLoggedIn(true);
    const logged = localStorage.getItem("mmar_login") === "true";
    const hasToken = !!localStorage.getItem("mmar_token");
    if (logged || hasToken) setIsLoggedIn(true);
  }, []);

  const openLoginModal = () => setShowModal(true);

  const handleLoginSuccess = (userInfo) => {
    setIsLoggedIn(true);
    localStorage.setItem("mmar_login", "true");
    localStorage.setItem("mmar_user", JSON.stringify(userInfo));
    setShowModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("mmar_login");
    localStorage.removeItem("mmar_user");
    localStorage.removeItem("mmar_token");
    setSection("home");
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={openLoginModal}
        onLogoutClick={handleLogout}
      />

      <main className="container mx-auto px-4 py-6">
        <Slider />
        {section === "home" && (
          <>
            <NavigationGrid go={go} isLoggedIn={isLoggedIn} />
            {isLoggedIn && <VistaExtendida go={go} />}
          </>
        )}
        {section !== "home" && (<MiniNav go={go} current={section} isLoggedIn={isLoggedIn} />)}
        <ContentSection section={section} />
      </main>

      <ModalLogin
        visible={showModal}
        closeModal={() => setShowModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
