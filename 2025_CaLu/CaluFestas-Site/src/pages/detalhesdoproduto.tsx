import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import { useCart } from "../hooks/useCart";
import { toast } from "react-toastify";

// Tipagem local – use sua interface se já tiver uma
type Product = {
  _id: string;
  nome: string;
  preco: number | string;
  descricao?: string;
  categoria?: string | undefined;
  quantidade?: number;
  quantidadeemlocacao?: number;
  imagem: string[];
};

// ======= IMAGENS FALLBACK =======
import mesa140 from "../assets/mesa140.jpeg";

// ======= PÁGINA =======
const DetalhesDoProduto: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { addToCart } = useCart();
  const [produto, setProduto] = React.useState<Product | null>(null);
  const [mainImage, setMainImage] = React.useState<string>("");
  const [quantidade, setQuantidade] = React.useState<number>(1);
  const zoomRef = React.useRef<any>(null);

  // evita duplo clique
  const addingRef = useRef(false);

  // Medium-Zoom (opcional)
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import("medium-zoom");
        if (!mounted) return;
        const selector = "#mainImage";
        const mz = mod.default
          ? mod.default(selector, {
              margin: 24,
              background: "#000",
              scrollOffset: 40,
            })
          : null;
        zoomRef.current = mz;
      } catch {
        // silencioso
      }
    })();
    return () => {
      mounted = false;
      if (zoomRef.current && typeof zoomRef.current.detach === "function") {
        zoomRef.current.detach();
      }
    };
  }, [mainImage]);

  // Buscar produtos
  React.useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const localData = localStorage.getItem("produtos");
        let lista: Product[];

        if (localData) {
          lista = JSON.parse(localData);
        } else {
          const response = await axios.get<Product[]>("http://localhost:8080/api/products/");
          lista = response.data;
          localStorage.setItem("produtos", JSON.stringify(lista));
        }

        const encontrado = lista.find((p) => p._id === id);
        if (encontrado) {
          setProduto(encontrado);

          const firstImg = Array.isArray(encontrado.imagem)
            ? encontrado.imagem[0]
            : encontrado.imagem;

          setMainImage(firstImg || mesa140);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        toast.error("Não foi possível carregar o produto.", { toastId: "prod-load" });
      }
    };

    fetchProdutos();
  }, [id]);

  const estoqueDisponivel = React.useMemo(() => {
    if (!produto) return 0;
    const total = Number(produto.quantidade ?? 0);
    const emLocacao = Number(produto.quantidadeemlocacao ?? 0);
    return Math.max(total - emLocacao, 0);
  }, [produto]);

  const imagensProduto: string[] = React.useMemo(() => {
    if (!produto) return [];
    if (Array.isArray(produto.imagem)) return produto.imagem;
    if (typeof produto.imagem === "string" && produto.imagem[0] !== "") {
      return [produto.imagem];
    }
    return [];
  }, [produto]);

  const adicionarAoCarrinho = () => {
    if (addingRef.current) return; // trava duplo clique
    addingRef.current = true;

    try {
      if (!produto) return;
      if (quantidade < 1) {
        toast.info("Quantidade mínima: 1", { toastId: "min-qty" });
        return;
      }
      if (quantidade > estoqueDisponivel) {
        toast.error("Quantidade acima do estoque disponível.", { toastId: "over-stock" });
        return;
      }

      addToCart({
        _id: produto._id,
        nome: produto.nome,
        preco: Number(produto.preco),
        quantidade: produto.quantidade ?? 0,
        imagem: imagensProduto,
        descricao: produto.descricao ?? "",
        categoria: produto.categoria ?? "",
        subcategoria: "",
        quantidadeemlocacao: 0
      }, quantidade);

      navigate("/carrinho", {
        state: {
          added: { id: produto._id, nome: produto.nome, quantidade },
        },
      });
    } finally {
      setTimeout(() => {
        addingRef.current = false;
      }, 400);
    }
  };

  if (!produto) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Carregando produto...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cabeçalho */}
      <Navbar />

      {/* Botão voltar */}
      <div className="bg-[#f9f5f0] px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="text-[#c6a875] font-medium flex items-center gap-1 hover:underline transition-all duration-200"
        >
          <span className="text-lg">←</span> Voltar
        </button>
      </div>

      {/* Conteúdo principal */}
      <main className="px-4 pt-2 pb-12 bg-[#f9f5f0]">
        <section className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a3d39]">
            Detalhes do Produto
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Confira as características e adicione ao carrinho
          </p>
        </section>

        {/* Card principal */}
        <div className="max-w-6xl mx-auto bg-white shadow-md md:shadow-xl rounded-2xl p-4 sm:p-6 md:p-12 flex flex-col md:flex-row gap-6 md:gap-12">
          
          {/* Miniaturas */}
          <div className="flex md:flex-col gap-3 overflow-x-auto px-1 order-2 md:order-1">
            {imagensProduto.length > 0 ? (
              imagensProduto.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`thumb-${idx + 1}`}
                  onClick={() => setMainImage(src)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 object-cover rounded-lg shadow border hover:opacity-80 transition cursor-pointer ${
                    mainImage === src ? "ring-2 ring-[#c6a875]" : ""
                  }`}
                />
              ))
            ) : (
              <img
                src={mesa140}
                alt="thumb-fallback"
                onClick={() => setMainImage(mesa140)}
                className={`w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow border hover:opacity-80 transition cursor-pointer ${
                  mainImage === mesa140 ? "ring-2 ring-[#c6a875]" : ""
                }`}
              />
            )}
          </div>

          {/* Imagem principal */}
          <div className="order-1 md:order-2 md:mr-[70px] flex justify-center">
            <img
              id="mainImage"
              src={mainImage || mesa140}
              alt={produto.nome}
              className="w-full max-w-[380px] sm:max-w-[450px] h-auto object-cover border rounded-xl shadow-md"
            />
          </div>

          {/* Informações do produto */}
          <div className="order-3 flex-1 bg-white p-4 sm:p-6 border border-[#c6a875]/30 rounded-xl shadow-sm md:shadow-md transition-shadow duration-300 space-y-4 sm:space-y-5">
            <h2 className="text-2xl font-bold text-gray-900">{produto.nome}</h2>

            <p className="text-xl text-[#c6a875] font-bold mt-4">
              R$ {Number(produto.preco).toFixed(2)}
            </p>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Descrição</label>
              <div className="bg-gray-100 p-3 rounded-md text-gray-700 text-sm sm:text-base">
                {produto.descricao}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">
                Estoque disponível:{" "}
                <span className="font-semibold">
                  {estoqueDisponivel} {estoqueDisponivel === 1 ? "unidade" : "unidades"}
                </span>
              </p>

              <div className="flex items-center gap-4 mt-3">
                <button
                  aria-label="Diminuir"
                  onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 sm:w-12 sm:h-12 border rounded text-xl font-bold text-[#1a3d39] hover:bg-gray-100 transition"
                >
                  −
                </button>

                <span className="text-xl sm:text-2xl font-medium w-8 text-center" aria-live="polite">
                  {quantidade}
                </span>

                <button
                  aria-label="Aumentar"
                  onClick={() => setQuantidade((q) => Math.min(estoqueDisponivel, q + 1))}
                  className="w-10 h-10 sm:w-12 sm:h-12 border rounded text-xl font-bold text-[#1a3d39] hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={adicionarAoCarrinho}
              disabled={quantidade < 1 || quantidade > estoqueDisponivel}
              className="bg-[#c6a875] hover:bg-[#b39264] text-white px-4 py-3 sm:py-3 sm:px-6 rounded-lg w-full font-semibold text-sm sm:text-base shadow transition-all duration-300 disabled:opacity-50"
            >
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </main>

      {/* Rodapé */}
      <div className="bg-[#f9f5f0]">
        <Footer />
      </div>
    </div>
  );
};

export default DetalhesDoProduto;
