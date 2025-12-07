// src/components/PrivateRoute.tsx
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import { toast } from "react-toastify";

interface PrivateRouteProps {
  children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const { perfil, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }
  
  if (!perfil) {
    toast.error("Você precisa estar logado", { toastId: "LoginPreciso" })
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
}

export default PrivateRoute;
