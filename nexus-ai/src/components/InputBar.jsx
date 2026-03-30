import { useRef, useEffect, useState, useCallback } from 'react'

export default function InputBar({ value, onChange, onSend, disabled = false }) {
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const [attachments, setAttachments] = useState([])

  const addFiles = useCallback((fileList) => {
    if (!fileList?.length) return
    setAttachments((prev) => {
      const next = [...prev]
      for (let i = 0; i < fileList.length; i++) {
        const f = fileList[i]
        next.push({
          key: `${f.name}-${f.size}-${f.lastModified}-${i}-${prev.length + next.length}`,
          name: f.name,
        })
      }
      return next
    })
  }, [])

  const removeAttachment = useCallback((key) => {
    setAttachments((prev) => prev.filter((a) => a.key !== key))
  }, [])

  const canSend = Boolean(value.trim()) || attachments.length > 0

  const handleSend = useCallback(() => {
    if (disabled || !canSend) return
    const names = attachments.map((a) => a.name)
    const ok = onSend?.({ attachmentNames: names })
    if (ok === false) return
    setAttachments([])
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [disabled, canSend, attachments, onSend])

  // Auto-resize textarea as content grows
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }, [value])

  return (
    <div className="input-bar">
      <input
        ref={fileInputRef}
        type="file"
        className="input-file-hidden"
        multiple
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          addFiles(e.target.files)
          e.target.value = ''
        }}
      />
      {attachments.length > 0 ? (
        <div className="input-attachments" role="list" aria-label="Files to send">
          {attachments.map((a) => (
            <div key={a.key} className="input-attachment-chip" role="listitem">
              <span className="input-attachment-name" title={a.name}>
                {a.name}
              </span>
              <button
                type="button"
                className="input-attachment-remove"
                aria-label={`Remove ${a.name}`}
                disabled={disabled}
                onClick={() => removeAttachment(a.key)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <div className="input-wrap">
        <button
          type="button"
          className="input-attach-btn"
          title="Attach files"
          aria-label="Attach files"
          disabled={disabled}
          onClick={() => fileInputRef.current?.click()}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
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
            handleSend()
          }}
        />
        <button
          className="send-btn"
          title="Send message"
          aria-label="Send message"
          onClick={() => handleSend()}
          disabled={disabled || !canSend}
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
