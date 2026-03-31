import { useId, useMemo, useState } from 'react'
import ThoughtTrace from './ThoughtTrace'

const DEFAULT_TRACE_LINES = [
  'Identified the decision target and measurable KPIs (lift, efficiency, risk).',
  'Enumerated available data sources (connected integrations + on-screen context).',
  'Validated schema, units, and time alignment (timezone, currency, attribution windows).',
  'Ran robust data quality checks (missingness, MAD/robust z-score outliers, leakage flags).',
  'Estimated effects with uncertainty (bootstrap CIs + Bayesian shrinkage for sparse segments).',
  'Controlled multiple comparisons across metrics (Benjamini–Hochberg FDR).',
  'Performed causal sanity checks (pre-trends + difference-in-differences where applicable).',
  'Translated results into a decision with thresholds (effect size + uncertainty + constraints).',
]

function BrainIcon({ className }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M9.2 4.4c-2.4 0-4.4 2-4.4 4.4 0 .6.1 1.2.4 1.8C4 11.3 3.3 12.6 3.3 14c0 2.4 2 4.4 4.4 4.4h.6c.6 1.2 1.8 2 3.3 2h2.1c2.4 0 4.4-2 4.4-4.4 0-.2 0-.4-.1-.6.2 0 .4.1.6.1 2.4 0 4.4-2 4.4-4.4 0-1.8-1.1-3.4-2.7-4.1.1-.3.1-.7.1-1 0-2.4-2-4.4-4.4-4.4-1 0-2 .4-2.7 1-1-1.6-2.7-2.7-4.7-2.7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 8.2v9.3M12 7.5v12M15 8.2v9.3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  )
}

export default function BrainDisclosure({ traceLines }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  const lines = useMemo(() => (
    Array.isArray(traceLines) && traceLines.length ? traceLines : DEFAULT_TRACE_LINES
  ), [traceLines])

  return (
    <div className="brain-disclosure">
      <button
        type="button"
        className="brain-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(v => !v)}
        title={open ? 'Hide methodology' : 'Show methodology'}
      >
        <BrainIcon className="brain-icon" />
        Show Thoughts
        <span className="brain-toggle-caret" aria-hidden="true">{open ? '▾' : '▸'}</span>
      </button>

      <div
        id={panelId}
        className={`brain-panel${open ? ' open' : ''}`}
        role="region"
        aria-label="Methodology panel"
      >
        {open ? (
          <>
            <ThoughtTrace lines={lines} collapsing={false} />
          </>
        ) : null}
      </div>
    </div>
  )
}

