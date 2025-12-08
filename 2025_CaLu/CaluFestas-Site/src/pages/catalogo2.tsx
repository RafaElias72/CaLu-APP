import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Product } from "../interfaces/product";

const toSlug = (s?: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const CATALAGO_BG = { backgroundColor: "#F7F3EA" } as const;

const Catalago: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("todos");

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await axios.get<Product[]>("http://localhost:8080/api/products/");
        if (Array.isArray(response.data)) {
          setProducts(response.data);
          localStorage.setItem("produtos", JSON.stringify(response.data));
        }
      } catch (err) {
        console.log("Erro ao atualizar produtos em segundo plano");
      }
    };

    const cached = localStorage.getItem("produtos");

    if (cached) {
      setProducts(JSON.parse(cached));
      setLoading(false);
      fetchNewProducts(); // 🔄 Atualização em segundo plano
    } else {
      fetchNewProducts().finally(() => setLoading(false));
    }
  }, []);

  const categories = useMemo(() => {
    const set = new Map<string, string>();
    products.forEach((p) => {
      const slug = toSlug(p.categoria);
      const label = p.categoria?.trim() || "Sem categoria";
      if (slug) set.set(slug, label);
    });
    return [...set.entries()].map(([slug, label]) => ({ slug, label }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (activeFilter === "todos") return products;
    return products.filter((p) => toSlug(p.categoria) === activeFilter);
  }, [products, activeFilter]);

  if (loading)
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen text-lg text-gray-700">
          Carregando...
        </div>
        <Footer />
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen text-red-600 text-lg">
          {error}
        </div>
        <Footer />
      </>
    );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .filters-scroll { scrollbar-width: none; }
        .filters-scroll::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="w-full min-h-screen" style={CATALAGO_BG}>
        <main className="px-4 sm:px-6 py-10 sm:py-12 max-w-7xl mx-auto">
          <section className="text-center mb-6 sm:mb-10">
            <h1
              className="text-2xl sm:text-3xl font-bold text-[#1a3d39]"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Catálogo de Produtos
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Mesas, cadeiras e mais itens para seu evento
            </p>
          </section>

          <div className="flex gap-3 justify-start sm:justify-center mb-8 overflow-x-auto filters-scroll px-1">
            <button
              onClick={() => setActiveFilter("todos")}
              className={`${
                activeFilter === "todos"
                  ? "bg-[#c6a875] text-white"
                  : "bg-white border border-gray-300"
              } px-4 py-2 rounded-md whitespace-nowrap text-sm sm:text-base`}
            >
              Todos
            </button>

            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveFilter(c.slug)}
                className={`${
                  activeFilter === c.slug
                    ? "bg-[#c6a875] text-white"
                    : "bg-white border border-gray-300"
                } px-4 py-2 rounded-md whitespace-nowrap text-sm sm:text-base`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, i) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden group border border-gray-100 animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="h-40 xs:h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                  <img
                    src={
                      product.imagem?.[0] ||
                      "https://via.placeholder.com/400x300?text=Sem+imagem"
                    }
                    alt={product.nome}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-1 truncate">
                    {product.nome || product.categoria}
                  </h3>
                  {typeof product.preco === "number" && (
                    <p className="text-[#c6a875] font-bold text-sm sm:text-base mb-3">
                      {product.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  )}
                  <button
                    onClick={() => navigate(`/detalhesdoproduto/${product._id}`)}
                    className="block w-full text-center bg-[#c6a875] text-white py-2 rounded-md transition-all duration-300 hover:bg-[#b39264] hover:scale-[1.02] text-sm sm:text-base"
                  >
                    Ver detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      <div style={CATALAGO_BG}>
        <Footer />
      </div>
    </div>
  );
};

export default Catalago;
