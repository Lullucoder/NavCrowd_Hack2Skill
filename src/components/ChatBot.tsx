import { Bot, SendHorizonal, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { InlineLoader } from './LoadingStates'
import { venueAssistantFallback } from '../data/mockData'
import type { ChatMessage } from '../types'

const initialMessage: ChatMessage = {
  id: 'intro',
  sender: 'assistant',
  text: 'Hi, I am your VenueFlow assistant powered by Google Gemini. Ask me about queues, food, gates, parking, and emergency routes.',
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
    <section className="glass-card-static vf-chatbot">
      <div className="vf-panel-head">
        <h3 style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
          <Sparkles size={18} className="animate-glow" style={{ color: 'var(--accent-blue)' }} />
          AI Event Assistant
        </h3>
        <span className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
          Powered by Gemini
        </span>
      </div>

      <div id="vf-chat-scroll" className="vf-chat-messages">
        {messages.map((message, index) => (
          <article
            key={message.id}
            className={`vf-chat-bubble ${message.sender} animate-fadeIn`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {message.sender === 'assistant' && (
              <Bot size={14} style={{ marginRight: '4px', display: 'inline', verticalAlign: 'middle' }} />
            )}
            <p style={{ display: 'inline' }}>{message.text}</p>
          </article>
        ))}

        {isLoading ? (
          <div className="animate-fadeIn">
            <InlineLoader text="Assistant is thinking..." />
          </div>
        ) : null}
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
          disabled={isLoading}
        />
        <button className="btn btn-primary hover-glow-blue" onClick={() => void postMessage()} disabled={isLoading}>
          <SendHorizonal size={16} />
          Send
        </button>
      </div>
    </section>
  )
}
