import { useEffect, useMemo, useState } from 'react'
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

function generateKpiOverview() {
  const companyName = 'D2C Apparel Co.'
  const now = new Date()
  const periodLabel = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })

  // KPI 1: Revenue (MTD)
  const revenue = randInt(65_000, 210_000)
  const revenueDelta = randFloat(-0.12, 0.18) // +/- 12% / 18%
  const revenueChange = revenueDelta >= 0 ? `▲ ${formatMoney(Math.round(revenue * revenueDelta))} vs. last period` : `▼ ${formatMoney(Math.round(revenue * Math.abs(revenueDelta)))} vs. last period`
  const revenueStatus = pickStatusFromDelta({ delta: revenueDelta, goodWhenHigher: true, smallThreshold: 0.03 })
  const revenueClass = revenueDelta >= 0 ? 'up' : 'down'

  // KPI 2: Active Customers (MoM)
  const customers = randInt(8_500, 29_500)
  const customerDelta = randFloat(-0.18, 0.22)
  const customerChange = customerDelta >= 0 ? `▲ ${formatNumber(Math.round(customers * customerDelta))} vs. last period` : `▼ ${formatNumber(Math.round(customers * Math.abs(customerDelta)))} vs. last period`
  const customerStatus = pickStatusFromDelta({ delta: customerDelta, goodWhenHigher: true, smallThreshold: 0.035 })
  const customerClass = customerDelta >= 0 ? 'up' : 'down'

  // KPI 3: Conversion Rate
  const conversionBase = randFloat(1.2, 4.9) // %
  const conversionDelta = randFloat(-0.45, 0.65) // percentage points
  const conversion = Math.max(0.4, conversionBase + conversionDelta)
  const conversionChange = conversionDelta >= 0 ? `▲ ${formatPercent(conversionDelta)} pts vs. last period` : `▼ ${formatPercent(Math.abs(conversionDelta))} pts vs. last period`
  const conversionStatus = pickStatusFromDelta({ delta: conversionDelta, goodWhenHigher: true, smallThreshold: 0.12 })
  const conversionClass = conversionDelta >= 0 ? 'up' : 'down'

  // KPI 4: Churn Rate (lower is better)
  const churnBase = randFloat(1.0, 4.5)
  const churnDelta = randFloat(-0.7, 0.9) // percentage points, negative is improvement
  const churn = Math.max(0.4, churnBase + churnDelta)
  const churnImproves = churnDelta < 0
  const churnChange = churnDelta === 0
    ? '▲ 0.00% pts vs. last period'
    : churnImproves
      ? `▼ ${formatPercent(Math.abs(churnDelta))} pts vs. last period`
      : `▲ ${formatPercent(Math.abs(churnDelta))} pts vs. last period`
  const churnStatus = pickStatusFromDelta({ delta: churnDelta, goodWhenHigher: false, smallThreshold: 0.13 })
  const churnClass = churnDelta < 0 ? 'up' : 'down'

  const worstStatusOrder = { red: 0, amber: 1, green: 2 }
  const kpiList = [
    { label: 'Revenue (MTD)', status: revenueStatus, value: formatMoney(revenue), change: revenueChange, changeClass: revenueClass },
    { label: 'Active Customers', status: customerStatus, value: formatNumber(customers), change: customerChange, changeClass: customerClass },
    { label: 'Conversion Rate', status: conversionStatus, value: formatPercent(conversion), change: conversionChange, changeClass: conversionClass },
    { label: 'Churn Rate', status: churnStatus, value: formatPercent(churn), change: churnChange, changeClass: churnClass },
  ]

  const worst = [...kpiList].sort((a, b) => worstStatusOrder[a.status] - worstStatusOrder[b.status])[0]
  const insight = worst.status === 'red'
    ? `Primary risk: ${worst.label} is underperforming. I can draft an action plan once you click “Approve”.`
    : worst.status === 'amber'
      ? `Momentum looks steady. ${worst.label} has small variance—worth reviewing thresholds and recent campaign changes.`
      : `Great run. All key signals are trending positive—I'll generate a follow-up optimization checklist.`

  return { companyName, periodLabel, kpis: kpiList, insight }
}

export default function KpiOverviewWidget() {
  const [open, setOpen] = useState(false)
  const [overview] = useState(() => generateKpiOverview())
  
  const openAndRefresh = () => setOpen(true)

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  // Memoize so the UI doesn't re-render while the overlay is open
  const kpiCards = useMemo(() => overview.kpis, [overview.kpis])

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

            <div className="response-section-title" style={{ marginTop: 14 }}>Key Metrics</div>
            <div className="kpi-strip">
              {kpiCards.map((kpi) => (
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

            <div className="insight-callout" style={{ marginTop: 18 }}>
              {overview.insight}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

