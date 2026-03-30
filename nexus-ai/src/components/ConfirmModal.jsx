export default function ConfirmModal({
  open,
  title,
  subtitle,
  note,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onCancel,
  onConfirm,
  confirmVariant = 'danger',
  ariaLabel,
}) {
  if (!open) return null

  const label = ariaLabel || title || 'Confirm action'
  const confirmClass =
    confirmVariant === 'primary'
      ? 'primary'
      : confirmVariant === 'danger'
        ? 'danger'
        : 'primary'

  return (
    <div className="perm-scope-backdrop" onClick={onCancel} role="dialog" aria-modal="true" aria-label={label}>
      <div className="perm-scope-modal" onClick={(e) => e.stopPropagation()}>
        <div className="perm-scope-header">
          <div>
            <div className="perm-scope-title">{title}</div>
            {subtitle ? <div className="perm-scope-subtitle">{subtitle}</div> : null}
          </div>
          <button className="perm-scope-close" onClick={onCancel} title="Close" aria-label="Close">
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 1l12 12M13 1L1 13"/>
            </svg>
          </button>
        </div>

        <div className="perm-scope-body">
          {note ? <div className="perm-scope-note">{note}</div> : null}
        </div>

        <div className="perm-scope-actions">
          <button className="perm-scope-btn ghost" onClick={onCancel} title={cancelLabel} aria-label={cancelLabel}>
            {cancelLabel}
          </button>
          <button
            className={`perm-scope-btn ${confirmClass}`}
            onClick={onConfirm}
            title={confirmLabel}
            aria-label={confirmLabel}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

