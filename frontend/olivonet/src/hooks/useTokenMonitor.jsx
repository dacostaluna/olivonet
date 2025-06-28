import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export function useTokenMonitor() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [expired, setExpired] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    if (!token) {
      setUserType(null);
      return;
    }

    const checkToken = () => {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp <= now) {
          setExpired(true);
        } else {
          setExpired(false);
        }

        if (decoded.tipo === "agricultor" || decoded.tipo === "cooperativa") {
          setUserType(decoded.tipo);
        } else {
          setUserType(null);
        }

      } catch (e) {
        console.error("Token inválido:", e);
        setExpired(true);
        setUserType(null);
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 3000);

    return () => clearInterval(interval);
  }, [token]);

  const clearSession = () => {
    localStorage.removeItem("token");
    setToken(null);
    setExpired(false);
    setUserType(null);
  };

  return { token, expired, clearSession, setToken, userType };
}
