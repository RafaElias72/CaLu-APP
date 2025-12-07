import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';

interface Item {
  _id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

interface Locacao {
  _id: string;
  nome: string;
  endereco: string;
  email: string;
  data_entrega: string;
  data_retirada: string;
  pagamento: string;
  total: number;
  items: Item[];
  estado: string; 
}


const ComprasRealizadasAdm: React.FC = () => {
  const [locacoes, setLocacoes] = useState<Locacao[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:8080/api/locations/', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }) // <- ajuste a URL da sua API
      .then((res) => {
        setLocacoes(res.data);
      })
      .catch((err) => {
        console.error('Erro ao buscar locações:', err);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleConcluir = async (id: string) => {
  const locacao = locacoes.find((l) => l._id === id);
  if (!locacao) return;

  try {
    await axios.put(`http://localhost:8080/api/locations/${id}`, {
      estado: 'Concluida',
      items: locacao.items.map(item => ({
        _id: item._id,
        nome: item.nome,
        quantidade: item.quantidade
      }))
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setLocacoes(prev =>
      prev.map((loc) => (loc._id === id ? { ...loc, estado: 'Concluida' } : loc))
    );
  } catch (err) {
    console.error('Erro ao concluir:', err);
  }
};

const handleRecusar = async (id: string) => {
  const locacao = locacoes.find((l) => l._id === id);
  if (!locacao) return;

  try {
    await axios.put(`http://localhost:8080/api/locations/${id}`, {
      estado: 'Recusada',
      items: locacao.items.map(item => ({
        _id: item._id,
        nome: item.nome,
        quantidade: item.quantidade
      }))
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setLocacoes(prev =>
      prev.map((loc) => (loc._id === id ? { ...loc, estado: 'Recusada' } : loc))
    );
  } catch (err) {
    console.error('Erro ao recusar:', err);
  }
};


  const handleExcluir = async (id: string) => {
  const locacao = locacoes.find((l) => l._id === id);
  if (!locacao) return;

  if (window.confirm('Deseja excluir esta locação?')) {
    try {
      await axios.post(`http://localhost:8080/api/locations/${id}/delete`, {
        
          items: locacao.items.map(item => ({
            _id: item._id,
            nome: item.nome,
            quantidade: item.quantidade
          }))
        
      },{
      headers: { Authorization: `Bearer ${token}` }
    });

      setLocacoes(prev => prev.filter((loc) => loc._id !== id));
    } catch (err) {
      console.error('Erro ao excluir:', err);
    }
  }
};


  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center bg-gray-100 w-full min-h-screen pt-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-900">Locações Realizadas (Admin)</h1>
        {loading ? (
          <p>Carregando locações...</p>
        ) : locacoes.length === 0 ? (
          <p className="text-center text-gray-600">Nenhuma locação encontrada.</p>
        ) : (
          <div className="w-full max-w-2xl">
            {locacoes.map((locacao) => (
              <div key={locacao._id} className={`bg-white rounded-lg shadow-md p-6 mb-4 ${locacao.estado === 'concluida' ? 'opacity-60' : ''}`}>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-blue-900">Nome:</span>
                  <span>{locacao.nome}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-blue-900">Endereço:</span>
                  <span>{locacao.endereco}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-blue-900">Entrega:</span>
                  <span>{locacao.data_entrega}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-blue-900">Devolução:</span>
                  <span>{locacao.data_retirada}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-blue-900">Itens:</span>
                  <ul className="list-disc list-inside">
                    {locacao.items.map((item) => (
                      <li key={item._id}>
                        {item.nome} - {item.quantidade} unidade{item.quantidade > 1 ? 's' : ''}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-blue-900">Estado:</span>
                  <span>{locacao.estado}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-blue-900">Total:</span>
                  <span>R$ {locacao.total.toFixed(2)}</span>
                </div>
                {locacao.estado === "Em analise" && <div className="flex gap-2 mt-4">
                  <button
                    className={`px-4 py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700 transition `}
                    onClick={() => handleConcluir(locacao._id)}
                  >
                    Concluir
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-red-600 text-white font-bold hover:bg-red-700 transition"
                    onClick={() => handleRecusar(locacao._id)}
                  >
                    Recusar
                  </button>
                  <button
                    className="px-4 py-2 rounded bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition"
                    onClick={() => handleExcluir(locacao._id)}
                  >
                    Excluir
                  </button>
                </div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ComprasRealizadasAdm;
