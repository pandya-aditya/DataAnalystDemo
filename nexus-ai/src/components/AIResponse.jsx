export default function AIResponse({ text }) {
  return (
    <div className="ai-response">
      <div className="ai-label">Nexus &nbsp;·&nbsp; just now</div>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {text}
      </div>
    </div>
  )
}
