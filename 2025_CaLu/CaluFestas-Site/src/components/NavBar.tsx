import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import logo from "../assets/CaLu.png";

interface JwtPayload {
  nome?: string;
  email?: string;
  expire?: string;
  cargo?: string; // 👈 Campo usado para verificar permissões
}

const Navbar: React.FC = () => {
  const [usuarioNome, setUsuarioNome] = useState<string | null>(null);
  const [usuarioCargo, setUsuarioCargo] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);

        if (decoded.expire) {
          const expireDate = new Date(decoded.expire);
          const now = new Date();

          if (expireDate > now) {
            if (decoded.nome) setUsuarioNome(decoded.nome);
            else if (decoded.email) setUsuarioNome(decoded.email.split("@")[0]);

            // 👉 Salvar cargo (admin, cliente, etc)
            if (decoded.cargo) setUsuarioCargo(decoded.cargo);
          } else {
            localStorage.removeItem("token");
          }
        }
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setUsuarioNome(null);
    setUsuarioCargo(null);
    setMenuOpen(false);
    setMobileMenu(false);
  };

  // 👉 Função que escolhe para onde ir
  const getComprasPath = () => {
    return usuarioCargo === "admin" ? "/comprasrealizadasadm" : "/comprasrealizadas";
  };

  // Fecha dropdown ao clicar fora (desktop)
  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  return (
    <header className="bg-white p-4 flex justify-between items-center shadow relative">
      {/* Logo */}
      <Link to="/">
        <img src={logo} alt="CaLu Festas e Eventos" className="h-8 md:h-10 cursor-pointer" />
      </Link>

      {/* Botão Mobile */}
      <button
        className="md:hidden text-gray-800"
        onClick={() => setMobileMenu(!mobileMenu)}
      >
        {mobileMenu ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
          </svg>
        )}
      </button>

      {/* Menu Desktop */}
      <nav className="hidden md:flex space-x-6 text-gray-800 font-medium items-center">
        <Link to="/" className="hover:text-[#c6a875] transition-colors">Início</Link>
        <Link to="/galeria" className="hover:text-[#c6a875] transition-colors">Galeria</Link>
        <Link to="/catalogo" className="hover:text-[#c6a875] transition-colors">Catálogo</Link>
        <Link to="/contato" className="hover:text-[#c6a875] transition-colors">Contato</Link>
        <Link to="/faq" className="hover:text-[#c6a875] transition-colors">FAQ</Link>

        {usuarioNome ? (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center space-x-1 text-[#c6a875] font-semibold"
            >
              <span>{usuarioNome}</span>
              <svg
                className={`w-4 h-4 transform transition-transform ${menuOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Desktop */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <Link
                  to={"/carrinho"}
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Carrinho
                </Link>
                <div></div>
                <Link
                  to={getComprasPath()}
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Compras realizadas
                </Link>

                {/* Só mostra Painel ADM para admin */}
                {usuarioCargo === "admin" && (
                  <Link
                    to="/paineladm"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Painel ADM
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="px-4 py-1 rounded-md text-white" style={{ backgroundColor: "#c6a875" }}>
            Login
          </Link>
        )}
      </nav>

      {/* Menu Mobile */}
      {mobileMenu && (
        <nav className="absolute top-16 left-0 w-full bg-white flex flex-col p-4 space-y-3 shadow-md z-50 md:hidden">
          <Link to="/" onClick={() => setMobileMenu(false)}>Início</Link>
          <Link to="/galeria" onClick={() => setMobileMenu(false)}>Galeria</Link>
          <Link to="/catalogo" onClick={() => setMobileMenu(false)}>Catálogo</Link>
          <Link to="/contato" onClick={() => setMobileMenu(false)}>Contato</Link>
          <Link to="/faq" onClick={() => setMobileMenu(false)}>FAQ</Link>

          {usuarioNome &&
            (<div className="flex flex-col">
              <span className="font-semibold text-[#c6a875]">{usuarioNome}</span>
              <Link to={getComprasPath()} onClick={() => setMobileMenu(false)}>
                Compras realizadas
              </Link>
            </div>)
          }


          {usuarioCargo === "admin" && (
            <Link to="/paineladm" onClick={() => setMobileMenu(false)}>
              Painel ADM
            </Link>
          )}

          {usuarioNome ? (
            <button onClick={handleLogout} className="text-red-600 text-left">
              Sair
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1 rounded-md text-white text-center"
              onClick={() => setMobileMenu(false)}
              style={{ backgroundColor: "#c6a875" }}
            >
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
