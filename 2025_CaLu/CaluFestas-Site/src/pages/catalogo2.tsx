import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { Product } from "../interfaces/product";

// Normaliza texto para slug de comparação nos filtros
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
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("todos");

  // Busca produtos da API Go (com cache localStorage)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const cached = localStorage.getItem("produtos");
        if (cached) {
          setProducts(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const response = await axios.get<Product[]>(
          "http://localhost:8080/api/products/"
        );
        if (Array.isArray(response.data)) {
          setProducts(response.data);
          localStorage.setItem("produtos", JSON.stringify(response.data));
        } else {
          throw new Error("Resposta inesperada da API");
        }
      } catch (err) {
        console.error("Erro ao buscar produtos:", err);
        setError("Erro ao carregar produtos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Cria lista de categorias únicas a partir dos produtos (slug + label)
  const categories = useMemo(() => {
    const set = new Map<string, string>();
    products.forEach((p) => {
      const slug = toSlug(p.categoria);
      const label = p.categoria?.trim() || "Sem categoria";
      if (slug) set.set(slug, label);
    });
    // Garante a ordem desejada se existir
    const preferredOrder = ["mesas", "cadeiras", "conjuntos"];
    const ordered: Array<{ slug: string; label: string }> = [];
    preferredOrder.forEach((po) => {
      if (set.has(po)) ordered.push({ slug: po, label: set.get(po)! });
    });
    // adiciona quaisquer outras
    for (const [slug, label] of set.entries()) {
      if (!preferredOrder.includes(slug)) ordered.push({ slug, label });
    }
    return ordered;
  }, [products]);

  // Aplica filtro ativo ("todos" mostra tudo)
  const filteredProducts = useMemo(() => {
    if (activeFilter === "todos") return products;
    return products.filter((p) => toSlug(p.categoria) === activeFilter);
  }, [products, activeFilter]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen text-lg text-gray-700">
          Carregando produtos...
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen text-red-600 text-lg">
          {error}
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Estilos da animação local, equivalentes ao <style> do HTML */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
      `}</style>

      <div className="w-full min-h-screen" style={CATALAGO_BG}>
        <main className="px-6 py-12 max-w-7xl mx-auto">
          {/* Título */}
          <section className="text-center mb-10">
            <h1
              className="text-3xl font-bold text-[#1a3d39]"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Catálogo de Produtos
            </h1>
            <p className="text-gray-600 mt-2">
              Escolha entre mesas, cadeiras e mais itens para seu evento
            </p>
          </section>

          {/* Filtros */}
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <button
              onClick={() => setActiveFilter("todos")}
              className={
                activeFilter === "todos"
                  ? "bg-[#c6a875] text-white px-4 py-2 rounded-md"
                  : "bg-white border border-gray-300 px-4 py-2 rounded-md transition"
              }
            >
              Todos
            </button>

            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => setActiveFilter(c.slug)}
                className={
                  activeFilter === c.slug
                    ? "bg-[#c6a875] text-white px-4 py-2 rounded-md"
                    : "bg-white border border-gray-300 px-4 py-2 rounded-md transition"
                }
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Grid de Produtos (dados da API) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden group border border-gray-100 animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <img
                  src={
                    product.imagem[0] ||
                    "https://via.placeholder.com/400x300?text=Sem+imagem"
                  }
                  alt={product.nome}
                  className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105 bg-gray-100"
                />
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
                    {product.nome || product.categoria}
                  </h3>
                  {typeof product.preco === "number" && !Number.isNaN(product.preco) && (
                    <p className="text-[#c6a875] font-bold text-base mb-3">
                      {product.preco.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  )}
                  <button
                    onClick={() => navigate(`/detalhesdoproduto/${product._id}`)}
                    className="block w-full text-center bg-[#c6a875] text-white py-2 rounded-md transition-all duration-300 hover:bg-[#b39264] hover:scale-[1.02]"
                  >
                    Ver detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Rodapé */}
        <Footer />
      </div>
    </>
  );
};

export default Catalago;
