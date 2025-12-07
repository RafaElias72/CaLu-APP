import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  nome: string;
  preco: number;
  descricao: string;
  imagem: string;
  categoria: string;
  subcategoria?: string;
  quantidade?: number;
  quantidadeemlocacao?: number;
}

const Catalago: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Busca produtos da API Go
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const cached = localStorage.getItem("produtos");
        if (cached) {
          setProducts(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const response = await axios.get<Product[]>("http://localhost:8080/api/products/");
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

  // 🔹 Filtra apenas um produto por categoria
  const uniqueCategoryProducts = Array.from(
    new Map(products.map((p) => [p.categoria, p])).values()
  );

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
      <div
        className="flex flex-col items-center w-full min-h-screen pt-6"
        style={{ backgroundColor: "#F7F3EA" }}
      >
        <h2 className="text-2xl font-semibold mb-6">Categorias em destaque</h2>

        {/* 🔹 Mostra 1 produto por categoria */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            width: "80%",
          }}
        >
          {uniqueCategoryProducts.map((product) => {
            return (
              <div
                key={product._id}
                style={{
                  textAlign: "center",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "10px",
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={product.imagem || "https://via.placeholder.com/400x300?text=Sem+imagem"}
                  alt={product.nome}
                  style={{
                    width: "100%",
                    height: "250px",
                    objectFit: "contain",
                    borderRadius: "5px",
                    backgroundColor: "#f0f0f0",
                  }}
                />
                <h3 style={{ fontSize: "18px", margin: "10px 0" }}>{product.categoria}</h3>
                <button
                  style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    backgroundColor: "#c6a875",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/detalhesdoproduto/${product._id}`)}
                >
                  Ver detalhes
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Catalago;
