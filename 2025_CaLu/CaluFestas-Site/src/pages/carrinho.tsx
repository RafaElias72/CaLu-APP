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
import { Trash2, CreditCard, Wallet, Banknote, ArrowLeft, Loader2, AlertTriangle, MapPin, User, Calendar } from "lucide-react";

dayjs.extend(customParseFormat);

// Lazy Nav
const LazyNavBar = lazy(async () => {
  try {
    const mod = await import("../components/NavBar");
    return mod?.default ? { default: mod.default } : { default: () => null };
  } catch {
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

// ANIMAÇÕES
const fade = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const GuestHeader: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div className="w-full border-b bg-white/70 backdrop-blur">
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 h-14 flex items-center justify-between">
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
  const isGuest = isPreviewParam || !perfil || !token;

  const { cart, removeFromCart, clearCart } = useCart();

  // FORM
  const [nome, setNome] = useState((perfil as any)?.nome ?? (perfil as any)?.name ?? "");
  const [endereco, setEndereco] = useState("");
  const [dataEntregaStr, setDataEntregaStr] = useState("");
  const [dataRetiradaStr, setDataRetiradaStr] = useState("");
  const [pagamento, setPagamento] = useState<PaymentType>("Pix");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const added = location?.state?.added;
    if (added) navigate("/carrinho", { replace: true, state: {} });
  }, [location?.state, navigate]);

  // TOTAL
  const subtotal = useMemo(
    () => cart.reduce((acc, item) => acc + Number(item.preco) * item.quantidade, 0),
    [cart]
  );
  const total = subtotal;

  const parseDataHora = (str: string): Date | null => {
    const d = dayjs(str, "DD-MM-YYYY HH:mm", true);
    return d.isValid() ? d.toDate() : null;
  };

  // VALIDATE
  const validate = (): boolean => {
    const next: FormErrors = {};
    const hoje0 = new Date();
    hoje0.setHours(0, 0, 0, 0);
    const entregaDt = parseDataHora(dataEntregaStr);
    const retiradaDt = parseDataHora(dataRetiradaStr);

    if (!nome.trim()) next.nome = "Informe o nome";
    if (!endereco.trim()) next.endereco = "Informe o endereço";
    if (!entregaDt) next.dataEntregaStr = "Data inválida (dd-mm-aaaa hh:mm)";
    if (!retiradaDt) next.dataRetiradaStr = "Data inválida (dd-mm-aaaa hh:mm)";
    if (entregaDt && entregaDt <= hoje0) next.dataEntregaStr = "Entrega deve ser a partir de amanhã";
    if (retiradaDt && retiradaDt <= hoje0) next.dataRetiradaStr = "Retirada deve ser a partir de amanhã";
    if (entregaDt && retiradaDt) {
      if (retiradaDt <= entregaDt) next.dataRetiradaStr = "Retirada não pode ser antes/igual à entrega";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    if (cart.length === 0) return;

    if (isGuest) {
      toast.info("Faça login para finalizar seu pedido.");
      return navigate("/login");
    }

    if (!validate()) {
      toast.error("Corrija os campos destacados.");
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
        clearCart();
        localStorage.removeItem("produtos");
        navigate("/redirecionamento", { state: { payload } });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao enviar pedido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Suspense fallback={<GuestHeader onBack={() => navigate(-1)} />}>
        {isGuest ? <GuestHeader onBack={() => navigate(-1)} /> : <LazyNavBar />}
      </Suspense>

      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pb-24 md:pb-0">
        {/* HEADER */}
        <header className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-6 pb-3">
          {!isGuest && (
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition"
            >
              <ArrowLeft size={18} /> Voltar
            </button>
          )}

          <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">
            Finalize sua locação
          </h1>

          {isGuest && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1.5 rounded-lg text-xs sm:text-sm">
              <AlertTriangle size={14} />
              Faça login para finalizar o pedido.
            </div>
          )}
        </header>

        {/* CONTEÚDO */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pb-16 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
          {/* CARRINHO */}
          <section className="md:col-span-7 lg:col-span-8">
            <h2 className="text-lg font-semibold text-slate-900">Seu carrinho</h2>
            <p className="text-sm text-slate-500 mt-1 mb-3">
              {cart.length > 0 ? `${cart.length} item(s)` : "Seu carrinho está vazio"}
            </p>

            {cart.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-slate-500">
                <div className="text-4xl mb-2">🛒</div>
                Adicione produtos ao carrinho para continuar.
              </div>
            ) : (
              <ul className="space-y-3">
                {cart.map((item: any, idx: number) => (
                  <motion.li
                    key={item._id}
                    variants={fade}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: idx * 0.04 }}
                    className="group rounded-2xl border border-slate-200 bg-white/90 backdrop-blur p-3 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={item.imagem}
                        alt={item.nome}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover ring-1 ring-slate-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><rect width='200' height='200' fill='%23f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='14'>sem imagem</text></svg>";
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-slate-900 text-sm sm:text-base">{item.nome}</h3>
                          <button
                            className="text-slate-400 hover:text-rose-600 ml-2"
                            onClick={() => removeFromCart(item._id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Quantidade: {item.quantidade}
                        </p>
                        <div className="font-semibold text-slate-900 text-sm mt-1">
                          {brl(Number(item.preco) * item.quantidade)}
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}

            {cart.length > 0 && (
              <div className="mt-3 flex justify-end text-sm text-slate-600">
                Subtotal: <span className="ml-2 font-semibold">{brl(subtotal)}</span>
              </div>
            )}
          </section>

          {/* FINALIZAÇÃO */}
          <aside className="md:col-span-5 lg:col-span-4 md:sticky md:top-6">
            <motion.div
              variants={fade}
              initial="hidden"
              animate="show"
              className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-xl shadow-xl p-5"
            >
              <h3 className="text-lg font-semibold text-slate-900">Finalização</h3>

              {/* PAGAMENTO */}
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
                      onClick={() => setPagamento(key)}
                      aria-pressed={pagamento === key}
                      className={`h-10 rounded-xl border text-xs sm:text-sm font-medium transition shadow-sm inline-flex items-center justify-center gap-1.5 ${
                        pagamento === key
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <Icon size={14} /> {key}
                    </button>
                  ))}
                </div>
              </div>

              {/* CAMPOS */}
              <div className="mt-6 space-y-3 text-sm">
                {/* Nome */}
                <div>
                  <label className="block mb-1 text-slate-700">Nome</label>
                  <div className="relative">
                    <input
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome completo"
                      disabled={isGuest}
                      className={`w-full h-11 pl-9 pr-3 rounded-xl border bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition ${
                        errors.nome ? "border-rose-300" : "border-slate-200"
                      } ${isGuest ? "opacity-70 cursor-not-allowed" : ""}`}
                    />
                    <User size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  </div>
                  {errors.nome && <p className="mt-1 text-xs text-rose-500">{errors.nome}</p>}
                </div>

                {/* Endereço */}
                <div>
                  <label className="block mb-1 text-slate-700">Endereço</label>
                  <div className="relative">
                    <input
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      placeholder="Rua, nº, bairro, cidade"
                      disabled={isGuest}
                      className={`w-full h-11 pl-9 pr-3 rounded-xl border bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition ${
                        errors.endereco ? "border-rose-300" : "border-slate-200"
                      } ${isGuest ? "opacity-70 cursor-not-allowed" : ""}`}
                    />
                    <MapPin size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  </div>
                  {errors.endereco && <p className="mt-1 text-xs text-rose-500">{errors.endereco}</p>}
                </div>

                {/* Datas */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-slate-700">Entrega</label>
                    <div className="relative">
                      <IMaskInput
                        mask="00-00-0000 00:00"
                        value={dataEntregaStr}
                        onAccept={(v) => setDataEntregaStr(v)}
                        placeholder="dd-mm-aaaa hh:mm"
                        disabled={isGuest}
                        className={`w-full h-11 pl-9 pr-3 rounded-xl border bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition ${
                          errors.dataEntregaStr ? "border-rose-300" : "border-slate-200"
                        } ${isGuest ? "opacity-70 cursor-not-allowed" : ""}`}
                      />
                      <Calendar size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                    {errors.dataEntregaStr && (
                      <p className="mt-1 text-xs text-rose-500">{errors.dataEntregaStr}</p>
                    )}
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-700">Retirada</label>
                    <div className="relative">
                      <IMaskInput
                        mask="00-00-0000 00:00"
                        value={dataRetiradaStr}
                        onAccept={(v) => setDataRetiradaStr(v)}
                        placeholder="dd-mm-aaaa hh:mm"
                        disabled={isGuest}
                        className={`w-full h-11 pl-9 pr-3 rounded-xl border bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition ${
                          errors.dataRetiradaStr ? "border-rose-300" : "border-slate-200"
                        } ${isGuest ? "opacity-70 cursor-not-allowed" : ""}`}
                      />
                      <Calendar size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                    {errors.dataRetiradaStr && (
                      <p className="mt-1 text-xs text-rose-500">{errors.dataRetiradaStr}</p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Frete a combinar após a finalização no WhatsApp.
                </p>
              </div>

              {/* Botão normal (apenas desktop) */}
              <button
                onClick={handleSubmit}
                disabled={cart.length === 0 || isGuest || isSubmitting}
                className="hidden md:flex mt-5 w-full h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[.99] disabled:opacity-60 disabled:cursor-not-allowed transition"
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

        {/* 🔵 BOTÃO FIXO APENAS MOBILE */}
        {!isGuest && (
          <div className="fixed bottom-0 left-0 w-full p-3 bg-white border-t shadow-md md:hidden">
            <button
              onClick={handleSubmit}
              disabled={cart.length === 0 || isSubmitting}
              className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold shadow-lg active:scale-[.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Enviando…" : "Finalizar Pedido →"}
            </button>
          </div>
        )}

        {isGuest && (
          <div className="fixed bottom-0 left-0 w-full p-3 bg-white border-t shadow-md md:hidden">
            <button
              onClick={() => navigate("/login")}
              className="w-full h-12 rounded-xl bg-blue-600 text-white font-semibold shadow-lg active:scale-[.99]"
            >
              Entrar para finalizar
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;
