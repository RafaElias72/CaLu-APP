import { Link } from "react-router-dom";
import logo from "../assets/CaLu.png";
import { useState, useEffect, useRef } from "react";

const NavBar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        setIsAuthenticated(!!token);
    }, []);

    // Fecha o menu ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setMenuOpen(false);
        // redirecione se necessário
    };

    return (
        <>
            <nav className="bg-white text-back px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to={"/"} className="text-3xl font-bold">
                    <img src={logo} alt="logo" className="w-24" />
                </Link>
                {/* Links */}
                <ul className="flex space-x-8 text-lg">
                    <li>
                        <Link to={"/homeadm"} className="hover:underline">Home</Link>
                    </li>
                    <li>
                        <Link to={"/catalogo"} className="hover:underline">Catalogo</Link>
                    </li>
                    <li>
                        <Link to={"/carrinho"} className="hover:underline">Locação</Link>
                    </li>
                    <li>
                        <Link to={"/FAQ"} className="hover:underline">FAQ</Link>
                    </li>
                    <li>
                        <Link to={"/cadastrarproduto"} className="hover:underline">Cadastrar Produto</Link>
                    </li>
                </ul>
                {/* Botão Perfil com menu suspenso para todos */}
                <div className="relative" ref={menuRef}>
                    <button
                        className={`${
                            isAuthenticated
                                ? "bg-green-600 hover:bg-green-500"
                                : "bg-blue-900 hover:bg-blue-700"
                        } text-white py-2 px-4 rounded-full hover:underline`}
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        Perfil
                    </button>
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
                                to="/"
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}
                            >
                                ADM  
                            </Link>
                            <Link
                                to="/"
                                className="block px-4 py-2 hover:bg-gray-100"
                                onClick={() => setMenuOpen(false)}
                            >
                                Sair
                            </Link>
                            {isAuthenticated && (
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
};

export default NavBar;