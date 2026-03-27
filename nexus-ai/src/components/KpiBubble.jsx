export default function KpiBubble({ onClick }) {
  return (
    <button
      type="button"
      className="kpi-bubble-btn"
      onClick={onClick}
      data-tooltip="KPI overview"
      aria-label="KPI overview"
      title="KPI overview"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 19V5" />
        <path d="M4 19H20" />
        <path d="M8 15V9" />
        <path d="M12 15V7" />
        <path d="M16 15V11" />
      </svg>
    </button>
  )
}

