import React from 'react';
import NavBar from '../components/NavBar.tsx';
import CaLuLogo from '../assets/CaLu.png';
import foto1 from '../assets/foto 1.jpg';
import foto2 from '../assets/foto 2.jpg';
import foto3 from '../assets/foto 3.jpg';
import foto4 from '../assets/foto 4.jpg';
import foto5 from '../assets/foto 5.jpg';
import foto11 from '../assets/foto 11.jpg';
import foto12 from '../assets/foto 12.jpg';
import foto13 from '../assets/foto 13.jpg';
import fotoCalu from '../assets/foto calu .jpeg';
import folha2 from '../assets/folha 2.png';
import folha3 from '../assets/folha 3.png';
import folha4 from '../assets/folha 4.png';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <>
      <NavBar />
      
      {/* Hero Section com background da festa */}
      <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
        {/* Background image com overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${fotoCalu})`,
          }}
        >
        </div>

        {/* Conteúdo Principal - Apenas título e botão */}
        <div className="relative z-10 flex items-center justify-center h-screen px-8 lg:px-16">
          <div className="text-center max-w-4xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
              Transformamos sonhos<br />
              em <span className="text-[#c6a875]">Festas Inesquecíveis!</span>
            </h1>
            
            <div className="mb-8">
              <Link to={"/catalogo"}>
                <button className="bg-[#c6a875] hover:bg-[#6c63ff] text-white font-bold px-10 py-4 rounded-lg transition-all transform hover:scale-105 shadow-lg">
                  Ver Catálogo
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Card da Empresa e Locação - Unificada no fundo verde */}
      <div className="py-20 relative overflow-hidden" style={{ backgroundColor: '#1a3d39' }}>
        {/* Imagens das folhas decorativas */}
        <img 
          src={folha2} 
          alt="Folhas decorativas" 
          className="pointer-events-none absolute left-0 top-0 h-[380px] opacity-40 -translate-x-4 translate-y-4"
        />
        <img 
          src={folha4} 
          alt="Folhas decorativas" 
          className="pointer-events-none absolute right-0 bottom-0 h-[300px] opacity-30 translate-x-4 -translate-y-8 rotate-12"
        />
        <img 
          src={folha3} 
          alt="Folhas decorativas" 
          className="pointer-events-none absolute top-1/2 left-0 h-[250px] opacity-25 -translate-x-2 rotate-180"
        />
        <img 
          src={folha3} 
          alt="Folhas decorativas" 
          className="pointer-events-none absolute top-1/4 right-0 h-[220px] opacity-35 translate-x-2 rotate-45"
        />
        <img 
          src={folha2} 
          alt="Folhas decorativas" 
          className="pointer-events-none absolute bottom-1/4 left-1/4 h-[180px] opacity-20 rotate-90"
        />
        <img 
          src={folha3} 
          alt="Folhas decorativas" 
          className="pointer-events-none absolute top-1/3 right-1/3 h-[200px] opacity-30 -rotate-30"
        />

        {/* Painel vertical à esquerda */}
        <div className="absolute inset-y-0 left-0 w-[14px] bg-black/30"></div>

        {/* Container principal */}
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          {/* Conteúdo principal - Card da empresa */}
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 relative z-10 mb-20">
            {/* Card de apresentação */}
            <div className="bg-white rounded-2xl shadow-lg p-10 md:w-1/2">
              <img
                src={CaLuLogo}
                alt="Logo CaLu Festas e Eventos"
                className="w-32 mb-4"
              />
              <h2 className="text-2xl font-bold text-[#1a3d39] mb-3">CaLu Festas e Eventos</h2>
              <p className="text-[#1a3d39]/80 mb-6 leading-relaxed">
                Somos uma empresa especializada em organização de festas e eventos! 
                Conte conosco para tornar a sua festa em um evento mais que especial.
              </p>

            </div>

            {/* Imagem da mesa */}
            <div className="rounded-2xl overflow-hidden shadow-xl md:w-1/2">
              <img
                src={foto1}
                alt="Mesa decorada com folhas tropicais"
                className="w-full h-80 object-cover"
              />
            </div>
          </div>

          {/* Seção de locação */}
          <div className="text-center text-white">
            <h3 className="text-4xl font-bold mb-4">Locação</h3>
            <p className="text-[#EDE6D6]/80 mb-12 text-lg">
              Móveis e utensílios com estilo
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div className="group cursor-pointer">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform group-hover:scale-105">
                  <img src={foto1} alt="Evento 1" className="w-full h-64 object-cover" />
                </div>
              </div>
              <div className="group cursor-pointer">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform group-hover:scale-105">
                  <img src={foto2} alt="Evento 2" className="w-full h-64 object-cover" />
                </div>
              </div>
              <div className="group cursor-pointer">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform group-hover:scale-105">
                  <img src={foto3} alt="Evento 3" className="w-full h-64 object-cover" />
                </div>
              </div>
              <div className="group cursor-pointer">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform group-hover:scale-105">
                  <img src={foto4} alt="Evento 4" className="w-full h-64 object-cover" />
                </div>
              </div>
              <div className="group cursor-pointer">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform group-hover:scale-105">
                  <img src={foto5} alt="Evento 5" className="w-full h-64 object-cover" />
                </div>
              </div>
              <div className="group cursor-pointer">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform group-hover:scale-105">
                  <img src={foto13} alt="Evento 6" className="w-full h-64 object-cover" />
                </div>
              </div>
              <div className="group cursor-pointer">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform group-hover:scale-105">
                  <img src={foto11} alt="Evento 7" className="w-full h-64 object-cover" />
                </div>
              </div>
              <div className="group cursor-pointer">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform group-hover:scale-105">
                  <img src={foto12} alt="Evento 8" className="w-full h-64 object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer com contatos */}
      <div className="bg-yellow-50 py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* WhatsApp */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="bg-green-500 hover:bg-green-600 rounded-full p-6 mb-6 shadow-lg transform group-hover:scale-110 transition-all">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </div>
              <span className="text-gray-700 font-semibold text-lg">+55 19 96895-0974</span>
            </div>
            
            {/* Instagram */}
            <div className="flex flex-col items-center group cursor-pointer">
              <Link to={"https://www.instagram.com/calu_conceitos/"}>
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full p-6 mb-6 shadow-lg transform group-hover:scale-110 transition-all">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
              </Link>
              <span className="text-gray-700 font-semibold text-lg">@CALU_CONCEITOS</span>
            </div>
            
            {/* Telefone */}
            <div className="flex flex-col items-center group cursor-pointer">
              <div className="bg-blue-500 hover:bg-blue-600 rounded-full p-6 mb-6 shadow-lg transform group-hover:scale-110 transition-all">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
              </div>
              <span className="text-gray-700 font-semibold text-lg">+55 19 96895-0974</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;