"use client";

import { FormEvent, useEffect, useState } from "react"
import { SendHorizonal } from 'lucide-react';
import useAppContext from '../../context/appContext';

interface Props {
  onSendMessage: (message: string) => void
  placeholder?: string
  disableCorrections?: boolean
}

export const TextMessageBox = ({ onSendMessage, placeholder, disableCorrections = false }: Props) => {
  const [message, setMessage] = useState("")
  const [submitMessage, setSubmitMessage] = useState(false)
  const { llmContext, setLlmContext } = useAppContext();

  useEffect(() => {
    onSendMessage(message)
    setMessage("")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [llmContext]);

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (message.trim().length == 0) return
    setLlmContext([...llmContext, message]);
  }

  return (
    <form
      onSubmit={ handleSendMessage }
      className="flex flex-row items-center h-16 rounded-xl bg-gray-200 w-full px-4"
    >
      <div className="flex-grow">
        <div className="relative w-full">
          <input
            type="text"
            name="message"
            autoFocus
            className="flex w-full border rounded-xl text-gray-800 focus:outline-none focus:border-x-indigo-300 pl-4 h-10"
            placeholder={placeholder}
            autoComplete={disableCorrections ? "on" : "off"}
            autoCorrect={disableCorrections ? "on" : "off"}
            spellCheck={disableCorrections ? "true" : "false"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      <div className="ml-4">
        <button id="send-button"
          className="flex justify-between items-center bg-custom-blue px-8 py-2 rounded-xl"
          onClick={ () => setSubmitMessage(!submitMessage) }
        >
          <span className="text-white mr-2">Enviar</span>
          <SendHorizonal 
            className="w-5 h-5 text-gray-500 cursor-pointer absolute right-12 bottom-6" 
            xlinkTitle='Send your question'
          />
        </button>
      </div>
    </form>
  )
}
