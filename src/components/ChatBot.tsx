import { Bot, SendHorizonal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { venueAssistantFallback } from '../data/mockData'
import type { ChatMessage } from '../types'

const initialMessage: ChatMessage = {
  id: 'intro',
  sender: 'assistant',
  text: 'Hi, I am your VenueFlow assistant. Ask me about queues, food, gates, parking, and emergency routes.',
  timestamp: new Date().toISOString()
}

export const ChatBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage])
  const [draft, setDraft] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const endpoint = useMemo(() => `${import.meta.env.VITE_API_BASE_URL ?? ''}/api/chat`, [])

  useEffect(() => {
    const panel = document.getElementById('vf-chat-scroll')
    if (panel) {
      panel.scrollTop = panel.scrollHeight
    }
  }, [messages, isLoading])

  const postMessage = async () => {
    const question = draft.trim()

    if (!question || isLoading) {
      return
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: question,
      timestamp: new Date().toISOString()
    }

    setMessages((prev) => [...prev, userMessage])
    setDraft('')
    setIsLoading(true)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: question })
      })

      if (!response.ok) {
        throw new Error('Backend chatbot unavailable')
      }

      const payload = (await response.json()) as { reply?: string }
      const reply = payload.reply?.trim() ? payload.reply : venueAssistantFallback(question)

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toISOString()
        }
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'assistant',
          text: venueAssistantFallback(question),
          timestamp: new Date().toISOString()
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="glass-card vf-chatbot">
      <div className="vf-panel-head">
        <h3>
          <Bot size={18} /> AI Event Assistant
        </h3>
      </div>

      <div id="vf-chat-scroll" className="vf-chat-messages">
        {messages.map((message) => (
          <article key={message.id} className={`vf-chat-bubble ${message.sender}`}>
            <p>{message.text}</p>
          </article>
        ))}

        {isLoading ? <p className="vf-muted">Assistant is thinking...</p> : null}
      </div>

      <div className="vf-chat-input-row">
        <input
          className="input"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Where is the nearest restroom from Gate D?"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              void postMessage()
            }
          }}
        />
        <button className="btn btn-primary" onClick={() => void postMessage()} disabled={isLoading}>
          <SendHorizonal size={16} />
          Send
        </button>
      </div>
    </section>
  )
}
