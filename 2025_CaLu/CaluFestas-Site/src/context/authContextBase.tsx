import { createContext } from "react";
import { User } from "../interfaces/user";

// Define o que o AuthContext quer expor
export interface AuthContextType {
  perfil: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
