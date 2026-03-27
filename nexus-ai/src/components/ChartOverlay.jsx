export default function ChartOverlay({ open, onClose }) {
  return (
    <div className={`chart-overlay${open ? ' open' : ''}`} onClick={onClose}>
      <div className="chart-overlay-inner" onClick={e => e.stopPropagation()}>
        <canvas id="overlayChart" width="640" height="320" aria-hidden="true" />
      </div>
      <button type="button" className="chart-overlay-close" onClick={onClose} title="Close chart overlay" aria-label="Close chart overlay">
        ✕
      </button>
    </div>
  )
}
