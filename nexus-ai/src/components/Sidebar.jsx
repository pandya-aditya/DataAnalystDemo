const TEMPLATE_HISTORY = [
  { id: 1, conversationId: 1, name: 'Blended CAC vs LTV Analysis', time: '2m',  section: 'Today' },
  { id: 2, conversationId: 2, name: 'Profit Dip Root Cause',        time: '18m', section: 'Today' },
  { id: 3, conversationId: 3, name: 'Winter Collection Reorder',     time: '1h',  section: 'Today' },
  { id: 4, conversationId: 4, name: 'Monday Morning Briefing',       time: '1d',  section: 'Yesterday' },
  { id: 5, conversationId: null, name: 'Q3 Revenue Attribution',     time: '2d',  section: 'Yesterday' },
]

const getRelativeTimeLabel = (updatedAt) => {
  const now = Date.now()
  const ms = Math.max(0, now - Number(updatedAt || now))
  const mins = Math.floor(ms / 60000)
  if (mins <= 0) return 'now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

const getHistorySection = (updatedAt) => {
  const date = new Date(Number(updatedAt))
  if (Number.isNaN(date.getTime())) return 'Earlier'
  const today = new Date()
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000)
  if (date >= startOfToday) return 'Today'
  if (date >= startOfYesterday) return 'Yesterday'
  return 'Earlier'
}

export default function Sidebar({
  activeConversationId,
  activeChatSessionId,
  chatSessions,
  workspaceName,
  onOpenConversation,
  onOpenChatSession,
  onReset,
  onSettingsOpen,
}) {
  const sessionHistory = (Array.isArray(chatSessions) ? chatSessions : [])
    .slice()
    .sort((a, b) => Number(b?.updatedAt || 0) - Number(a?.updatedAt || 0))
    .map(s => ({
      id: s.id,
      kind: 'session',
      name: s.title || 'Conversation',
      time: getRelativeTimeLabel(s.updatedAt),
      section: getHistorySection(s.updatedAt),
    }))

  const history = [
    ...sessionHistory,
    ...TEMPLATE_HISTORY.map(h => ({ ...h, kind: 'template' })),
  ]

  const sections = ['Today', 'Yesterday', 'Earlier'].filter(section => history.some(h => h.section === section))

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <button className="new-chat-btn" onClick={onReset} title="Start new chat" aria-label="Start new chat">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 3v10M3 8h10"/>
          </svg>
          New Conversation
        </button>
      </div>

      <div className="sidebar-history">
        {sections.map(section => (
          <div key={section}>
            <div className="history-section-label">{section}</div>
            {history.filter(h => h.section === section).map(item => (
              <div
                key={item.id}
                className={`history-item${
                  item.kind === 'template' && item.conversationId != null && activeConversationId === item.conversationId
                    ? ' active'
                    : item.kind === 'session' && activeChatSessionId && activeChatSessionId === item.id
                    ? ' active'
                    : ''
                }`}
                onClick={() => {
                  if (item.kind === 'template' && item.conversationId) onOpenConversation?.(item.conversationId)
                  if (item.kind === 'session') onOpenChatSession?.(item.id)
                }}
                onKeyDown={(e) => {
                  if (e.key !== 'Enter' && e.key !== ' ') return
                  e.preventDefault()
                  if (item.kind === 'template' && item.conversationId) onOpenConversation?.(item.conversationId)
                  if (item.kind === 'session') onOpenChatSession?.(item.id)
                }}
                role={item.kind === 'template' ? (item.conversationId ? 'button' : undefined) : 'button'}
                tabIndex={item.kind === 'template' ? (item.conversationId ? 0 : -1) : 0}
              >
                <div className="history-dot" />
                <div className="history-name">{item.name}</div>
                <div className="history-time">{item.time}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="sidebar-bottom">
        <button className="settings-btn" onClick={onSettingsOpen} title="Open settings" aria-label="Open settings">
          <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="9" cy="9" r="2.5"/>
            <path d="M9 1.5v1.8M9 14.7v1.8M1.5 9h1.8M14.7 9h1.8M3.7 3.7l1.3 1.3M13 13l1.3 1.3M14.3 3.7L13 5M5 13l-1.3 1.3"/>
          </svg>
        </button>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{workspaceName}</span>
      </div>
    </aside>
  )
}
