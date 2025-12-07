import React, { useState } from 'react';
import NavBar from '../components/NavBarADM';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import foto1 from '../assets/foto 1.jpg';
import foto2 from '../assets/foto 2.jpg';
import foto3 from '../assets/foto 3.jpg';
import foto4 from '../assets/foto 4.jpg';
import foto5 from '../assets/foto 5.jpg';

import instagram1 from '../assets/foto 13.jpg';
import instagram2 from '../assets/foto 11.jpg';
import instagram3 from '../assets/foto 12.jpg';

const Home: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [foto1, foto2, foto3, foto4, foto5];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center bg-gray-100 w-full min-h-screen pt-6">
        {/* Caixa de Boas-Vindas */}
        <div className="bg-blue-100 text-center p-6 rounded-lg shadow-md w-full max-w-4xl mb-10">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">CaLu Festas e Eventos</h1>
          <p className="text-blue-900">
            Transformamos seus momentos especiais em memórias inesquecíveis! Da organização à decoração, cuidamos de cada detalhe para que sua festa seja única e perfeita.
          </p>
        </div>

        {/* Custom Carousel */}
        <div className="relative w-full max-w-2xl mb-10">
          <div className="flex items-center justify-center relative overflow-hidden">
            <button onClick={handlePrev} className="absolute left-4 z-10 p-2 bg-blue-900 rounded-full shadow-lg hover:bg-blue-700 transition-all">
              <span className="text-white text-2xl">←</span>
            </button>
            <div className="w-full flex justify-center overflow-hidden">
              <img
                src={images[currentIndex]}
                alt={`Imagem ${currentIndex + 1}`}
                className="max-w-full max-h-80 object-cover rounded-lg shadow-md transition-opacity duration-500 opacity-100"
              />
            </div>
            <button onClick={handleNext} className="absolute right-4 z-10 p-2 bg-blue-900 rounded-full shadow-lg hover:bg-blue-700 transition-all">
              <span className="text-white text-2xl">→</span>
            </button>
          </div>
        </div>

        {/* Grid de Cards Centralizado */}
        {/* Informações */}
        <div className="bg-blue-900 text-white w-full py-10">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CaLu Festas e Eventos</h3>
              <p>Organizamos eventos inesquecíveis! Entre em contato para transformar seu sonho em realidade.</p>
              <p>📞 Telefone: (11) 1234-5678</p>
              <p>📸: <a href="https://www.instagram.com/calu_conceitos?utm_source=ig_web_button_share_sheet&igshid=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="underline">@calu_conceitos</a></p>
            </div>
            <div>
              <a href="https://www.instagram.com/calu_conceitos?utm_source=ig_web_button_share_sheet&igshid=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                <h3 className="text-xl font-bold mb-4">Instagram</h3>
              </a>
              <div className="grid grid-cols-3 gap-4">
                <img src={instagram1} alt="Instagram 1" className="w-full h-auto rounded-md" />
                <img src={instagram2} alt="Instagram 2" className="w-full h-auto rounded-md" />
                <img src={instagram3} alt="Instagram 3" className="w-full h-auto rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;