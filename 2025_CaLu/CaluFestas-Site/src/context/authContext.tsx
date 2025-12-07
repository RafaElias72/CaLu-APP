// src/context/AuthContext.tsx
import React, { useState, useEffect, ReactNode } from "react";
import { AuthContext, AuthContextType } from "./authContextBase";
import { User } from "../interfaces/user";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [perfil, setPerfil] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const res = await axios.get<User>("http://localhost:8080/api/privateClients/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPerfil(res.data);
        } catch (err) {
          console.error("Erro ao obter perfil", err);
          setPerfil(null);
        }
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  async function login(email: string, senha: string) {
    const res = await axios.post<{ token: string }>("http://localhost:8080/api/clients/login", { email, senha });
    const token = res.data?.token;
    if (token) {
      localStorage.setItem("token", token);
      const profile = await axios.get<User>("http://localhost:8080/api/privateClients/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Bem-vindo(a)", { toastId: "login-sucesso" });
      setPerfil(profile.data);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setPerfil(null);
  }

  const contextValue: AuthContextType = { perfil, loading, login, logout };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
};

