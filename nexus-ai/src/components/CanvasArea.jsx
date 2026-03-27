import { useRef } from 'react'
import EmptyState from './EmptyState'
import UserMessage from './UserMessage'
import ThoughtTrace from './ThoughtTrace'
import AIResponse from './AIResponse'
import InputBar from './InputBar'
import KpiOverviewWidget from './KpiOverviewWidget'

export default function CanvasArea({
  showConversation,
  messages,
  inputValue,
  setInputValue,
  onStartConversation,
  onSend,
  userName,
  onExpandChart,
}) {
  const convRef = useRef(null)

  return (
    <main className="canvas-area">
      {showConversation ? (
        <div className="conversation" ref={convRef}>
          {messages.map((msg, i) => {
            if (msg.type === 'user')  return <UserMessage  key={i} text={msg.text} time={msg.time} />
            if (msg.type === 'trace') return <ThoughtTrace key={i} lines={msg.lines} collapsing={msg.collapsing} />
            if (msg.type === 'ai')    return <AIResponse   key={i} templateId={msg.templateId} text={msg.text} onExpandChart={onExpandChart} />
            return null
          })}
        </div>
      ) : (
        <EmptyState onStartConversation={onStartConversation} userName={userName} />
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
