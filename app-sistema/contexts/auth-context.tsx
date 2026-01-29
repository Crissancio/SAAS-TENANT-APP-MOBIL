import React, { createContext, useContext, useState, ReactNode } from "react";
import { loginRequest, getMeRequest } from "../services/api";
import { getMicroempresaById } from "../services/microempresa";

export type User = {
  nombre: string;
  email: string;
  id_usuario: number;
  estado: boolean;
  rol: string;
  id_microempresa: number;
  microempresa: Microempresa | null;
};

export type Microempresa = {
  nombre: string;
  nit: string;
  correo_contacto: string;
  direccion: string;
  telefono: string;
  tipo_atencion: string;
  latitud: number;
  longitud: number;
  dias_atencion: string;
  horario_atencion: string;
  moneda: string;
  logo: string;
  id_rubro: number;
  id_microempresa: number;
  estado: boolean;
  fecha_registro: string;
  rubro: {
    nombre: string;
    descripcion: string;
    id_rubro: number;
    activo: boolean;
  };
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      await loginRequest({ email, password });
      const meRes = await getMeRequest();
      const me = meRes.data;
      let microempresa = null;
      if (me.id_microempresa) {
        const microRes = await getMicroempresaById(me.id_microempresa);
        microempresa = microRes.data;
        console.log("Microempresa obtenida en login:", microempresa);
      }
      console.log("Microempresa no obtenida en login:", microempresa);
      setUser({ ...me, microempresa });
      return true;
    } catch (e) {
      setUser(null);
      console.error("Error en login:", e);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
