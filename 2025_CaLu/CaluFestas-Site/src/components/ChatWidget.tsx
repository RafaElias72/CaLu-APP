import React, { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Trash2, Minimize2 } from "lucide-react";
import { useChat, ChatMessage } from "../hooks/useChat";

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const { messages, isLoading, isTyping, sendMessage, clearHistory } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen, isMinimized]);

  // Focar no input quando abrir
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const input = inputRef.current;
    if (input && input.value.trim() && !isLoading) {
      sendMessage(input.value.trim());
      input.value = "";
    }
  };

  const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === "user";
    return (
      <div
        className={`flex w-full gap-2 mb-4 ${
          isUser ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-[85%] md:max-w-[80%] px-3 py-2 md:px-4 md:py-2 rounded-2xl ${
            isUser
              ? "bg-[#c6a875] text-white rounded-br-none"
              : "bg-gray-100 text-gray-800 rounded-bl-none"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          <span className="text-xs opacity-70 mt-1 block">
            {message.timestamp.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    );
  };

  const TypingIndicator: React.FC = () => (
    <div className="flex w-full gap-2 mb-4 justify-start">
      <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-bl-none px-4 py-3">
        <div className="flex gap-1 items-center">
          <div
            className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Botão Flutuante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-[#c6a875] hover:bg-[#b89665] text-white rounded-full p-3 md:p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 z-50 flex items-center justify-center group"
          aria-label="Abrir chat"
        >
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform" />
          {messages.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {messages.length}
            </span>
          )}
        </button>
      )}

      {/* Widget de Chat */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] md:w-96 max-w-md bg-white rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 transform ${
            isMinimized ? "h-16" : "h-[calc(100vh-8rem)] md:h-[600px] max-h-[600px]"
          }`}
          style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
        >
          {/* Header */}
          <div className="bg-[#c6a875] text-white rounded-t-2xl px-3 md:px-4 py-2 md:py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
              <div className="min-w-0">
                <h3 className="font-semibold text-xs md:text-sm truncate">CaLu Assistente</h3>
                <p className="text-xs opacity-90 hidden md:block">Estou aqui para ajudar!</p>
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
              {messages.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="p-1.5 md:p-1 hover:bg-white/20 rounded transition-colors"
                  aria-label="Limpar histórico"
                  title="Limpar histórico"
                >
                  <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              )}
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 md:p-1 hover:bg-white/20 rounded transition-colors"
                aria-label={isMinimized ? "Expandir" : "Minimizar"}
                title={isMinimized ? "Expandir" : "Minimizar"}
              >
                <Minimize2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 md:p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Fechar chat"
                title="Fechar chat"
              >
                <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-4">
                    <div className="bg-[#c6a875] rounded-full p-4 mb-4">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      Olá! 👋
                    </h4>
                    <p className="text-sm text-gray-600 max-w-xs">
                      Sou a CaLu, assistente virtual da CaLu Festas e Eventos.
                      Como posso ajudá-lo hoje?
                    </p>
                  </div>
                ) : (
                  <>
                    {messages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-3 md:p-4 bg-white rounded-b-2xl">
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Digite sua mensagem..."
                    disabled={isLoading || isTyping}
                    className="flex-1 px-3 md:px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#c6a875] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || isTyping}
                    className="bg-[#c6a875] hover:bg-[#b89665] text-white rounded-full p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0"
                    aria-label="Enviar mensagem"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                {isLoading && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Enviando mensagem...
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatWidget;

