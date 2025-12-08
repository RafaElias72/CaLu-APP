import { useCallback, useEffect, useState } from "react";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const WEBHOOK_URL =
  "/webhook/calu-chat";
const STORAGE_KEY = "calu_chat_history";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar histórico do localStorage ao montar
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        setMessages(
          parsed.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }))
        );
      } catch (e) {
        console.error("Erro ao carregar histórico:", e);
      }
    }
  }, []);

  // Salvar histórico no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      // Adicionar mensagem do usuário
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content,
        sender: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Enviar para o webhook do n8n
        const response = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: content,
          }),
        });

        if (!response.ok) {
          throw new Error(`Erro na resposta: ${response.status}`);
        }

        // Obter a resposta como texto primeiro para debug
        const responseText = await response.text();
        console.log("Resposta bruta:", responseText);

        let data;
        try {
          // Tentar parsear como JSON
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Erro ao parsear JSON:", parseError);
          // Se falhar o parse, tentar extrair o conteúdo manualmente
          const outputMatch = responseText.match(/"output":\s*"([^"]*)"/);
          if (outputMatch && outputMatch[1]) {
            data = { output: outputMatch[1] };
          } else {
            throw new Error(
              `Resposta inválida do servidor: ${responseText.substring(0, 100)}`
            );
          }
        }

        // Simular digitação por 500ms
        setIsTyping(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsTyping(false);

        // Extrair a mensagem baseado na estrutura correta
        let messageContent = "Desculpe, não consegui processar sua mensagem.";

        // Verificar a estrutura esperada do n8n
        if (data && data.output) {
          messageContent = data.output;
        } else if (Array.isArray(data) && data[0] && data[0].output) {
          messageContent = data[0].output;
        } else if (data && data.success && data.output) {
          messageContent = data.output;
        }

        // Adicionar resposta da assistente
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: messageContent,
          sender: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError(errorMessage);
        console.error("Erro ao enviar mensagem:", err);

        // Adicionar mensagem de erro
        const errorAssistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: `Desculpe, ocorreu um erro: ${errorMessage}. Por favor, tente novamente.`,
          sender: "assistant",
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorAssistantMessage]);
      } finally {
        setIsLoading(false);
        setIsTyping(false);
      }
    },
    []
  );

  const clearHistory = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    messages,
    isLoading,
    isTyping,
    error,
    sendMessage,
    clearHistory,
  };
}

