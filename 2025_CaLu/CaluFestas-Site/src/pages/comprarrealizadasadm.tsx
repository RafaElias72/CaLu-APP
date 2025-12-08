import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import NavBar from "../components/NavBar"; // ajuste o path se necessário

// Tipagens
interface Item {
  _id: string;
  nome: string;
  preco?: number;
  quantidade: number;
}

interface Locacao {
  _id: string;
  nome: string;
  endereco: string;
  email?: string;
  data_entrega: string;
  data_retirada: string;
  pagamento?: string;
  total: number;
  items: Item[];
  estado: string;
}

const formatDate = (s?: string) => {
  if (!s) return "-";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("pt-BR");
};

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

const getStatusBadge = (estado: string) => {
  const e = estado.toLowerCase();
  if (e.includes("concl") || e === "concluida") return "bg-green-100 text-green-800";
  if (e.includes("analise") || e === "em analise") return "bg-yellow-100 text-yellow-800";
  if (e.includes("recus") || e === "recusada") return "bg-red-100 text-red-800";
  return "bg-gray-100 text-gray-800";
};

const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-2xl shadow-lg p-4">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2" />
    <div className="h-20 bg-gray-200 rounded" />
  </div>
);

const ComprasRealizadasAdm: React.FC = () => {
  const [locacoes, setLocacoes] = useState<Locacao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [filtro, setFiltro] = useState<string>("todos");
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get<Locacao[]>("http://localhost:8080/api/locations/", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        setLocacoes(res.data || []);
      } catch (err: any) {
        console.error("Erro ao buscar locações:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const exibir = useMemo(() => {
    const q = search.trim().toLowerCase();
    return locacoes.filter((l) => {
      const passaBusca =
        !q ||
        l.nome.toLowerCase().includes(q) ||
        l.endereco.toLowerCase().includes(q) ||
        l.estado.toLowerCase().includes(q);
      const passaFiltro = filtro === "todos" ? true : l.estado.toLowerCase() === filtro;
      return passaBusca && passaFiltro;
    });
  }, [locacoes, search, filtro]);

  const atualizarEstado = async (id: string, novoEstado: string) => {
    const locacao = locacoes.find((l) => l._id === id);
    if (!locacao) return;

    setLocacoes((prev) => prev.map((p) => (p._id === id ? { ...p, estado: novoEstado } : p)));

    try {
      await axios.put(
        `http://localhost:8080/api/locations/${id}`,
        {
          estado: novoEstado,
          items: locacao.items.map((it) => ({ _id: it._id, nome: it.nome, quantidade: it.quantidade })),
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
    } catch (err) {
      console.error("Falha ao atualizar estado:", err);
      setLocacoes((prev) => prev.map((p) => (p._id === id ? locacao : p)));
      alert("Falha ao atualizar estado. Veja o console para detalhes.");
    }
  };

  const handleExcluir = async (id: string) => {
    const locacao = locacoes.find((l) => l._id === id);
    if (!locacao) return;
    if (!confirm("Deseja excluir esta locação?")) return;

    try {
      await axios.post(
        `http://localhost:8080/api/locations/${id}/delete`,
        { items: locacao.items.map((it) => ({ _id: it._id, nome: it.nome, quantidade: it.quantidade })) },
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
      );
      setLocacoes((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Falha ao excluir. Veja o console para detalhes.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="max-w-6xl mx-auto px-4 py-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">Locações Realizadas</h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie pedidos — conclua, recuse ou exclua com segurança.</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <svg
                className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por nome, endereço ou estado..."
                className="w-full pl-10 pr-3 py-2 rounded-full border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <select
              className="p-2 rounded-md border border-gray-200 bg-white text-sm shadow-sm focus:outline-none"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="em analise">Em análise</option>
              <option value="concluida">Concluída</option>
              <option value="recusada">Recusada</option>
            </select>
          </div>
        </header>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : exibir.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" viewBox="0 0 64 64">
              <rect x="8" y="20" width="48" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
              <path d="M20 20v-6a4 4 0 014-4h6" stroke="currentColor" strokeWidth="2" />
            </svg>
            <div className="text-gray-600">Nenhuma locação encontrada.</div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {exibir.map((loc) => (
              <article
                key={loc._id}
                className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transform hover:-translate-y-1 transition`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{loc.nome}</h2>
                    <p className="text-sm text-gray-500 mt-1">{loc.endereco}</p>
                  </div>

                  <div className="text-sm text-right">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(loc.estado)}`}>
                      {loc.estado}
                    </div>

                    <div className="mt-3 font-semibold text-gray-900">{formatCurrency(loc.total)}</div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                  <div>
                    <div className="text-xs text-gray-500">Entrega</div>
                    <div className="font-medium">{formatDate(loc.data_entrega)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Devolução</div>
                    <div className="font-medium">{formatDate(loc.data_retirada)}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="font-semibold text-sm text-indigo-700 mb-2">Itens</div>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {loc.items.map((it) => (
                      <li key={it._id} className="flex justify-between">
                        <span>{it.nome}</span>
                        <span className="text-gray-500">{it.quantidade}x</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {loc.estado.toLowerCase().includes("em analise") && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => atualizarEstado(loc._id, "Concluida")}
                      className="px-4 py-2 rounded-md bg-gradient-to-r from-green-500 to-green-600 text-white text-sm shadow"
                    >
                      Concluir
                    </button>

                    <button
                      onClick={() => atualizarEstado(loc._id, "Recusada")}
                      className="px-4 py-2 rounded-md border border-red-300 text-red-600 text-sm bg-white"
                    >
                      Recusar
                    </button>

                    <button
                      onClick={() => handleExcluir(loc._id)}
                      className="px-4 py-2 rounded-md border border-yellow-300 text-yellow-700 text-sm bg-white"
                    >
                      Excluir
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ComprasRealizadasAdm;