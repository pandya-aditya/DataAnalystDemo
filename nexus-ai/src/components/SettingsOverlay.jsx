import { useMemo, useRef, useState } from 'react'
import { INTEGRATIONS } from '../constants/data'

const CATEGORIES = ['all', 'marketing', 'finance', 'logistics', 'support']

const PERMISSIONS = [
  { label: 'Weekly Email Summaries',      desc: 'Agent sends a performance digest every Monday at 9 AM',                      defaultOn: true  },
  { label: 'Slack Low Stock Alerts',      desc: 'Flag inventory below reorder point in #ops-alerts',                          defaultOn: true  },
  { label: 'Draft Shopify Discount Codes',desc: 'Agent can generate codes but requires approval before publishing',            defaultOn: true  },
  { label: 'Auto-pause Underperforming Ads', desc: 'Pause ad sets with CPR > threshold without manual review',                 defaultOn: false },
  { label: 'Gorgias Macro Deployment',    desc: 'Allow agent to deploy support macros automatically',                          defaultOn: false },
]

function Toggle({ defaultOn, title }) {
  const [on, setOn] = useState(defaultOn)
  return (
    <button
      className={`toggle${on ? ' on' : ''}`}
      onClick={() => setOn(v => !v)}
      title={title}
      aria-label={title}
    />
  )
}

export default function SettingsOverlay({ open, onClose, themeMode, onThemeModeChange }) {
  const [activeTab, setActiveTab]   = useState('sources')
  const [activeCat, setActiveCat]   = useState('all')
  const fileInputRef = useRef(null)

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
              {PERMISSIONS.map(p => (
                <div key={p.label} className="toggle-row">
                  <div>
                    <div className="toggle-label">{p.label}</div>
                    <div className="toggle-desc">{p.desc}</div>
                  </div>
                  <Toggle defaultOn={p.defaultOn} title={p.label} />
                </div>
              ))}
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
