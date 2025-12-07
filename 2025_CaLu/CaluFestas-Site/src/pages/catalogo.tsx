// ...existing code...
import React from "react";
import axios from "axios";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { Product } from "../interfaces/product";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/useAuth";

const Catalago: React.FC = () => {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = React.useState<string | null>(null);
  const productsPerPage = 8;
  const { addToCart } = useCart();
  const { perfil } = useAuth();
  const token = localStorage.getItem("token");

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get("http://localhost:8080/api/products/", { headers });
        // garante que seja array
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar os produtos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory && product.categoria !== selectedCategory) return false;
    if (selectedSubcategory && product.subcategoria !== selectedSubcategory) return false;
    return true;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const categories = Array.from(new Set(products.map((product) => product.categoria))).filter(Boolean);
  const subcategories = Array.from(
    new Set(
      products
        .filter((product) => product.categoria === selectedCategory)
        .map((product) => product.subcategoria)
    )
  ).filter(Boolean);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center bg-gray-100 w-full min-h-screen pt-6" style={{ marginBottom: "20px" }}>
        {/* Filtros */}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <select
            value={selectedCategory || ""}
            onChange={(e) => {
              setSelectedCategory(e.target.value || null);
              setSelectedSubcategory(null);
              setCurrentPage(1);
            }}
            style={{
              padding: "10px",
              marginRight: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            <option value="">Todas as Categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={selectedSubcategory || ""}
            onChange={(e) => {
              setSelectedSubcategory(e.target.value || null);
              setCurrentPage(1);
            }}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
            disabled={!selectedCategory}
          >
            <option value="">Todas as Subcategorias</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory} value={subcategory}>{subcategory}</option>
            ))}
          </select>
        </div>

        {/* Loading / Erro */}
        {loading && <p>Carregando produtos...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Produtos */}
        {!loading && !error && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "20px",
            }}
          >
            {currentProducts.map((product) => {
              const maxAvailable = Math.max(0, (product.quantidade || 0) - (product.quantidadeemlocacao || 0));
              return (
                <div
                  key={product._id}
                  style={{
                    textAlign: "center",
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    padding: "10px",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <img
                    src={product.imagem[0] || ""}
                    alt={product.nome}
                    style={{
                      width: "100%",
                      height: "300px",
                      objectFit: "contain",
                      borderRadius: "5px",
                      backgroundColor: "#f0f0f0",
                    }}
                  />
                  <h3 style={{ fontSize: "18px", margin: "10px 0" }}>{product.nome}</h3>
                  <p style={{ fontSize: "16px", color: "#333" }}>R${product.preco}</p>
                  <p style={{ fontSize: "14px", color: "#666" }}>{product.descricao}</p>
                  <div style={{ marginTop: "10px" }}>
                    <input
                      type="number"
                      min={0}
                      max={maxAvailable}
                      defaultValue="0"
                      id={`quantity-${product._id}`}
                      style={{
                        width: "60px",
                        padding: "5px",
                        marginRight: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "5px",
                      }}
                    />
                    {perfil ? (
                      <button
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "#6c63ff",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          const quantityInput = document.getElementById(
                            `quantity-${product._id}`
                          ) as HTMLInputElement | null;
                          if (!quantityInput) return;
                          const quantity = parseInt(quantityInput.value || "0", 10);
                          if (isNaN(quantity) || quantity <= 0) {
                            alert("Informe uma quantidade válida (maior que 0).");
                            return;
                          }
                          if (quantity > maxAvailable) {
                            alert(`Quantidade máxima disponível: ${maxAvailable}`);
                            return;
                          }
                          addToCart(product, quantity);
                        }}
                      >
                        Adicionar ao Carrinho
                      </button>
                    ) : (
                      <button
                        style={{
                          padding: "10px 20px",
                          backgroundColor: "#ccc",
                          color: "#333",
                          border: "none",
                          borderRadius: "5px",
                        }}
                        disabled
                        title="Faça login para adicionar ao carrinho"
                      >
                        Entrar para adicionar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Paginação */}
        {!loading && !error && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                style={{
                  margin: "0 5px",
                  padding: "5px 10px",
                  backgroundColor: currentPage === index + 1 ? "#6c63ff" : "#ddd",
                  color: currentPage === index + 1 ? "white" : "black",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Catalago;
// ...existing code...