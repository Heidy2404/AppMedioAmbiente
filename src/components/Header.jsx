const Header = ({ onLoginClick, onLogoutClick, isLoggedIn }) => {
  return (
    <header className="bg-env-green text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl">🌿</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Ministerio de Medio Ambiente</h1>
              <p className="text-sm opacity-90">República Dominicana</p>
            </div>
          </div>

          {isLoggedIn ? (
            <button
              onClick={onLogoutClick}
              className="px-4 py-2 rounded-lg font-semibold transition bg-white text-env-green hover:bg-green-50"
            >
              Cerrar sesión
            </button>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-4 py-2 rounded-lg font-semibold transition bg-white text-env-green hover:bg-green-50"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
