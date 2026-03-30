export default function ContextPanel({ open, actions = [], onClose, onRequestRevert }) {
  return (
    <aside id="context-panel" className={`context-panel${open ? ' open' : ''}`}>
      <div className="context-header">
        <span className="context-title">Completed Actions</span>
        <button className="context-close" onClick={onClose} title="Close activity" aria-label="Close activity">
          <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l12 12M13 1L1 13"/>
          </svg>
        </button>
      </div>

      <div className="context-body">
        <div className="context-section">
          <div className="context-section-label">Activity</div>
          {actions.length > 0 ? (
            actions.map(action => (
              <div key={action.id} className="action-item">
                <div className="action-main">
                  <span className="action-name">{action.text}</span>
                  {action.time ? <span className="action-time">{action.time}</span> : null}
                </div>
                <div className="action-right">
                  <span className={`action-status${action.status === 'reverted' ? ' reverted' : ''}`}>
                    {action.status === 'reverted' ? 'Reverted' : 'Done'}
                  </span>
                  {action.status !== 'reverted' ? (
                    <button
                      type="button"
                      className="action-revert-btn"
                      onClick={() => onRequestRevert?.(action)}
                      title="Revert"
                      aria-label={`Revert: ${action.text}`}
                    >
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M6 5H3V2"/>
                        <path d="M3 5c1.6-2 3.8-3 6.4-2.6C12.1 3 14 5.1 14 7.7c0 2.8-2.2 5-5 5H6.4"/>
                      </svg>
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              No actions yet. Send a prompt to see what Nexus completes.
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
