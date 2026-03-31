export default function Topbar({
  sessionName,
  workspaceName,
  profileInitials,
  onSettingsOpen,
  sourcesOpen,
  activityUnread = false,
  onSourcesToggle,
}) {
  const activityLabel = sourcesOpen
    ? 'Hide activity'
    : activityUnread
      ? 'Show activity (new)'
      : 'Show activity'

  return (
    <header className="topbar">
      <div className="wordmark">NEXUS<sup>AI</sup></div>
      <div className="session-name">{sessionName}</div>
      <div className="topbar-right">
        <button className="workspace-switcher" title="Switch workspace" aria-label="Switch workspace">
          {workspaceName}
          <svg viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 1l4 4 4-4"/>
          </svg>
        </button>
        <span className="sources-toggle-wrap">
          <button
            className={`sources-toggle-btn${sourcesOpen ? ' on' : ''}`}
            onClick={onSourcesToggle}
            aria-expanded={sourcesOpen}
            aria-label={activityLabel}
            title={activityLabel}
          >
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
              <path d="M4 5h10"/>
              <path d="M4 9h10"/>
              <path d="M4 13h10"/>
            </svg>
          </button>
          {activityUnread && !sourcesOpen ? (
            <span className="sources-activity-badge" aria-hidden />
          ) : null}
        </span>
        <div className="profile-avatar">{profileInitials}</div>
      </div>
    </header>
  )
}
