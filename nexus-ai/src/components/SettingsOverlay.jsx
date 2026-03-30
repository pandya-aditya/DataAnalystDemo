import { useMemo, useRef, useState } from 'react'
import { INTEGRATIONS } from '../constants/data'
import { WRITE_SCOPES } from '../constants/writeScopes'

const CATEGORIES = ['all', 'marketing', 'finance', 'logistics', 'support']

function AccessControl({ value, onChange, onRequestWrite }) {
  return (
    <div className="access-control" role="group" aria-label="Access level">
      <button
        className={`access-option${value === 'read' ? ' active' : ''}`}
        onClick={() => onChange?.('read')}
        title="Read access"
        aria-label="Read access"
      >
        Read
      </button>
      <button
        className={`access-option${value === 'write' ? ' active' : ''}`}
        onClick={() => (value === 'write' ? onChange?.('write') : onRequestWrite?.())}
        title="Read and write access"
        aria-label="Read and write access"
      >
        Read &amp; write
      </button>
    </div>
  )
}

function WriteScopeModal({ open, sourceName, scopes, onCancel, onConfirm }) {
  if (!open) return null
  const list = Array.isArray(scopes) && scopes.length > 0 ? scopes : [
    'Perform changes on your behalf',
    'Create, update, or delete objects where supported',
    'Send notifications and messages where supported',
  ]

  return (
    <div className="perm-scope-backdrop" onClick={onCancel} role="dialog" aria-modal="true" aria-label="Grant write access">
      <div className="perm-scope-modal" onClick={(e) => e.stopPropagation()}>
        <div className="perm-scope-header">
          <div>
            <div className="perm-scope-title">Grant write access</div>
            <div className="perm-scope-subtitle">{sourceName}</div>
          </div>
          <button className="perm-scope-close" onClick={onCancel} title="Close" aria-label="Close">
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l12 12M13 1L1 13"/>
            </svg>
          </button>
        </div>

        <div className="perm-scope-body">
          <div className="perm-scope-note">
            With write access enabled, Nexus can execute external actions directly in {sourceName}. You can revert access at any time.
          </div>

          <div className="perm-scope-list-title">This includes:</div>
          <ul className="perm-scope-list">
            {list.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        <div className="perm-scope-actions">
          <button className="perm-scope-btn ghost" onClick={onCancel} title="Cancel" aria-label="Cancel">Cancel</button>
          <button className="perm-scope-btn primary" onClick={onConfirm} title="Grant write access" aria-label="Grant write access">
            Grant write access
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SettingsOverlay({ open, onClose, themeMode, onThemeModeChange, sourceAccess, onSourceAccessChange }) {
  const [activeTab, setActiveTab]   = useState('sources')
  const [activeCat, setActiveCat]   = useState('all')
  const fileInputRef = useRef(null)
  const [writeRequest, setWriteRequest] = useState(null)

  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'customer_export_nov.csv', date: 'Mar 24, 2026', status: 'Success' },
    { name: 'ad_spend_q4.xlsx',        date: 'Mar 22, 2026', status: 'Success' },
  ])

  const displayDate = useMemo(() => {
    return (d) =>
      d.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }, [])

  const filtered = activeCat === 'all'
    ? INTEGRATIONS
    : INTEGRATIONS.filter(i => i.cat === activeCat)

  const connectedSources = useMemo(() => (Array.isArray(INTEGRATIONS) ? INTEGRATIONS : []).filter(i => i?.connected), [])

  const getAccess = (name) => (sourceAccess && typeof sourceAccess === 'object' ? sourceAccess[name] : null) || 'read'

  const setAccess = (name, level) => {
    if (!name) return
    const next = level === 'write' ? 'write' : 'read'
    onSourceAccessChange?.((prev) => ({ ...(prev && typeof prev === 'object' ? prev : {}), [name]: next }))
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const addSelectedFiles = (filesLike) => {
    const files = Array.from(filesLike || [])
    if (files.length === 0) return

    const today = displayDate(new Date())
    setUploadedFiles((prev) => ([
      ...files.map((f) => ({ name: f.name, date: today, status: 'Success' })),
      ...prev,
    ]))
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    addSelectedFiles(e.target.files)
    // allow selecting the same file again
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addSelectedFiles(e.dataTransfer?.files)
  }

  return (
    <div className={`settings-backdrop${open ? ' open' : ''}`} onClick={handleBackdropClick}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="settings-header">
          <span className="settings-title">Settings</span>
          <button className="settings-close" onClick={onClose} title="Close settings" aria-label="Close settings">
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l12 12M13 1L1 13"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="settings-tabs">
          {[
            { id: 'sources',     label: 'Data Sources' },
            { id: 'uploads',     label: 'Uploads'      },
            { id: 'permissions', label: 'Permissions'  },
            { id: 'general',     label: 'General'      },
          ].map(tab => (
            <button
              key={tab.id}
              className={`settings-tab${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              title={tab.label}
              aria-label={tab.label}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="settings-body">

          {/* ── Data Sources ── */}
          {activeTab === 'sources' && (
            <>
              <div className="category-filters">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`cat-filter${activeCat === cat ? ' active' : ''}`}
                    onClick={() => setActiveCat(cat)}
                    title={cat.charAt(0).toUpperCase() + cat.slice(1)}
                    aria-label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
              <div className="integrations-grid">
                {filtered.map(item => (
                  <div key={item.name} className={`integration-cell${item.connected ? ' connected' : ''}`}>
                    {item.connected && <div className="integration-connected-dot" />}
                    <div className="integration-logo">{item.abbr}</div>
                    <div className="integration-name">{item.name}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Uploads ── */}
          {activeTab === 'uploads' && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <div style={{
                border: '1.5px dashed var(--border-medium)', borderRadius: '4px',
                height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', marginBottom: '16px'
              }}
                role="button"
                tabIndex={0}
                onClick={handleBrowseClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleBrowseClick()
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                title="Click to browse"
                aria-label="Upload files"
              >
                Drop files here or click to browse
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr>
                    {['Filename', 'Date', 'Status'].map(h => (
                      <th key={h} style={{
                        textAlign: 'left', padding: '8px 12px',
                        borderBottom: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)', fontSize: '10px',
                        letterSpacing: '0.06em', textTransform: 'uppercase',
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 500
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {uploadedFiles.map((f, idx) => (
                    <tr key={`${f.name}-${f.date}-${idx}`}>
                      <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace" }}>{f.name}</td>
                      <td style={{ padding: '10px 12px', color: 'var(--text-muted)',     fontFamily: "'JetBrains Mono', monospace" }}>{f.date}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ background: 'var(--green-dim)', color: 'var(--green-positive)', padding: '2px 8px', borderRadius: '100px', fontSize: '10px', fontFamily: "'DM Sans', sans-serif" }}>
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {/* ── Permissions ── */}
          {activeTab === 'permissions' && (
            <>
              <div className="perm-intro">
                Choose access per connected source. Read-only lets Nexus analyze. Read &amp; write lets Nexus execute external actions.
              </div>
              <div className="perm-list" role="list" aria-label="Source permissions">
                {connectedSources.map((src) => (
                  <div key={src.name} className="perm-row" role="listitem">
                    <div className="perm-left">
                      <div className="perm-logo" aria-hidden>{src.abbr}</div>
                      <div>
                        <div className="perm-name">{src.name}</div>
                        <div className="perm-desc">
                          {getAccess(src.name) === 'write'
                            ? 'Nexus can read and perform changes on your behalf.'
                            : 'Nexus can read data but cannot perform external changes.'}
                        </div>
                      </div>
                    </div>
                    <AccessControl
                      value={getAccess(src.name)}
                      onChange={(level) => setAccess(src.name, level)}
                      onRequestWrite={() => setWriteRequest({ source: src.name })}
                    />
                  </div>
                ))}
              </div>

              <WriteScopeModal
                open={!!writeRequest}
                sourceName={writeRequest?.source || ''}
                scopes={WRITE_SCOPES[writeRequest?.source] || []}
                onCancel={() => setWriteRequest(null)}
                onConfirm={() => {
                  if (writeRequest?.source) setAccess(writeRequest.source, 'write')
                  setWriteRequest(null)
                }}
              />
            </>
          )}

          {/* ── General ── */}
          {activeTab === 'general' && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 500 }}>Appearance</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[
                    { id: 'dark', label: 'Dark' },
                    { id: 'light', label: 'Light' },
                    { id: 'system', label: 'System' },
                  ].map((theme) => (
                    <button key={theme.id} style={{
                      padding: '8px 16px',
                      background: themeMode === theme.id ? 'var(--bg-base)' : 'var(--bg-elevated)',
                      border: `1px solid ${themeMode === theme.id ? 'var(--accent)' : 'var(--border-subtle)'}`,
                      borderRadius: '4px',
                      color: themeMode === theme.id ? 'var(--accent)' : 'var(--text-muted)',
                      fontSize: '12px'
                    }} onClick={() => onThemeModeChange(theme.id)} title={`Theme: ${theme.label}`} aria-label={`Theme: ${theme.label}`}>{theme.label}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 500 }}>Timezone</div>
                <select style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)', padding: '8px 12px', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", width: '100%', outline: 'none' }}>
                  <option>America/New_York (EST)</option>
                  <option>America/Los_Angeles (PST)</option>
                  <option>America/Chicago (CST)</option>
                  <option>Europe/London (GMT)</option>
                </select>
              </div>
              <div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 500 }}>Language</div>
                <select style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '4px', color: 'var(--text-primary)', padding: '8px 12px', fontSize: '13px', fontFamily: "'DM Sans', sans-serif", width: '100%', outline: 'none' }}>
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
