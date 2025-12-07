import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import NavBar from "../components/NavBarlogin";
import Home from "../pages/home"; // ✅ fundo igual ao login

const EsqueceuSenha: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/clients/ForgotPassword", { email });

      if (response.status === 201) {
        toast.success("Instruções enviadas com sucesso!");
        navigate("/codigodeverificacao", { state: email });
      } else {
        toast.error("Não foi possível enviar as instruções.");
      }
    } catch (error) {
      toast.error("Erro ao enviar email de recuperação.");
      console.error(error);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* NAVBAR */}
      <div className="relative z-50">
        <NavBar />
      </div>

      {/* FUNDO: HOME */}
      <div className="absolute inset-0 pointer-events-none">
        <Home />
      </div>

      {/* ESCURECIMENTO + BLUR */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>

      {/* CARD */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-10 max-w-md w-full">

          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Recuperar Senha
          </h2>
          <p className="text-gray-200 text-center mb-8">
            Insira o email vinculado à sua conta.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              name="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-white/20 text-white placeholder-gray-200 px-4 py-3 focus:ring-2 focus:ring-[#c6a875] outline-none"
              required
            />

            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-black transition-transform hover:scale-[1.03]"
              style={{ backgroundColor: "#c6a875" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#b89963")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#c6a875")}
            >
              Enviar Instruções
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

export default EsqueceuSenha;
