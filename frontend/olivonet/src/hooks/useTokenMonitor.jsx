import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export function useTokenMonitor() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!token) return; // Solo monitoreamos si hay token

    const checkToken = () => {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp <= now) {
          setExpired(true);
        }
      } catch (e) {
        console.error("Token inválido:", e);
        setExpired(true);
      }
    };

    checkToken(); // Verifica inmediatamente

    const interval = setInterval(checkToken, 3000); // Y cada 3 segundos

    return () => clearInterval(interval);
  }, [token]);

  const clearSession = () => {
    localStorage.removeItem("token");
    setToken(null);
    setExpired(false);
  };

  return { token, expired, clearSession, setToken };
}
