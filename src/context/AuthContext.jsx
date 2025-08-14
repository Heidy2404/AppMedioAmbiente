import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../services/api";

const AuthCtx = createContext(null);
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("mmar_token"));
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const data = await api.login(email, password); // { token, user }
    localStorage.setItem("mmar_token", data.token);
    setToken(data.token); setUser(data.user || null);
  };
  const logout = () => { localStorage.removeItem("mmar_token"); setToken(null); setUser(null); };

  const value = useMemo(() => ({ token, user, login, logout }), [token, user]);
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
export const useAuth = () => useContext(AuthCtx);
