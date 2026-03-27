export default function ContextPanel({ open, sources = [], onClose }) {
  return (
    <aside id="context-panel" className={`context-panel${open ? ' open' : ''}`}>
      <div className="context-header">
        <span className="context-title">Data Sources</span>
        <button className="context-close" onClick={onClose} title="Close sources" aria-label="Close sources">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l12 12M13 1L1 13"/>
          </svg>
        </button>
      </div>

      <div className="context-body">
        <div className="context-section">
          <div className="context-section-label">Connected Sources</div>
          {sources.length > 0 ? (
            sources.map(src => (
              <div key={src} className="source-item">
                <span className="source-name">{src}</span>
                <span className="source-status">Synced</span>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              No connected sources yet.
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
