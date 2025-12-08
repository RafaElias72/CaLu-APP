import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Home from "../pages/home"; // fundo

const Register: React.FC = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/clients/", formData);
      toast.success("Registro realizado com sucesso!", { toastId: "RegistroBom" });
      navigate("/login")
    } catch (error) {
      console.error("Erro ao registrar:", error);
      toast.error("Erro ao registrar. Tente novamente.", { toastId: "RegistroRuim" });
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">

      {/* FUNDO: HOME */}
      <div className="absolute inset-0 pointer-events-none">
        <Home />
      </div>

      {/* Overlay + Blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-md"></div>

      {/* CARD */}
      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-10 max-w-md w-full">

          <h2 className="text-4xl font-bold text-white text-center mb-2">
            Criar Conta
          </h2>
          <p className="text-gray-200 text-center mb-8">
            Preencha seus dados para continuar
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="nome"
              placeholder="Nome Completo"
              value={formData.nome}
              onChange={handleChange}
              className="w-full rounded-lg bg-white/20 text-white placeholder-gray-200 px-4 py-3 focus:ring-2 focus:ring-[#c6a875] outline-none"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Endereço de email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg bg-white/20 text-white placeholder-gray-200 px-4 py-3 focus:ring-2 focus:ring-[#c6a875] outline-none"
              required
            />

            <input
              type="password"
              name="senha"
              placeholder="Senha"
              value={formData.senha}
              onChange={handleChange}
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
              Registrar-se
            </button>
          </form>

          <p className="mt-6 text-center text-gray-200">
            Já possui uma conta?{" "}
            <Link
              to="/login"
              className="font-semibold hover:underline transition"
              style={{ color: "#c6a875" }}
            >
              Acesse sua conta aqui!
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
