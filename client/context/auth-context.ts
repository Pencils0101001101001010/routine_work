import { createContext, useContext } from "react";
import type { User } from "../types";

export interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (whatsapp_number: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    whatsapp_number: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("UseAuth must be used within AuthProvider");

  return ctx;
};
