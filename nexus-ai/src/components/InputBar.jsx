import { useRef, useEffect } from 'react'

export default function InputBar({ value, onChange, onSend, disabled = false }) {
  const textareaRef = useRef(null)

  // Auto-resize textarea as content grows
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [value])

  return (
    <div className="input-bar">
      <div className="input-wrap">
        <textarea
          ref={textareaRef}
          className="input-field"
          placeholder="Ask anything about your business..."
          rows={1}
          value={value}
          disabled={disabled}
          onChange={e => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (disabled) return
            if (e.key !== 'Enter') return
            if (e.shiftKey) return
            e.preventDefault()
            onSend?.()
          }}
        />
        <button
          className="send-btn"
          title="Send message"
          aria-label="Send message"
          onClick={() => !disabled && onSend?.()}
          disabled={disabled || !value.trim()}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 10h12M10 4l6 6-6 6"/>
          </svg>
        </button>
      </div>
      <div className="input-meta">
        <span className="sync-dot" />
        Connected to 12 data sources &nbsp;·&nbsp; Last synced 4m ago
      </div>
    </div>
  )
}
