// src/components/PrivateRouteAdmin.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth"; 
import { toast } from "react-toastify";

interface PrivateRouteProps {
  children: ReactNode;
}

function PrivateRouteAdmin({ children }: PrivateRouteProps) {
  const { perfil, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  // Não logado
  if (!perfil) {
    toast.error("Você precisa estar logado", { toastId: "PrecisaLogin" });
    return <Navigate to="/login" />;
  }

  // Logado mas não admin
  if (perfil?.cargo !== "admin") {
    toast.error("Acesso restrito a administradores", { toastId: "SemPermissao" });
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default PrivateRouteAdmin;
