// ...existing code...
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-12 py-8 text-center text-sm text-gray-600">
        <div className="max-w-6xl mx-auto px-4">
          <p>© CaLu Festas. Todos os direitos reservados.</p>
          <div className="mt-2 flex justify-center gap-4">
            <a href="#" className="hover:text-[#c6a875]">
              Instagram
            </a>
            <a href="#" className="hover:text-[#c6a875]">
              WhatsApp
            </a>
            <a href="#" className="hover:text-[#c6a875]">
              Contato
            </a>
          </div>
        </div>
      </footer>
  );
};

export default Footer;
// ...existing code...