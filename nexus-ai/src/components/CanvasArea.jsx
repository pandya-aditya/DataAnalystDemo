import { useRef } from 'react'
import EmptyState from './EmptyState'
import UserMessage from './UserMessage'
import AIResponse from './AIResponse'
import InputBar from './InputBar'
import KpiOverviewWidget from './KpiOverviewWidget'

export default function CanvasArea({
  showConversation,
  messages,
  inputValue,
  setInputValue,
  onSend,
  userName,
}) {
  const convRef = useRef(null)

  return (
    <main className="canvas-area">
      {showConversation ? (
        <div className="conversation" ref={convRef}>
          {messages.map((msg, i) => {
            if (msg.type === 'user')  return <UserMessage  key={i} text={msg.text} time={msg.time} />
            if (msg.type === 'ai')    return <AIResponse   key={i} text={msg.text} />
            return null
          })}
        </div>
      ) : (
        <EmptyState onPickPrompt={setInputValue} userName={userName} />
      )}
      <KpiOverviewWidget />
      <InputBar
        value={inputValue}
        onChange={setInputValue}
        onSend={onSend}
      />
    </main>
  )
}
