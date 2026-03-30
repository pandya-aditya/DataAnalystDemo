import { useEffect, useMemo, useRef, useState } from 'react'
import KpiBubble from './KpiBubble'

function formatNumber(n) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

function formatMoney(n) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD' })
}

function formatPercent(n) {
  const fixed = Math.abs(n) < 10 ? 2 : 1
  return `${n.toFixed(fixed)}%`
}

function formatPercentPoints(n) {
  const fixed = Math.abs(n) < 10 ? 2 : 1
  return `${n.toFixed(fixed)}% pts`
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randFloat(min, max) {
  return Math.random() * (max - min) + min
}

function pickStatusFromDelta({ delta, goodWhenHigher, smallThreshold }) {
  const good = goodWhenHigher ? delta > 0 : delta < 0
  const magnitude = Math.abs(delta)
  if (magnitude < smallThreshold) return 'amber'
  return good ? 'green' : 'red'
}

function pickChangeClassFromDelta({ delta, goodWhenHigher }) {
  const good = goodWhenHigher ? delta > 0 : delta < 0
  if (Math.abs(delta) < 0.06 && goodWhenHigher) return 'amber'
  if (Math.abs(delta) < 0.06 && !goodWhenHigher) return 'amber'
  return good ? 'up' : 'down'
}

const TRACKED_KPI_CATALOG = [
  { id: 'revenue_mtd', label: 'Revenue (MTD)' },
  { id: 'active_customers', label: 'Active Customers' },
  { id: 'conversion_rate', label: 'Conversion Rate' },
  { id: 'aov', label: 'Avg Order Value' },
  { id: 'repeat_purchase_rate', label: 'Repeat Purchase Rate' },
  { id: 'cac', label: 'Customer Acquisition Cost' },
  { id: 'nps', label: 'Net Promoter Score' },
]

const AGENT_KPI_ID = 'churn_rate'

function readTrackedKpisFromStorage() {
  try {
    const raw = window.localStorage.getItem('kpiOverview:trackedIds')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    const allowed = new Set(TRACKED_KPI_CATALOG.map((k) => k.id))
    const unique = [...new Set(parsed)].filter((id) => allowed.has(id))
    return unique.length === 3 ? unique : null
  } catch {
    return null
  }
}

function writeTrackedKpisToStorage(trackedIds) {
  try {
    window.localStorage.setItem('kpiOverview:trackedIds', JSON.stringify(trackedIds))
  } catch {
    // ignore
  }
}

function generateKpiOverview() {
  const companyName = 'D2C Apparel Co.'
  const now = new Date()
  const periodLabel = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })

  const kpisById = {}

  // Revenue (MTD)
  const revenue = randInt(65_000, 210_000)
  const revenueDelta = randFloat(-0.12, 0.18)
  kpisById.revenue_mtd = {
    id: 'revenue_mtd',
    label: 'Revenue (MTD)',
    status: pickStatusFromDelta({ delta: revenueDelta, goodWhenHigher: true, smallThreshold: 0.03 }),
    value: formatMoney(revenue),
    change: revenueDelta >= 0 ? `▲ ${formatMoney(Math.round(revenue * revenueDelta))} vs. last period` : `▼ ${formatMoney(Math.round(revenue * Math.abs(revenueDelta)))} vs. last period`,
    changeClass: revenueDelta >= 0 ? 'up' : 'down',
  }

  // Active Customers (MoM)
  const customers = randInt(8_500, 29_500)
  const customerDelta = randFloat(-0.18, 0.22)
  kpisById.active_customers = {
    id: 'active_customers',
    label: 'Active Customers',
    status: pickStatusFromDelta({ delta: customerDelta, goodWhenHigher: true, smallThreshold: 0.035 }),
    value: formatNumber(customers),
    change: customerDelta >= 0 ? `▲ ${formatNumber(Math.round(customers * customerDelta))} vs. last period` : `▼ ${formatNumber(Math.round(customers * Math.abs(customerDelta)))} vs. last period`,
    changeClass: customerDelta >= 0 ? 'up' : 'down',
  }

  // Conversion Rate
  const conversionBase = randFloat(1.2, 4.9)
  const conversionDelta = randFloat(-0.45, 0.65) // percentage points
  const conversion = Math.max(0.4, conversionBase + conversionDelta)
  kpisById.conversion_rate = {
    id: 'conversion_rate',
    label: 'Conversion Rate',
    status: pickStatusFromDelta({ delta: conversionDelta, goodWhenHigher: true, smallThreshold: 0.12 }),
    value: formatPercent(conversion),
    change: conversionDelta >= 0 ? `▲ ${formatPercentPoints(conversionDelta)} vs. last period` : `▼ ${formatPercentPoints(Math.abs(conversionDelta))} vs. last period`,
    changeClass: conversionDelta >= 0 ? 'up' : 'down',
  }

  // Avg Order Value
  const aov = randInt(52, 142)
  const aovDelta = randFloat(-0.09, 0.11)
  kpisById.aov = {
    id: 'aov',
    label: 'Avg Order Value',
    status: pickStatusFromDelta({ delta: aovDelta, goodWhenHigher: true, smallThreshold: 0.02 }),
    value: formatMoney(aov),
    change: aovDelta >= 0 ? `▲ ${formatMoney(Math.round(aov * aovDelta))} vs. last period` : `▼ ${formatMoney(Math.round(aov * Math.abs(aovDelta)))} vs. last period`,
    changeClass: pickChangeClassFromDelta({ delta: aovDelta, goodWhenHigher: true }),
  }

  // Repeat Purchase Rate
  const repeatBase = randFloat(14.5, 33.0)
  const repeatDelta = randFloat(-1.6, 2.4) // percentage points
  const repeatRate = Math.max(6, repeatBase + repeatDelta)
  kpisById.repeat_purchase_rate = {
    id: 'repeat_purchase_rate',
    label: 'Repeat Purchase Rate',
    status: pickStatusFromDelta({ delta: repeatDelta, goodWhenHigher: true, smallThreshold: 0.55 }),
    value: formatPercent(repeatRate),
    change: repeatDelta >= 0 ? `▲ ${formatPercentPoints(repeatDelta)} vs. last period` : `▼ ${formatPercentPoints(Math.abs(repeatDelta))} vs. last period`,
    changeClass: pickChangeClassFromDelta({ delta: repeatDelta, goodWhenHigher: true }),
  }

  // CAC (lower is better)
  const cac = randInt(18, 62)
  const cacDelta = randFloat(-0.14, 0.18)
  const cacImproves = cacDelta < 0
  kpisById.cac = {
    id: 'cac',
    label: 'Customer Acquisition Cost',
    status: pickStatusFromDelta({ delta: cacDelta, goodWhenHigher: false, smallThreshold: 0.03 }),
    value: formatMoney(cac),
    change: cacDelta === 0
      ? `▲ ${formatMoney(0)} vs. last period`
      : cacImproves
        ? `▼ ${formatMoney(Math.round(cac * Math.abs(cacDelta)))} vs. last period`
        : `▲ ${formatMoney(Math.round(cac * Math.abs(cacDelta)))} vs. last period`,
    changeClass: pickChangeClassFromDelta({ delta: cacDelta, goodWhenHigher: false }),
  }

  // NPS
  const nps = randInt(26, 74)
  const npsDelta = randFloat(-6, 8)
  kpisById.nps = {
    id: 'nps',
    label: 'Net Promoter Score',
    status: pickStatusFromDelta({ delta: npsDelta, goodWhenHigher: true, smallThreshold: 1.9 }),
    value: `${nps}`,
    change: npsDelta >= 0 ? `▲ ${Math.round(npsDelta)} pts vs. last period` : `▼ ${Math.round(Math.abs(npsDelta))} pts vs. last period`,
    changeClass: pickChangeClassFromDelta({ delta: npsDelta, goodWhenHigher: true }),
  }

  // Agent Focus KPI (constant for demo): Churn Rate (lower is better)
  const churnBase = randFloat(1.0, 4.5)
  const churnDelta = randFloat(-0.7, 0.9) // percentage points, negative is improvement
  const churn = Math.max(0.4, churnBase + churnDelta)
  const churnImproves = churnDelta < 0
  kpisById.churn_rate = {
    id: 'churn_rate',
    label: 'Churn Rate',
    status: pickStatusFromDelta({ delta: churnDelta, goodWhenHigher: false, smallThreshold: 0.13 }),
    value: formatPercent(churn),
    change: churnDelta === 0
      ? '▲ 0.00% pts vs. last period'
      : churnImproves
        ? `▼ ${formatPercentPoints(Math.abs(churnDelta))} vs. last period`
        : `▲ ${formatPercentPoints(Math.abs(churnDelta))} vs. last period`,
    changeClass: churnDelta < 0 ? 'up' : 'down',
  }

  const agentKpi = kpisById[AGENT_KPI_ID]
  const insight = agentKpi.status === 'red'
    ? `Agent focus: ${agentKpi.label}. This week's pattern suggests elevated risk—I'd prioritize retention outreach + cancellation reason analysis.`
    : agentKpi.status === 'amber'
      ? `Agent focus: ${agentKpi.label}. Early signals are mixed—worth monitoring cohort-level churn and recent CX tickets.`
      : `Agent focus: ${agentKpi.label}. Looks healthy—I'll propose optimizations to keep churn flat while scaling acquisition.`

  return { companyName, periodLabel, kpisById, agentKpiId: AGENT_KPI_ID, insight }
}

export default function KpiOverviewWidget() {
  const [open, setOpen] = useState(false)
  const [overview] = useState(() => generateKpiOverview())
  const [swapOpen, setSwapOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [trackedIds, setTrackedIds] = useState(() => {
    const saved = readTrackedKpisFromStorage()
    return saved ?? ['revenue_mtd', 'active_customers', 'conversion_rate']
  })
  const dropdownEls = useRef([])
  
  const openAndRefresh = () => {
    setSwapOpen(false)
    setOpenDropdown(null)
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  useEffect(() => {
    if (!open) {
      setSwapOpen(false)
      setOpenDropdown(null)
    }
  }, [open])

  useEffect(() => {
    if (openDropdown === null) return
    const handler = (e) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null)
        return
      }
      const root = dropdownEls.current[openDropdown]
      if (!root) return
      if (e.target instanceof Node && !root.contains(e.target)) setOpenDropdown(null)
    }
    window.addEventListener('mousedown', handler)
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('mousedown', handler)
      window.removeEventListener('keydown', handler)
    }
  }, [openDropdown])

  useEffect(() => {
    writeTrackedKpisToStorage(trackedIds)
  }, [trackedIds])

  const trackedCatalog = useMemo(() => TRACKED_KPI_CATALOG, [])

  const trackedKpis = useMemo(
    () => trackedIds.map((id) => overview.kpisById[id]).filter(Boolean),
    [overview.kpisById, trackedIds],
  )
  const agentKpi = useMemo(
    () => overview.kpisById[overview.agentKpiId],
    [overview.agentKpiId, overview.kpisById],
  )

  const setTrackedIdAt = (index, nextId) => {
    setTrackedIds((prev) => {
      const next = [...prev]
      const existingIndex = next.indexOf(nextId)
      if (existingIndex === -1) {
        next[index] = nextId
        return next
      }
      // keep 3 unique by swapping positions
      next[existingIndex] = next[index]
      next[index] = nextId
      return next
    })
  }

  return (
    <>
      <KpiBubble onClick={openAndRefresh} />

      <div
        className={`kpi-overview-backdrop${open ? ' open' : ''}`}
        onClick={() => setOpen(false)}
        role="dialog"
        aria-modal="true"
        aria-label="Company KPI Overview"
      >
        <div className="kpi-overview-panel" onClick={(e) => e.stopPropagation()}>
          <div className="kpi-overview-header">
            <div className="kpi-overview-title">
              <span className="kpi-overview-title-dot" />
              KPI Overview
            </div>
            <button
              className="kpi-overview-close"
              onClick={() => setOpen(false)}
              aria-label="Close KPI overview"
              title="Close KPI overview"
            >
              ✕
            </button>
          </div>

          <div className="kpi-overview-body">
            <div className="kpi-overview-meta">
              {overview.companyName} · {overview.periodLabel}
            </div>

            <div className="kpi-section-row" style={{ marginTop: 14 }}>
              <div className="response-section-title" style={{ marginTop: 0, marginBottom: 0 }}>Tracked KPIs</div>
              <button
                type="button"
                className="kpi-swap-open-btn"
                onClick={() => {
                  setSwapOpen((v) => !v)
                  setOpenDropdown(null)
                }}
                aria-expanded={swapOpen ? 'true' : 'false'}
                aria-label="Swap tracked KPIs"
              >
                Swap KPIs
              </button>
            </div>

            {swapOpen ? (
              <div className="kpi-swap-inline" aria-label="Swap tracked KPIs panel">
                <div className="kpi-swap-subtitle">Swap the 3 tracked metrics. Agent focus stays constant.</div>

                <div className="kpi-swap-grid">
                  {trackedIds.map((id, idx) => {
                    const currentLabel = trackedCatalog.find((k) => k.id === id)?.label ?? id
                    const isOpen = openDropdown === idx
                    return (
                      <div
                        key={`${idx}-${id}`}
                        className="kpi-dd"
                        ref={(el) => { dropdownEls.current[idx] = el }}
                      >
                        <div className="kpi-swap-label">Slot {idx + 1}</div>
                        <button
                          type="button"
                          className="kpi-dd-trigger"
                          onClick={() => setOpenDropdown((v) => (v === idx ? null : idx))}
                          aria-haspopup="listbox"
                          aria-expanded={isOpen ? 'true' : 'false'}
                          aria-label={`Tracked KPI slot ${idx + 1}`}
                        >
                          <span className="kpi-dd-trigger-text">{currentLabel}</span>
                          <span className={`kpi-dd-chevron${isOpen ? ' open' : ''}`}>▾</span>
                        </button>

                        {isOpen ? (
                          <div className="kpi-dd-menu" role="listbox" aria-label={`Tracked KPI slot ${idx + 1} options`}>
                            {trackedCatalog.map((k) => (
                              <button
                                key={k.id}
                                type="button"
                                className={`kpi-dd-option${k.id === id ? ' selected' : ''}`}
                                role="option"
                                aria-selected={k.id === id ? 'true' : 'false'}
                                onClick={() => {
                                  setTrackedIdAt(idx, k.id)
                                  setOpenDropdown(null)
                                }}
                              >
                                {k.label}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    )
                  })}
                </div>

                <div className="kpi-swap-agent">
                  <div className="kpi-swap-agent-pill">Agent focus</div>
                  <div className="kpi-swap-agent-name">{agentKpi?.label ?? '—'}</div>
                </div>
              </div>
            ) : null}

            <div className="kpi-strip kpi-strip-3">
              {trackedKpis.map((kpi) => (
                <div key={kpi.label} className="kpi-card">
                  <div className="kpi-label">
                    {kpi.label}
                    <span className={`kpi-status ${kpi.status}`} style={{ float: 'right', marginTop: '3px' }} />
                  </div>
                  <div className="kpi-value">{kpi.value}</div>
                  <div className={`kpi-change ${kpi.changeClass}`}>{kpi.change}</div>
                </div>
              ))}
            </div>

            <div className="response-section-title" style={{ marginTop: 14 }}>Agent Focus (This Week)</div>
            {agentKpi ? (
              <div className="kpi-strip kpi-strip-1">
                <div className="kpi-card kpi-card-agent">
                  <div className="kpi-label kpi-label-row">
                    <span>{agentKpi.label}</span>
                    <span className="kpi-agent-pill">Agent</span>
                    <span className={`kpi-status ${agentKpi.status}`} />
                  </div>
                  <div className="kpi-value">{agentKpi.value}</div>
                  <div className={`kpi-change ${agentKpi.changeClass}`}>{agentKpi.change}</div>
                  <div className="kpi-agent-reason">Constant for demo: the agent “determines” this KPI is most important given this week’s data.</div>
                </div>
              </div>
            ) : null}

            <div className="insight-callout" style={{ marginTop: 18 }}>
              {overview.insight}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
