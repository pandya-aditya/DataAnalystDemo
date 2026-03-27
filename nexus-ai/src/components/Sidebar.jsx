const HISTORY = []

export default function Sidebar({ workspaceName, onReset, onSettingsOpen }) {
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
        {HISTORY.length > 0 ? (
          ['Today', 'Yesterday'].map(section => (
            <div key={section}>
              <div className="history-section-label">{section}</div>
              {HISTORY.filter(h => h.section === section).map(item => (
                <div key={item.id} className="history-item">
                  <div className="history-dot" />
                  <div className="history-name">{item.name}</div>
                  <div className="history-time">{item.time}</div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div style={{ padding: '10px 10px', color: 'var(--text-muted)', fontSize: '12px' }}>
            No recent conversations.
          </div>
        )}
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
