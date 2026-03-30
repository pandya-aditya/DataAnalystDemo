import { useRef, useLayoutEffect } from 'react'
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
  onLoadScenario,
  onSend,
  userName,
  onExpandChart,
}) {
  const startConversation = onStartConversation ?? onLoadScenario
  const convRef = useRef(null)
  const lastSubmittedPromptRef = useRef(null)
  const responseReserveRef = useRef(null)

  const lastMsg = messages[messages.length - 1]
  // Keep headroom through the thought-trace phase; removing the reserve when trace
  // mounts was collapsing scroll height and snapping the thread back down.
  const holdScrollHeadroom =
    lastMsg?.type === 'user' || lastMsg?.type === 'trace'

  let lastUserMsgIndex = -1
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].type === 'user') {
      lastUserMsgIndex = i
      break
    }
  }

  useLayoutEffect(() => {
    const reserve = responseReserveRef.current
    if (!showConversation || !holdScrollHeadroom) {
      if (reserve) reserve.style.minHeight = ''
      return
    }
    const el = lastSubmittedPromptRef.current
    const root = convRef.current
    if (!el || !root || !reserve) return

    // Extra scrollable height so we can scroll the user message to the top of the viewport;
    // the gap fills in as trace + AI response stream in.
    const msgH = el.getBoundingClientRect().height
    const reserveH = Math.max(0, root.clientHeight - msgH - 48)
    reserve.style.minHeight = `${reserveH}px`

    const elRect = el.getBoundingClientRect()
    const rootRect = root.getBoundingClientRect()
    const top = root.scrollTop + (elRect.top - rootRect.top)
    root.scrollTo({ top, behavior: 'smooth' })
  }, [messages, showConversation, holdScrollHeadroom])

  return (
    <main className="canvas-area">
      {showConversation ? (
        <div className="conversation" ref={convRef}>
          {messages.map((msg, i) => {
            if (msg.type === 'user') {
              const ref = i === lastUserMsgIndex ? lastSubmittedPromptRef : undefined
              return <UserMessage key={i} ref={ref} text={msg.text} time={msg.time} />
            }
            if (msg.type === 'trace') return <ThoughtTrace key={i} lines={msg.lines} collapsing={msg.collapsing} />
            if (msg.type === 'ai')    return <AIResponse   key={i} templateId={msg.templateId} roleCategory={msg.roleCategory} roleStepIndex={msg.roleStepIndex} text={msg.text} onExpandChart={onExpandChart} />
            return null
          })}
          {holdScrollHeadroom ? (
            <div
              className="conversation-response-reserve"
              ref={responseReserveRef}
              aria-hidden
            />
          ) : null}
        </div>
      ) : (
        <EmptyState onStartConversation={startConversation} userName={userName} />
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
