import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/CaLu.png";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  nome?: string;
  email?: string;
  exp?: number;
}

const Navbar: React.FC = () => {
  const [usuarioNome, setUsuarioNome] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded.nome) {
          setUsuarioNome(decoded.nome);
          console.log(decoded)
        } else if (decoded.email) {
          setUsuarioNome(decoded.email.split("@")[0]);
          console.log(decoded)
        }
      } catch (err) {
        console.error("Token inválido:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsuarioNome(null);
    setMenuOpen(false);
  };

  // Fecha o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white p-4 flex justify-between items-center shadow relative">
      {/* Logo */}
      <div>
        <Link to="/">
          <img
            src={logo}
            alt="CaLu Festas e Eventos"
            className="h-8 md:h-10 cursor-pointer"
          />
        </Link>
      </div>

      {/* Menu */}
      <nav className="hidden md:flex space-x-6 text-gray-800 font-medium items-center">
        <Link
          to="/catalogo"
          className="hover:text-[#c6a875] transition-colors duration-200"
        >
          Galeria
        </Link>
        <Link
          to="/catalogo"
          className="hover:text-[#c6a875] transition-colors duration-200"
        >
          Catálogo
        </Link>
        <Link
          to="/contato"
          className="hover:text-[#c6a875] transition-colors duration-200"
        >
          Contato
        </Link>
        <Link
          to="/faq"
          className="hover:text-[#c6a875] transition-colors duration-200"
        >
          FAQ
        </Link>

        {/* Se o usuário estiver logado */}
        {usuarioNome ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-1 text-[#c6a875] font-semibold focus:outline-none"
            >
              <span>Olá, {usuarioNome}!</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  menuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <Link
                  to="/comprasrealizadasadm"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Compras realizadas
                </Link>
                <Link
                  to="/paineladm"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Painel ADM
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-4 py-1 rounded-md text-white transition"
            style={{ backgroundColor: "#c6a875" }}
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
