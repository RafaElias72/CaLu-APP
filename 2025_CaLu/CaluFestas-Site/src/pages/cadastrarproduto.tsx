// ...existing code...
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { PackagePlus, ImagePlus, Trash2 } from "lucide-react";
import { Product } from "../interfaces/product";


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

  const [newImageURL, setNewImageURL] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    document.title = "Cadastrar Produto";
  }, []);

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!product.nome.trim()) e.nome = "Nome é obrigatório.";
    if (!product.categoria?.trim()) e.categoria = "Categoria é obrigatória.";
    if (!product.descricao?.trim()) e.descricao = "Descrição é obrigatória.";
    if (!product.preco || isNaN(Number(product.preco.toString().replace(",", "."))))
      e.preco = "Preço inválido.";
    if (product.quantidade < 0) e.quantidade = "Quantidade deve ser >= 0.";
    return e;
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "quantidade" || name === "quantidadeemlocacao") {
      setProduct((prev) => ({ ...prev, [name]: Number(value) }));
    } else if (name === "preco") {
      const cleaned = value.replace(/[^\d,.-]/g, "");
      setProduct((prev) => ({ ...prev, preco: cleaned }));
    } else {
      setProduct((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const addImageURL = () => {
    if (!newImageURL.trim()) return;
    if (!newImageURL.startsWith("http")) {
      toast.error("URL inválida. Deve começar com http(s).");
      return;
    }
    setProduct((prev) => ({ ...prev, imagem: [...prev.imagem, newImageURL] }));
    setNewImageURL("");
  };

  const removeImageURL = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      imagem: prev.imagem.filter((_, i) => i !== index),
    }));
  };

  const formatPriceForDisplay = (v: string) => {
    if (!v) return "";
    const numeric = Number(v.toString().replace(",", "."));
    if (isNaN(numeric)) return v;
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(numeric);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length) {
      setErrors(validation);
      toast.error("Corrija os erros antes de enviar.");
      return;
    }

    setSubmitting(true);
    try {
      const produtoFinal = {
        ...product,
        preco: parseFloat(product.preco.toString().replace(",", ".")),
      };

      await axios.post("http://localhost:8080/api/privateProducts/register", produtoFinal, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Produto cadastrado com sucesso!");
      localStorage.removeItem("produtos");
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
      console.error("Erro ao cadastrar produto:", error);
      toast.error("Erro ao cadastrar produto");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-3xl">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <PackagePlus className="w-7 h-7 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Cadastrar Produto</h2>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Nome</label>
                <input
                  name="nome"
                  value={product.nome}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 border rounded-md ${errors.nome ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.nome && <div className="text-sm text-red-500 mt-1">{errors.nome}</div>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Categoria</label>
                  <input
                    name="categoria"
                    value={product.categoria}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 border rounded-md ${errors.categoria ? "border-red-400" : "border-gray-200"}`}
                  />
                  {errors.categoria && <div className="text-sm text-red-500 mt-1">{errors.categoria}</div>}
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Adicionar imagem (URL)</label>
                  <div className="flex gap-2">
                    <input
                      value={newImageURL}
                      onChange={(e) => setNewImageURL(e.target.value)}
                      className="w-full p-3 border rounded-md"
                      placeholder="URL de imagem"
                    />
                    <button type="button" onClick={addImageURL} className="px-4 bg-blue-600 text-white rounded-md">
                      <ImagePlus />
                    </button>
                  </div>

                  {product.imagem.length > 0 && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {product.imagem.map((img, i) => (
                        <div key={i} className="relative border rounded-md p-1">
                          <img src={img} alt={`img-${i}`} className="h-20 w-full object-cover rounded" />
                          <button
                            type="button"
                            onClick={() => removeImageURL(i)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Descrição</label>
                <textarea
                  name="descricao"
                  value={product.descricao}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 border rounded-md min-h-[100px] ${errors.descricao ? "border-red-400" : "border-gray-200"}`}
                />
                {errors.descricao && <div className="text-sm text-red-500 mt-1">{errors.descricao}</div>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Quantidade</label>
                  <input type="number" name="quantidade" value={product.quantidade} min={0} onChange={handleChange} className="w-full p-3 border rounded-md" />
                  {errors.quantidade && <div className="text-sm text-red-500 mt-1">{errors.quantidade}</div>}
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Quantidade em locação</label>
                  <input
                    type="number"
                    name="quantidadeemlocacao"
                    value={product.quantidadeemlocacao}
                    min={0}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-md"
                  />
                </div>

                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Preço</label>
                  <input
                    name="preco"
                    value={product.preco}
                    onChange={handleChange}
                    required
                    className={`w-full p-3 border rounded-md ${errors.preco ? "border-red-400" : "border-gray-200"}`}
                    placeholder="ex: 49.90"
                  />
                  <div className="text-sm text-gray-500 mt-1">{product.preco ? formatPriceForDisplay(product.preco.toString()) : "Formato: 49.90"}</div>
                  {errors.preco && <div className="text-sm text-red-500 mt-1">{errors.preco}</div>}
                </div>
              </div>

              <div className="flex gap-2">
                <button type="submit" disabled={submitting} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-lg disabled:opacity-60">
                  {submitting ? "Salvando..." : "Salvar Produto"}
                </button>

                <button
                  type="button"
                  onClick={() => setProduct({_id: "", nome: "", categoria: "", subcategoria: "", quantidade: 0, quantidadeemlocacao: 0, preco: "", descricao: "", imagem: [] })}
                  className="px-6 py-3 bg-gray-100 rounded-xl"
                >
                  Limpar
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}
