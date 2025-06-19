"use client";

import { GptMessage, TypingLoader, TextMessageBox, Card } from "../"
import { chatService } from "../../service";
import { IMessage } from "../../interfaces";
import { useEffect, useRef } from "react";
import useAppContext from '../../context/appContext';

export const ChatContainer = () => {
  const { setMessages, isLoading, setIsLoading, llmContext } = useAppContext();

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 500);
  }, [isLoading]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  const handlePost = async (text: string) => {
    setIsLoading(true)

    if (!text || text.trim() === "") {
      setIsLoading(false)
      return
    }

    setMessages((prev: IMessage[]) => [...prev, { text, isGpt: false }])

    const data = await chatService(llmContext)

    if (!data.data) {
      setMessages((prev: IMessage[]) => [...prev, { text: "Desculpe, não consegui analisar a sua solicitação. Por favor, tente novamente.", isGpt: true }])
      setIsLoading(false)
      return
    }

    setMessages((prev: IMessage[]) => [...prev, { text: data.data, isGpt: true }])
    setIsLoading(false)
  }

  return (
    <div className="w-96 bg-slate-800 border-l border-slate-700 p-6 space-y-6 overflow-y-auto">

      <Card className="bg-slate-700 border-slate-600 flex flex-col justify-between p-4 h-full">
        <div ref={containerRef} className="chat-messages">
          <div className="flex flex-col">
            <GptMessage text={`Olá, para análise de folha, selecione a data inicial, a data final e clique no botão "Analisar".`} />
            <GptMessage text={`Use o campo abaixo para me enviar mensagens e fazer perguntas".`} />

            {
              isLoading && (
                <TypingLoader className="fade-in" />
              )
            }

          </div>
        </div>

        <TextMessageBox
          onSendMessage={handlePost}
          placeholder="Escreva aqui sua mensagem"
          disableCorrections
        />
      </Card>
    </div>
    
  )
}