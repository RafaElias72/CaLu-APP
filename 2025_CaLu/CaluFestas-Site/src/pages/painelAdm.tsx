// ...existing code...
import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";

const PainelAdm: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <NavBar />

      <main className="max-w-4xl mx-auto px-6 py-20">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Painel Administrativo</h1>
          <p className="mt-2 text-sm text-gray-500">Acesse as seções abaixo para gerenciar o site</p>
        </header>

        <section className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row items-stretch gap-6">
            <Link
              to="/cadastrarproduto"
              className="flex-1 group block rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-indigo-50 p-6 hover:scale-[1.02] transform transition shadow-md hover:shadow-2xl"
              aria-label="Ir para cadastrar produto"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-indigo-600 text-white w-12 h-12 flex items-center justify-center shadow">
                  {/* ícone simples */}
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Produtos</h2>
                  <p className="text-sm text-gray-500 mt-1">Cadastrar e gerenciar produtos — preços, estoque e imagens.</p>
                </div>
              </div>

              <div className="mt-4 text-sm text-indigo-600 font-medium group-hover:underline">Abrir seção →</div>
            </Link>

            <Link
              to="/ComprasRealizadasAdm"
              className="flex-1 group block rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-green-50 p-6 hover:scale-[1.02] transform transition shadow-md hover:shadow-2xl"
              aria-label="Ir para locações realizadas"
            >
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-green-600 text-white w-12 h-12 flex items-center justify-center shadow">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 7h18M3 12h18M3 17h18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Locações</h2>
                  <p className="text-sm text-gray-500 mt-1">Ver locações realizadas, filtrar por status e atualizar pedidos.</p>
                </div>
              </div>

              <div className="mt-4 text-sm text-green-600 font-medium group-hover:underline">Abrir seção →</div>
            </Link>
          </div>
        </section>

        <footer className="mt-8 text-center text-xs text-gray-400">
          Versão administrativa — mantenha o acesso restrito
        </footer>
      </main>
    </div>
  );
};

export default PainelAdm;
// ...existing code...