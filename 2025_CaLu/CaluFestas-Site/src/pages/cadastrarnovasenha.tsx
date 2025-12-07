import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "../components/NavBarlogin";
// ✅ ajuste este caminho conforme seu projeto:
import Home from "../pages/home"; 

const CadastrarNovaSenha: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const emailS = location.state;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.", { toastId: "senhas-diferentes" });
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/clients/ResetPassword",
        { email: emailS, password }
      );
      if (response.status === 200) {
        toast.success("Senha cadastrada com sucesso!", { toastId: "senha-ok" });
        navigate("/login");
      } else {
        toast.error("Não foi possível cadastrar a nova senha.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar nova senha.");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* NavBar por cima, transparente */}
      <div className="relative z-50">
        <NavBar />
      </div>

      {/* FUNDO: HOME renderizada atrás, sem clique */}
      <div className="absolute inset-0 pointer-events-none">
        <Home />
      </div>

      {/* Overlay escuro + blur (ESSENCIAL p/ enxergar mudança) */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md" />

      {/* Card central */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 sm:p-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-2">
            Cadastrar Nova Senha
          </h2>
          <p className="text-gray-200 text-center mb-8">
            Insira e confirme sua nova senha
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="Nova senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-white/20 text-white placeholder-gray-200 px-4 py-3 focus:ring-2 focus:ring-[#c6a875] outline-none"
              required
            />

            <input
              type="password"
              placeholder="Confirmar nova senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg bg-white/20 text-white placeholder-gray-200 px-4 py-3 focus:ring-2 focus:ring-[#c6a875] outline-none"
              required
            />

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-black transition-transform hover:scale-[1.03] shadow-lg"
              style={{ backgroundColor: "#c6a875" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b89963")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#c6a875")}
            >
              Cadastrar Nova Senha
            </button>
          </form>

          <p className="mt-6 text-center text-gray-200">
            <Link
              to="/login"
              className="font-semibold hover:underline transition"
              style={{ color: "#c6a875" }}
            >
              Voltar para o login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CadastrarNovaSenha;
