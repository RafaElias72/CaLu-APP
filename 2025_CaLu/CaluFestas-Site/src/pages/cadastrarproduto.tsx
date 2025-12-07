import { useState } from "react";
import Head from "next/head";
import Navbar from "../components/NavBar"; // Certifique-se de que o caminho está correto
import axios from "axios";
import { Product } from "../interfaces/product";
import { toast } from "react-toastify";

export default function CadastrarProduto() {
  const [product, setProduct] = useState<Product>({
    _id: "",
    nome: "",
    categoria: "",
    subcategoria: "",
    quantidade: 0,
    quantidadeemlocacao: 0,
    preco: "",
    descricao: "",
    imagem: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let newValue: string | number;

    if (name === "quantidade") {
      newValue = Number(value);
    } else {
      newValue = value;
    }

    if (name === "imagem") {
      setProduct((prev) => ({
        ...prev,
        imagem: [value],
      }));
    } else {
      setProduct((prev) => ({
        ...prev,
        [name]: newValue,
      }));
    }
  };

  // const handleimagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setProduct((prev) => ({
  //       ...prev,
  //       photo: e.target.files![0],
  //     }));
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const produtoFinal = {
      ...product,
      preco: parseFloat((product.preco as string).replace(",", ".")),
    };

    try {
      const response = await axios.post("http://localhost:8080/api/products/register", produtoFinal, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Produto cadastrado com sucesso:", response.data);
      toast.success("Produto cadastrado com sucesso!", { toastId: "ProdutoBom" });

      // Resetar o formulário
      setProduct({
        _id: "",
        nome: "",
        categoria: "",
        subcategoria: "",
        quantidade: 0,
        quantidadeemlocacao: 0,
        preco: "",
        descricao: "",
        imagem: [],
      });
    } catch (error) {
      if (error) {
        console.error("Erro no servidor:", error);
        toast.error("Erro ao cadastrar produto", { toastId: "ProdutoRuim" });
      } else {
        console.error("Erro de conexão:", error);
        toast.error("Erro de conexão com o servidor.", { toastId: "ServerTuim" });
      }
    }
  };


  return (
    <>
      <Head>
        <title>Cadastrar Produto</title>
      </Head>
      <Navbar /> {/* Adicionando o Navbar aqui */}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-20 w-full max-w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Cadastro de Produto</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Nome do Produto</label>
              <input
                type="text"
                name="nome"
                value={product.nome}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Categoria do Produto</label>
              <input
                type="text"
                name="categoria"
                value={product.categoria}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Foto do Produto</label>
              <input
                type="text"
                name="imagem"
                value={product.imagem[0] || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Descrição do Produto</label>
              <textarea
                name="descricao"
                value={product.descricao}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Quantidade</label>
              <input
                type="number"
                name="quantidade"
                value={product.quantidade}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Preço</label>
              <input
                type="text"
                name="preco"
                value={product.preco}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg mx-auto mt-4"
            >
              Salvar Produto
            </button>
          </form>
        </div>
      </div>
    </>
  );
}