'use client'
import { useState, useRef } from 'react'

type Msg = { role: 'user' | 'assistant'; content: string }

export default function Chat() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  async function handleSend() {
    if (!input.trim() || loading) return
    const text = input
    setInput('')
    setLoading(true)

    // Add user message
    setMessages(m => [...m, { role: 'user', content: text }])

    // TEMP: fake AI reply so we can see the UI (we’ll wire real API later)
    setTimeout(() => {
      setMessages(m => [...m, { role: 'assistant', content: `You said: ${text}` }])
      setLoading(false)
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 600)
  }

  return (
    <div className="min-h-[70vh] flex flex-col">
      {/* Title */}
      <h1 className="text-lg font-medium tracking-tight mb-4">{
        process.env.NEXT_PUBLIC_SITE_NAME || 'RAG Client'
      }</h1>

      {/* Messages */}
      <div className="flex-1 space-y-6">
        {messages.map((m, i) => (
          <div
  key={i}
  className={m.role === 'user'
    ? 'flex justify-end max-w-full' // push bubble to right
    : 'flex justify-start max-w-full'} // push bubble to left
>
  {m.role === 'user' ? (
    <div className="rounded-xl px-4 py-3 bubble max-w-[75%] text-left">
      {m.content}
    </div>
  ) : (
    <div className="whitespace-pre-wrap max-w-[80%] text-left">
      {m.content}
    </div>
  )}
</div>

        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 mt-6">
        <div className="flex items-center gap-2 rounded-xl border border-black/10 dark:border-white/10 px-3 py-2 bg-transparent">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
            }}
            rows={1}
            placeholder="Type your message…"
            className="flex-1 bg-transparent outline-none resize-none"
          />
          <button
  onClick={handleSend}
  disabled={loading || !input.trim()}
  aria-label="Send"
  title="Send"
  className={[
    'flex items-center justify-center',
    'h-9 w-9 rounded-full',
    'border border-black/20 dark:border-white/20',
    'bg-transparent',
    (loading || !input.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'
  ].join(' ')}
>
  ↑
</button>

        </div>
      </div>
    </div>
  )
}
