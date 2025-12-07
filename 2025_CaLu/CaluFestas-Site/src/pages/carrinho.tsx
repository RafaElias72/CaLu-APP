// src/pages/carrinho.tsx
import React, { useMemo, useState, useEffect, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import axios from "axios";
import { useAuth } from "../context/useAuth";
import { IMaskInput } from "react-imask";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { toast } from "react-toastify";
import { motion } from "motion/react";
import { Trash2, CreditCard, Wallet, Banknote, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";

dayjs.extend(customParseFormat);

// Tenta carregar o NavBar. Se falhar (ex.: jwt-decode não instalado), caímos no fallback.
const LazyNavBar = lazy(async () => {
  try {
    const mod = await import("../components/NavBar");
    return mod?.default ? { default: mod.default } : { default: () => null };
  } catch {
    // fallback para não travar a tela
    return { default: () => null };
  }
});

type PaymentType = "Pix" | "Cartão" | "Dinheiro";

const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

interface FormErrors {
  nome?: string;
  endereco?: string;
  dataEntregaStr?: string;
  dataRetiradaStr?: string;
}

const fade = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const GuestHeader: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="w-full border-b bg-white/70 backdrop-blur">
    <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition"
      >
        <ArrowLeft size={18} /> Voltar
      </button>
      <div className="text-sm text-slate-500">Visualização</div>
    </div>
  </div>
);

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: any; search: string };
  const searchParams = new URLSearchParams(location.search);
  const isPreviewParam = searchParams.get("preview") === "1";

  const { perfil } = useAuth();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Se vier ?preview=1, força modo visitante (sem bloquear UI).
  const isGuest = isPreviewParam || !perfil || !token;

  const { cart, removeFromCart, clearCart } = useCart();

  const [nome, setNome] = useState((perfil as any)?.nome ?? (perfil as any)?.name ?? "");
  const [endereco, setEndereco] = useState("");
  const [dataEntregaStr, setDataEntregaStr] = useState("");
  const [dataRetiradaStr, setDataRetiradaStr] = useState("");
  const [pagamento, setPagamento] = useState<PaymentType>("Pix");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const added = location?.state?.added;
    if (added) {
      navigate("/carrinho", { replace: true, state: {} });
    }
  }, [location?.state, navigate]);

  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + Number(item.preco) * item.quantidade, 0),
    [cart]
  );
  const total = subtotal;

  const parseDataHora = (str: string): Date | null => {
    const d = dayjs(str, "DD-MM-YYYY HH:mm", true);
    return d.isValid() ? d.toDate() : null;
  };

  const validate = (): boolean => {
    const next: FormErrors = {};
    const hoje0 = new Date();
    hoje0.setHours(0, 0, 0, 0);
    const entregaDt = parseDataHora(dataEntregaStr);
    const retiradaDt = parseDataHora(dataRetiradaStr);

    if (!nome.trim()) next.nome = "Informe o nome";
    if (!endereco.trim()) next.endereco = "Informe o endereço";
    if (!entregaDt) next.dataEntregaStr = "Data de entrega inválida (use dd-mm-aaaa hh:mm)";
    if (!retiradaDt) next.dataRetiradaStr = "Data de retirada inválida (use dd-mm-aaaa hh:mm)";
    if (entregaDt && entregaDt <= hoje0) next.dataEntregaStr = "A entrega deve ser a partir de amanhã.";
    if (retiradaDt && retiradaDt <= hoje0) next.dataRetiradaStr = "A retirada deve ser a partir de amanhã.";
    if (entregaDt && retiradaDt) {
      if (retiradaDt.getTime() === entregaDt.getTime())
        next.dataRetiradaStr = "Entrega e retirada não podem ter a mesma data/horário.";
      if (retiradaDt < entregaDt) next.dataRetiradaStr = "A retirada não pode ser anterior à entrega.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (cart.length === 0) return;

    if (isGuest) {
      toast.info("Faça login para finalizar seu pedido.");
      navigate("/login"); // ajuste a rota caso seja outra
      return;
    }

    if (!validate()) {
      toast.error("Corrija os campos destacados.", { toastId: "formInvalid" });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        nome: nome.trim(),
        endereco: endereco.trim(),
        data_entrega: dataEntregaStr,
        data_retirada: dataRetiradaStr,
        pagamento,
        email: (perfil as any)?.email ?? undefined,
        total,
        items: cart.map((item: any) => ({
          _id: item._id,
          nome: item.nome,
          preco: Number(item.preco),
          quantidade: item.quantidade,
        })),
      };
      const base = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
      const res = await axios.post(`${base}/api/locations/`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (res.status === 201 || res.status === 200) {
        toast.success("Pedido enviado com sucesso!");
        const state = { payload };
        clearCart();
        setNome("");
        setEndereco("");
        setDataEntregaStr("");
        setDataRetiradaStr("");
        setPagamento("Pix");
        navigate("/redirecionamento", { state });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao enviar pedido. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* NavBar com fallback. Se falhar a importação, mostramos GuestHeader */}
      <Suspense fallback={<GuestHeader onBack={() => navigate(-1)} />}>
        {isGuest ? <GuestHeader onBack={() => navigate(-1)} /> : <LazyNavBar />}
      </Suspense>

      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <header className="max-w-7xl mx-auto px-4 md:px-6 pt-6 pb-4">
          {!isGuest && (
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition"
            >
              <ArrowLeft size={18} /> Voltar
            </button>
          )}
          <h1 className="mt-3 text-3xl font-semibold text-slate-900 tracking-tight">
            Finalize sua locação
          </h1>
          <p className="text-slate-500 mt-1">Revise seus itens e conclua o pedido com segurança.</p>

          {isGuest && (
            <div className="mt-3 inline-flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
              <AlertTriangle size={16} />
              <span className="text-sm">
                Você está visualizando como visitante. Faça login para finalizar o pedido.
              </span>
            </div>
          )}
        </header>

        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-16 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
          {/* LISTA DO CARRINHO */}
          <section className="md:col-span-7 lg:col-span-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Seu carrinho</h2>
              {cart.length > 0 && (
                <button
                  className="text-sm text-rose-600 hover:text-rose-700 hover:underline"
                  onClick={() => {
                    clearCart();
                  }}
                >
                  Limpar carrinho
                </button>
              )}
            </div>
            <p className="text-sm text-slate-500 mt-1 mb-4">
              {cart.length > 0 ? `Você possui ${cart.length} item(s)` : "Seu carrinho está vazio"}
            </p>

            {cart.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
                <div className="text-4xl mb-2">🛒</div>
                Adicione produtos ao carrinho para continuar.
              </div>
            ) : (
              <ul className="space-y-4">
                {cart.map((item: any, idx: number) => (
                  <motion.li
                    key={item._id}
                    variants={fade}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: idx * 0.04 }}
                    className="group rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={item.imagem}
                        alt={item.nome}
                        className="w-20 h-20 rounded-xl object-cover ring-1 ring-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='14'>sem imagem</text></svg>";
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-slate-900">{item.nome}</h3>
                            {item.descricao && (
                              <p className="text-sm text-slate-500 line-clamp-2 max-w-prose">
                                {item.descricao}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-slate-900">
                              {brl(Number(item.preco) * item.quantidade)}
                            </div>
                            <button
                              className="mt-1 inline-flex items-center gap-1 text-slate-400 hover:text-rose-600"
                              onClick={() => removeFromCart(item._id)}
                            >
                              <Trash2 size={16} /> Remover
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-slate-500">
                          Quantidade:{" "}
                          <span className="font-medium text-slate-700">{item.quantidade}</span>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}

            {cart.length > 0 && (
              <div className="mt-4 flex justify-end text-sm text-slate-600">
                Subtotal: <span className="ml-2 font-semibold">{brl(subtotal)}</span>
              </div>
            )}
          </section>

          {/* CHECKOUT CARD */}
          <aside className="md:col-span-5 lg:col-span-4 md:sticky md:top-6">
            <motion.div
              variants={fade}
              initial="hidden"
              animate="show"
              className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-xl shadow-xl p-6"
            >
              <h3 className="text-lg font-semibold text-slate-900">Finalização</h3>
              <p className="text-sm text-slate-500 mt-1">
                Preencha os dados para concluir o pedido.
              </p>

              {/* Formas de pagamento */}
              <div className="mt-5">
                <span className="block text-sm mb-2 text-slate-600">Forma de pagamento</span>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { key: "Pix", icon: Wallet },
                      { key: "Cartão", icon: CreditCard },
                      { key: "Dinheiro", icon: Banknote },
                    ] as { key: PaymentType; icon: any }[]
                  ).map(({ key, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPagamento(key)}
                      aria-pressed={pagamento === key}
                      className={`h-11 rounded-xl border text-sm font-medium transition shadow-sm inline-flex items-center justify-center gap-2 ${
                        pagamento === key
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <Icon size={16} /> {key}
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div className="mt-6 space-y-4 text-sm">
                <div>
                  <label htmlFor="nome" className="block mb-1 text-slate-700">
                    Nome
                  </label>
                  <input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                    disabled={isGuest}
                    className={`w-full h-11 px-4 rounded-xl border bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition ${
                      isGuest ? "opacity-70 cursor-not-allowed" : ""
                    } ${errors.nome ? "border-rose-300" : "border-slate-200"}`}
                  />
                  {errors.nome && (
                    <p className="mt-1 text-xs text-rose-500">{errors.nome}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="endereco" className="block mb-1 text-slate-700">
                    Endereço
                  </label>
                  <input
                    id="endereco"
                    type="text"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    placeholder="Rua, nº, bairro, cidade"
                    disabled={isGuest}
                    className={`w-full h-11 px-4 rounded-xl border bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition ${
                      isGuest ? "opacity-70 cursor-not-allowed" : ""
                    } ${errors.endereco ? "border-rose-300" : "border-slate-200"}`}
                  />
                  {errors.endereco && (
                    <p className="mt-1 text-xs text-rose-500">{errors.endereco}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="entrega" className="block mb-1 text-slate-700">
                      Data de entrega
                    </label>
                    <IMaskInput
                      id="entrega"
                      mask="00-00-0000 00:00"
                      value={dataEntregaStr}
                      onAccept={(v) => setDataEntregaStr(v)}
                      placeholder="dd-mm-aaaa hh:mm"
                      disabled={isGuest}
                      className={`w-full h-11 px-4 rounded-xl border bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition ${
                        isGuest ? "opacity-70 cursor-not-allowed" : ""
                      } ${errors.dataEntregaStr ? "border-rose-300" : "border-slate-200"}`}
                    />
                    {errors.dataEntregaStr && (
                      <p className="mt-1 text-xs text-rose-500">
                        {errors.dataEntregaStr}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="retirada" className="block mb-1 text-slate-700">
                      Data de retirada
                    </label>
                    <IMaskInput
                      id="retirada"
                      mask="00-00-0000 00:00"
                      value={dataRetiradaStr}
                      onAccept={(v) => setDataRetiradaStr(v)}
                      placeholder="dd-mm-aaaa hh:mm"
                      disabled={isGuest}
                      className={`w-full h-11 px-4 rounded-xl border bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition ${
                        isGuest ? "opacity-70 cursor-not-allowed" : ""
                      } ${errors.dataRetiradaStr ? "border-rose-300" : "border-slate-200"}`}
                    />
                    {errors.dataRetiradaStr && (
                      <p className="mt-1 text-xs text-rose-500">
                        {errors.dataRetiradaStr}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <span className="text-slate-500 text-xs">
                    Frete a combinar após a finalização no WhatsApp
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={cart.length === 0 || isGuest || isSubmitting}
                className="mt-5 w-full h-12 inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[.99] disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {isGuest ? (
                  <>Entrar para finalizar</>
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> Enviando…
                  </>
                ) : (
                  <>Finalizar Pedido →</>
                )}
              </button>
            </motion.div>
          </aside>
        </div>
      </div>
    </>
  );
};

export default CartPage;
