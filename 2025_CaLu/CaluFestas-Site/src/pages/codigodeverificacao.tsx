import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBarlogin';
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
// import axios from 'axios'; // Comentado para teste

const CodigoDeVerificacao: React.FC = () => {
  const [email, setEmail] = useState('');
  const [codigo, setCodigo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- Simulação para teste da tela ---
    // if (codigo === "123456") {
    //   toast('Código verificado com sucesso!');
    //   navigate('/cadastrarnovasenha');
    // } else {
    //   toast('Código inválido. Tente novamente.');
    // }

    // --- Código real comentado ---
    try {
      const response = await axios.post('http://localhost:8080/api/clients/verifyCode', {
        email: email,
        otp_code: codigo,
      });
      if (response.status === 200) {
        toast.success('Código verificado com sucesso!');
        navigate('/cadastrarnovasenha', { state: email });
      } else {
        toast.error('Código inválido. Tente novamente.');
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error('Erro: ' + error.response.data.message);
      } else {
        toast.error('Erro ao verificar código. Verifique o console.');
      }
      console.error(error);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex h-screen">
        <div
          className="w-1/2 flex items-center justify-center relative"
          style={{
            backgroundImage: "url('src/assets/foto 8.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <h1 className="relative text-white text-5xl font-bold z-10">CaLu - Festas e Eventos</h1>
        </div>

        <div className="w-1/2 bg-gray-100 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-4">Verificação de Email</h2>
            <p className="text-gray-600 mb-8">
              Digite seu email e o código de verificação enviado para você.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="codigo"
                  placeholder="Código de verificação"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
              >
                Verificar Código
              </button>
            </form>

            <p className="mt-4 text-center text-gray-600">
              <Link to="/login" className="text-blue-600 hover:underline">
                Voltar para o Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CodigoDeVerificacao;