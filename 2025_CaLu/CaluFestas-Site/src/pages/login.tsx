import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth";
import Home from "../pages/home"; // <- FUNDO: Home atrás

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", senha: "" });

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.senha);
      navigate("/");
    } catch (error) {
      console.error("Erro ao acessar sua conta:", error);
      toast.error("Erro ao acessar sua conta. Tente novamente.");
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* FUNDO: HOME */}
      <div className="absolute inset-0 pointer-events-none">
        <Home />
      </div>

      {/* Overlay + blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>

      {/* Card */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-10 max-w-md w-full">
          <h2 className="text-4xl font-bold text-white text-center mb-2">
            Bem-vindo
          </h2>
          <p className="text-gray-200 text-center mb-8">Acesse sua conta</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Endereço de email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg bg-white/20 text-white placeholder-gray-200 px-4 py-3 focus:ring-2 focus:ring-yellow-400 outline-none"
              required
              autoComplete="email"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="senha"
                placeholder="Senha"
                value={formData.senha}
                onChange={handleChange}
                className="w-full rounded-lg bg-white/20 text-white placeholder-gray-200 px-4 py-3 pr-12 focus:ring-2 focus:ring-yellow-400 outline-none"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* <<< AQUI ESTÁ O LINK "ESQUECEU A SENHA?" >>> */}
            <div className="text-right -mt-1">
              <Link
                to="/esqueceusenha"
                className="text-sm font-medium hover:underline transition"
                style={{ color: "#c6a875" }}
              >
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-black transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: "#c6a875" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b89963")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#c6a875")}
            >
              Entrar
            </button>
          </form>

          <p className="mt-6 text-center text-gray-200">
            Ainda não possui uma conta?{" "}
            <Link
              to="/cadastro"
              className="font-semibold hover:underline transition"
              style={{ color: "#c6a875" }}
            >
              Registre-se aqui!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
