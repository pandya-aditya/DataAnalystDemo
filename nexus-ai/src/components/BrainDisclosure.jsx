import { useId, useMemo, useState } from 'react'
import ThoughtTrace from './ThoughtTrace'

const DEFAULT_TRACE_ITEMS = [
  {
    summary: 'Identified the decision target and measurable KPIs (lift, efficiency, risk).',
    detail: {
      dataPulled: [
        'User prompt + selected scenario context',
        'Role + constraints (budget, inventory, approval requirements)',
      ],
      analysis: [
        'Mapped the request into a decision + success metric(s)',
        'Defined primary KPI + guardrails (e.g., ROAS, CAC, margin, risk)',
      ],
      output: [
        'A KPI set used to select sources and structure calculations',
      ],
    },
  },
  {
    summary: 'Enumerated available data sources (connected integrations + on-screen context).',
    detail: {
      dataPulled: [
        'Connected integrations list (e.g., Ads, Shopify, GA4, Stripe)',
        'On-screen widgets and any user-provided attachments',
      ],
      analysis: [
        'Selected sources that can answer each sub-question',
        'Flagged missing sources and suggested alternates (if needed)',
      ],
      output: [
        'A source plan: what to pull from where and why',
      ],
    },
  },
  {
    summary: 'Validated schema, units, and time alignment (timezone, currency, attribution windows).',
    detail: {
      dataPulled: [
        'Field schemas (dates, currencies, channel identifiers)',
        'Account-level settings (timezone, currency, attribution windows)',
      ],
      analysis: [
        'Aligned to a single reporting grain (e.g., day × channel)',
        'Converted units (currency, time) and resolved naming mismatches',
      ],
      output: [
        'A normalized, comparable dataset ready for analysis',
      ],
    },
  },
  {
    summary: 'Ran robust data quality checks (missingness, MAD/robust z-score outliers, leakage flags).',
    detail: {
      dataPulled: [
        'Raw extracts for the requested date window',
        'Historical baselines for anomaly comparison (when available)',
      ],
      analysis: [
        'Checked for missing days, duplicated rows, and zero-spend/zero-sales traps',
        'Flagged outliers and potential attribution leakage / double-counting',
      ],
      output: [
        'Quality flags + cleaned inputs used downstream',
      ],
    },
  },
  {
    summary: 'Estimated effects with uncertainty (bootstrap CIs + Bayesian shrinkage for sparse segments).',
    detail: {
      dataPulled: [
        'Segmented metrics (by channel, campaign, SKU, cohort)',
      ],
      analysis: [
        'Computed point estimates and uncertainty bounds',
        'Applied shrinkage where segments are noisy/sparse',
      ],
      output: [
        'Effect sizes with confidence bounds for decisioning',
      ],
    },
  },
  {
    summary: 'Controlled multiple comparisons across metrics (Benjamini–Hochberg FDR).',
    detail: {
      dataPulled: [
        'Candidate metric list (primary + secondary + segment cuts)',
      ],
      analysis: [
        'Adjusted significance to reduce false discoveries across many tests',
      ],
      output: [
        'A short list of findings that remain meaningful after adjustment',
      ],
    },
  },
  {
    summary: 'Performed causal sanity checks (pre-trends + difference-in-differences where applicable).',
    detail: {
      dataPulled: [
        'Pre-period baselines and comparable control segments (if present)',
      ],
      analysis: [
        'Checked for pre-trend violations',
        'Used simple quasi-experimental checks when assumptions were reasonable',
      ],
      output: [
        'Confidence notes on whether “lift” claims are directionally reliable',
      ],
    },
  },
  {
    summary: 'Translated results into a decision with thresholds (effect size + uncertainty + constraints).',
    detail: {
      dataPulled: [
        'Business constraints (budget caps, stock risk, compliance, approvals)',
      ],
      analysis: [
        'Applied thresholds and trade-offs (impact vs risk vs effort)',
        'Converted findings into an action plan and “what to watch” list',
      ],
      output: [
        'A decision + next actions + monitoring plan',
      ],
    },
  },
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
    Array.isArray(traceLines) && traceLines.length ? traceLines : DEFAULT_TRACE_ITEMS
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
