const QUICK_STARTS = [
  { id: 1, label: 'Acquisition', text: 'What is my blended CAC across Meta and TikTok this week, compared to 30-day LTV by channel?' },
  { id: 2, label: 'Profitability', text: "Sales look fine but I feel like I'm making less money this month. What's happening?" },
  { id: 3, label: 'Inventory', text: 'Check Winter Collection stock levels and cross-reference against the Northeast weather forecast.' },
  { id: 4, label: 'Briefing', text: "Give me the weekend summary. What did you do, what needs my attention, and what's the plan?" },
]

export default function EmptyState({ onStartConversation, userName }) {
  const displayName = userName?.trim() || 'there'

  return (
    <div className="empty-state">
      <div className="empty-greeting">Good morning, {displayName}.</div>
      <div className="empty-sub">What are we analyzing today?</div>
      <div className="starter-grid">
        {QUICK_STARTS.map(p => (
          <button
            key={p.id}
            className="starter-card"
            onClick={() => onStartConversation?.(p.id)}
            title={p.label}
            aria-label={p.label}
          >
            <div className="starter-label">{p.label}</div>
            <div className="starter-text">{p.text}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
