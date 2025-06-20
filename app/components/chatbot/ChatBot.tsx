/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    WebChat: any;
  }
}

export default function ChatBot() {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoaded && chatContainerRef.current && window.WebChat) {
      try {
        const directLineSecret = process.env.NEXT_PUBLIC_DIRECT_LINE_SECRET

        if (!directLineSecret) {
          setError('Direct Line Secret not configured')
          return
        }

        const styleOptions = {
          bubbleBackground: '#1e293b',
          bubbleFromUserBackground: '#0078d4',
          bubbleFromUserTextColor: 'white',
          bubbleTextColor: '#d1d5db',
          sendBoxHeight: 60,
          hideUploadButton: true,
          backgroundColor: '#334155',
        }

        const localeStrings = {
          SEND_BOX_PLACEHOLDER: 'Ask a question...'
        }

        window.WebChat.renderWebChat(
          {
            directLine: window.WebChat.createDirectLine({
              secret: directLineSecret,
            }),
            locale: 'en-US',
            styleOptions,
            localeStrings,
          },
          chatContainerRef.current
        )
      } catch (err) {
        console.error('Error rendering webchat:', err)
        setError('Error loading the chat')
      }
    }
  }, [isLoaded])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-600">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <>

      <Script
        src="https://cdn.botframework.com/botframework-webchat/latest/webchat.js"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError('Error loading WebChat script')}
      />
      <div>
        🤖 <span className="text-orange-600 font-medium">Wildfire Assistant</span>
      </div>

      <div ref={chatContainerRef} className="h-full w-full" />
    </>
  )
}