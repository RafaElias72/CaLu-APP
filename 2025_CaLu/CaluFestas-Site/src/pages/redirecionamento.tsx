import React from 'react';
import NavBar from '../components/NavBar';
import QRCode from "react-qr-code";
import { useLocation } from "react-router-dom";
import { LocationItem } from "../interfaces/locationItem";

const Redirecionamento: React.FC = () => {

  const location = useLocation();
  const { payload } = location.state || {};

  const mensagem = `
Olá, tenho interesse em fazer uma locação no endereço: ${payload.endereco}, no dia: ${payload.data_entrega} até o dia: ${payload.data_retirada}
Forma de pagamento: ${payload.pagamento}

Itens alugados:
${payload.items.map((item: LocationItem) => `- ${item.nome} (Qtd: ${item.quantidade}) - R$ ${item.preco.toFixed(2)}`).join('\n')}

Total: R$ ${payload.total.toFixed(2)}

Qualquer dúvida, estou à disposição.
  `


  const numero = "0"
  const mensagemCodificada = encodeURIComponent(mensagem);
  const url = `https://wa.me/${numero}?text=${mensagemCodificada}`

  console.log(payload)

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
        <div className="flex flex-col md:flex-row md:gap-28 gap-10 max-w-7xl mx-auto px-4 md:px-0 justify-between">
          
          
          {payload && <div className="flex flex-col items-center justify-center w-full text-center">
            <h1 className="text-2xl font-medium text-gray-900 mb-6">Tudo certo!</h1>

            {/* imagem */}
            <div className="flex items-center justify-center mb-6">
                {/* <img
                    src="/Check.svg"
                    alt="Ícone de confirmação"
                    className="w-[384px] h-[384px] object-contain"
                    
                /> */}
              <QRCode value={url}></QRCode>
                
            </div>
            {/* <div className="w-40 h-40 mb-6">
              <img
                src="/greencheck.png"
                alt="Ícone de confirmação"
                className="w-full h-full object-contain"
              />
            </div> */}

            {/* Texto de redirecionamento */}
            <p className="text-lg text-black max-w-md">
              Sua locação está sendo processada e você será redirecionado para o <a href={url}>WhatsApp</a>
            </p>
          </div>}
        </div>
      </div>
    </>
  );
};

export default Redirecionamento;
