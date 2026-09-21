import { useEffect, useState, type ReactNode } from "react";
import api, { setUnauthorizedHandler } from "../api/client";
import type { User } from "../types";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/user/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null)) // 401 just means logged out
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = async (whatsapp_number: string, password: string) => {
    const res = await api.post("/user/login", { whatsapp_number, password });
    setUser(res.data.user);
  };

  const register = async (
    name: string,
    email: string,
    whatsapp_number: string,
    password: string,
  ) => {
    const res = await api.post("/user/register", {
      name,
      email,
      whatsapp_number,
      password,
    });
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await api.post("/user/logout");
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
