import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import instagram1 from '../assets/foto 13.jpg';
import instagram2 from '../assets/foto 11.jpg';
import instagram3 from '../assets/foto 12.jpg';
import { useAuth } from '../context/useAuth';

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
  estado: string; // exemplo: "pendente", "concluida"
}

const ComprasRealizadas: React.FC = () => {
  const [locacoes, setLocacoes] = useState<Locacao[]>([]);
  const [loading, setLoading] = useState(true);
  const { perfil } = useAuth();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.post<Locacao[]>('http://localhost:8080/api/locations/cliente', {"email": perfil?.email}, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }) // ajuste a URL conforme seu backend
      .then((response) => {
        setLocacoes(response.data);
      })
      .catch((error) => {
        console.error('Erro ao buscar locações:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [perfil?.email, token]);

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center bg-gray-100 w-full min-h-screen pt-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-900">Locações Realizadas</h1>
        <div className="w-full max-w-2xl">
          {loading ? (
            <p className="text-center text-gray-600">Carregando...</p>
          ) : locacoes.length === 0 ? (
            <p className="text-center text-gray-600">Nenhuma locação realizada ainda.</p>
          ) : (
            locacoes.map((locacao) => (
              <div key={locacao._id} className="bg-white rounded-lg shadow-md p-6 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-blue-900">Endereço:</span>
                  <span>{locacao.endereco}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-blue-900">Data de entrega:</span>
                  <span>{locacao.data_entrega}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-blue-900">Data de retorno:</span>
                  <span>{locacao.data_retirada}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-blue-900">Forma de pagamento:</span>
                  <span>{locacao.pagamento}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-blue-900">Estado:</span>
                  <span>{locacao.estado}</span>
                </div>
                <div className="mb-2">
                  <span className="font-semibold text-blue-900">Itens:</span>
                  <ul className="list-disc list-inside">
                    {locacao.items.map((item, idx) => (
                      <li key={idx}>
                        {item.nome} - {item.quantidade} unidade{item.quantidade > 1 ? 's' : ''}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-blue-900">Total:</span>
                  <span>R$ {locacao.total.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Rodapé */}
      <div className="bg-blue-900 text-white w-full py-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CaLu Festas e Eventos</h3>
            <p>Organizamos eventos inesquecíveis! Entre em contato para transformar seu sonho em realidade.</p>
            <p>📞 Telefone: (11) 1234-5678</p>
            <p>📸: <a href="https://www.instagram.com/calu_conceitos" target="_blank" rel="noopener noreferrer" className="underline">@calu_conceitos</a></p>
          </div>
          <div>
            <a href="https://www.instagram.com/calu_conceitos" target="_blank" rel="noopener noreferrer">
              <h3 className="text-xl font-bold mb-4">Instagram</h3>
            </a>
            <div className="grid grid-cols-3 gap-4">
              <img src={instagram1} alt="Instagram 1" className="w-full h-auto rounded-md" />
              <img src={instagram2} alt="Instagram 2" className="w-full h-auto rounded-md" />
              <img src={instagram3} alt="Instagram 3" className="w-full h-auto rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComprasRealizadas;
