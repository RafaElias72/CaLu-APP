import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';


const faqData = [
  {
    question: "Quais tipos de materiais vocês oferecem para locação?",
    answer: "Materiais para festas e eventos em geral, como: mesas, cadeiras, toalhas, louças, copos, talheres e etc. Consulte o catálogo pelo site através do botão Catálogo."
  },
  {
    question: "Como funciona o pagamento? ",
    answer: "Após a conclusão do pedido, você deverá apertar no botão Redirecionar assim, você será redirecionado para o WhatsApp para contato direto com um responsável pela empresa para concluir o pagamento ou outras dúvidas."
  },
  {
    question: "Vocês fazem entrega e retirada dos materiais?",
    answer: "Sim, o frete será calculado a partir da região onde o material deverá ser entregue."
  },
  {
    question: "O que acontece em caso de quebra ou perda de algum item?",
    answer: "O valor do item será cobrado. "
  },
  {
    question: "Posso retirar os materiais na empresa em vez de pagar pela entrega?",
    answer: "Sim, isso pode ser combinado em contato direto com um responsável pela empresa."
  },
    {
    question: "Vocês oferecem pacotes promocionais ou descontos?",
    answer: "Alugar um conjunto pré-definido é mais barato do que pedir cada item separadamente."
  },
    {
    question: "Vocês trabalham com decoração também ou apenas com locação?",
    answer: "Também trabalhamos com decoração, isso pode ser combinado em contato direto com um responsável pela empresa."
  },
];

const FAQ: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center bg-gray-100 min-h-screen pt-10">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl w-full">
          <h1 className="text-2xl font-bold text-blue-900 mb-6 text-center">Perguntas Frequentes (FAQ)</h1>
          <div className="space-y-6">
            {faqData.map((item, idx) => (
              <div key={idx}>
                <h2 className="font-semibold text-lg text-blue-800">{item.question}</h2>
                <p className="text-gray-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Informações */}
      </div>
        <Footer/>
    </>
  );
};

export default FAQ;