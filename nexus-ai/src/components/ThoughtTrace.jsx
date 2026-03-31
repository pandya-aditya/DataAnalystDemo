import { useId, useMemo, useState, useEffect } from 'react'

const VERB_HINTS = [
  { re: /^Authenticating\b/i, verb: 'Authenticate' },
  { re: /^Fetching\b/i, verb: 'Fetch' },
  { re: /^Querying\b/i, verb: 'Query' },
  { re: /^Loading\b/i, verb: 'Load' },
  { re: /^Pulling\b/i, verb: 'Pull' },
  { re: /^Parsing\b/i, verb: 'Parse' },
  { re: /^Computing\b/i, verb: 'Compute' },
  { re: /^Calculating\b/i, verb: 'Calculate' },
  { re: /^Estimating\b/i, verb: 'Estimate' },
  { re: /^Detecting\b/i, verb: 'Detect' },
  { re: /^Identifying\b/i, verb: 'Identify' },
  { re: /^Cross-referencing\b/i, verb: 'Cross-reference' },
  { re: /^Building\b/i, verb: 'Build' },
  { re: /^Drafting\b/i, verb: 'Draft' },
  { re: /^Setting\b/i, verb: 'Set' },
  { re: /^Summarizing\b/i, verb: 'Summarize' },
  { re: /^Flagging\b/i, verb: 'Flag' },
]

function inferVerb(line) {
  const match = VERB_HINTS.find(v => v.re.test(line))
  return match?.verb ?? 'Process'
}

function inferSource(line) {
  const trimmed = String(line || '').trim()
  const mColon = trimmed.match(/^(?:Authenticating with|Fetching|Querying|Loading|Pulling)\s+([^:]+?)(?:\s*:\s*|\.{3}|,)/i)
  if (mColon?.[1]) return mColon[1].trim()
  const mWith = trimmed.match(/\bwith\s+([^.,]+?)(?:\.{3}|,|$)/i)
  if (mWith?.[1]) return mWith[1].trim()
  const mPrefix = trimmed.match(/^([^:]{2,40}):\s+/)
  if (mPrefix?.[1]) return mPrefix[1].trim()
  return null
}

function inferWindow(line) {
  const trimmed = String(line || '').trim()
  const m = trimmed.match(/\b(last\s+\d+\s*d|\d+\s*d\s+window|\d+\s*-\s*day|\d+\s*day|\d+\s*days)\b/i)
  return m?.[1] ?? null
}

function buildAutoDetail(line) {
  const source = inferSource(line)
  const verb = inferVerb(line)
  const window = inferWindow(line)
  const detail = {
    dataPulled: [],
    analysis: [],
    output: [],
  }

  if (source) detail.dataPulled.push(`Source: ${source}`)
  if (window) detail.dataPulled.push(`Window: ${window}`)

  // Keep these as “method” descriptions (not chain-of-thought).
  detail.analysis.push(`${verb} step derived from the trace label.`)
  detail.analysis.push('Parsed parameters from the step text (source, window, entity) to drive downstream calculations.')

  if (source) {
    detail.output.push(`Structured rows keyed for downstream joins (example: date × ${source} entity).`)
  } else {
    detail.output.push('Structured rows keyed for downstream joins (example: date × entity).')
  }

  // If we have no real signal, keep it short.
  if (!source && !window) {
    detail.dataPulled.push('Inputs: prompt context + connected integrations (if available)')
  }

  return detail
}

function normalizeTraceItem(entry) {
  if (entry && typeof entry === 'object') {
    const summary = String(entry.summary ?? entry.title ?? entry.line ?? '').trim()
    const detail = entry.detail ?? null
    if (!summary) return null
    return { summary, detail: detail ?? buildAutoDetail(summary) }
  }
  const summary = String(entry ?? '').trim()
  if (!summary) return null
  return { summary, detail: buildAutoDetail(summary) }
}

function DetailBlocks({ detail }) {
  if (!detail) return null
  if (typeof detail === 'string') {
    return <div className="trace-detail-text">{detail}</div>
  }

  const dataPulled = Array.isArray(detail.dataPulled) ? detail.dataPulled : []
  const analysis = Array.isArray(detail.analysis) ? detail.analysis : []
  const output = Array.isArray(detail.output) ? detail.output : []

  const Section = ({ title, items }) => (
    items.length ? (
      <div className="trace-detail-section">
        <div className="trace-detail-title">{title}</div>
        <ul className="trace-detail-list">
          {items.map((v, idx) => <li key={idx}>{v}</li>)}
        </ul>
      </div>
    ) : null
  )

  return (
    <div className="trace-detail-grid">
      <Section title="Data Pulled" items={dataPulled} />
      <Section title="Analysis" items={analysis} />
      <Section title="Output" items={output} />
    </div>
  )
}

export default function ThoughtTrace({ lines, collapsing }) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [openIndexSet, setOpenIndexSet] = useState(() => new Set())
  const baseId = useId()

  const items = useMemo(() => (
    (Array.isArray(lines) ? lines : [])
      .map(normalizeTraceItem)
      .filter(Boolean)
  ), [lines])

  useEffect(() => {
    setVisibleCount(0)
    setOpenIndexSet(new Set())
    const timers = items.map((_, i) =>
      setTimeout(() => setVisibleCount(i + 1), i * 280)
    )
    return () => timers.forEach(clearTimeout)
  }, [items])

  const toggleOpen = (idx) => {
    setOpenIndexSet(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  return (
    <div className={`thought-trace${collapsing ? ' collapsing' : ''}`}>
      {items.map((item, i) => {
        const visible = i < visibleCount
        const open = openIndexSet.has(i)
        const complete = i === items.length - 1 && visible
        const panelId = `${baseId}-trace-detail-${i}`

        return (
          <div
            key={i}
            className={`trace-item${visible ? ' visible' : ''}${complete ? ' complete' : ''}${open ? ' open' : ''}`}
          >
            <button
              type="button"
              className="trace-summary"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => toggleOpen(i)}
            >
              <span className="trace-arrow" aria-hidden="true">→</span>
              <span className="trace-summary-text">{item.summary}</span>
              <span className="trace-caret" aria-hidden="true">{open ? '▾' : '▸'}</span>
            </button>

            <div
              id={panelId}
              className="trace-detail"
              role="region"
              aria-label={`Details for step ${i + 1}`}
              aria-hidden={!open}
              hidden={!open}
            >
              {open ? <DetailBlocks detail={item.detail} /> : null}
            </div>
          </div>
        )
      })}
    </div>
  )
}
