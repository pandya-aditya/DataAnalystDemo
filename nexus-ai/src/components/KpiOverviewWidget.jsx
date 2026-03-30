import { useEffect, useMemo, useRef, useState } from 'react'
import { getRoleCategory } from '../constants/roleSessions'
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
  if (Math.abs(delta) < 0.06) return 'amber'
  const good = goodWhenHigher ? delta > 0 : delta < 0
  return good ? 'up' : 'down'
}

// ─── KPI Catalog ──────────────────────────────────────────────────────────────

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

// ─── Preset prompt scenarios ──────────────────────────────────────────────────
// Each entry has:
//   prompt          – text that auto-types itself into the bar
//   trackedIds      – the 3 KPI IDs to display after the scenario fires
//   kpiOverrides    – static display values per KPI id (valueFn / changeFn are thunks for consistency)
//   agentOverride   – partial override for the agent KPI display
//   insightOverride – override for the insight callout

const PROMPT_SCENARIOS = [
  {
    prompt: 'Show me what happens if we boost paid acquisition spend by 30% next month',
    trackedIds: ['revenue_mtd', 'active_customers', 'conversion_rate'],
    kpiOverrides: {
      revenue_mtd: {
        valueFn: () => '$198,400',
        changeFn: () => '▲ $24,050 vs. last period',
        changeClass: 'up',
        status: 'green',
      },
      active_customers: {
        valueFn: () => '26,180',
        changeFn: () => '▲ 3,420 vs. last period',
        changeClass: 'up',
        status: 'green',
      },
      conversion_rate: {
        valueFn: () => '3.81%',
        changeFn: () => '▲ 0.44% pts vs. last period',
        changeClass: 'up',
        status: 'green',
      },
    },
    agentOverride: {
      value: '1.9%',
      change: '▼ 0.28% pts vs. last period',
      changeClass: 'up',
      status: 'green',
    },
    insightOverride:
      'Agent focus: Churn Rate. Acquisition surge looks strong — but watch for quality dilution. Higher volume at lower intent could creep churn upward in 60 days. Monitor cohort churn weekly.',
  },
  {
    prompt: "We're seeing high cart abandonment — what's the impact on our KPIs?",
    trackedIds: ['revenue_mtd', 'conversion_rate', 'aov'],
    kpiOverrides: {
      revenue_mtd: {
        valueFn: () => '$74,200',
        changeFn: () => '▼ $11,300 vs. last period',
        changeClass: 'down',
        status: 'red',
      },
      conversion_rate: {
        valueFn: () => '1.47%',
        changeFn: () => '▼ 0.91% pts vs. last period',
        changeClass: 'down',
        status: 'red',
      },
      aov: {
        valueFn: () => '$61',
        changeFn: () => '▼ $7 vs. last period',
        changeClass: 'down',
        status: 'amber',
      },
    },
    agentOverride: {
      value: '4.1%',
      change: '▲ 0.72% pts vs. last period',
      changeClass: 'down',
      status: 'red',
    },
    insightOverride:
      'Agent focus: Churn Rate. Cart abandonment is compressing conversion and signalling intent drop-off. Churn risk is elevated — prioritize a recovery flow and review checkout UX immediately.',
  },
]

// ─── Department KPIs by role category (not affected by prompt scenarios) ─────

const DEPT_KPIS_BY_CATEGORY = {
  product: [
    { dept: 'Product', label: 'Feature adoption (30d)', value: '34.2%', change: '▲ 2.1% pts MoM', accentColor: '#7F77DD' },
    { dept: 'Research', label: 'Study completion rate', value: '68%', change: '▲ 4% pts MoM', accentColor: '#E85D75' },
    { dept: 'Design', label: 'Design review SLA hit', value: '92%', change: '▼ 1% pts MoM', accentColor: '#378ADD' },
  ],
  engineering: [
    { dept: 'Engineering', label: 'Deploy frequency (weekly)', value: '18', change: '▲ 3 vs. last month', accentColor: '#7F77DD' },
    { dept: 'QA', label: 'Regression pass rate', value: '97.4%', change: '▲ 0.5% pts MoM', accentColor: '#1D9E75' },
    { dept: 'DevOps', label: 'Core uptime', value: '99.94%', change: '▼ 0.02% pts MoM', accentColor: '#378ADD' },
  ],
  data: [
    { dept: 'Analytics', label: 'Trusted dashboard coverage', value: '86%', change: '▲ 5% pts MoM', accentColor: '#7F77DD' },
    { dept: 'Data Eng', label: 'Pipeline success rate', value: '99.1%', change: '▲ 0.2% pts MoM', accentColor: '#1D9E75' },
    { dept: 'BI', label: 'Active report consumers', value: '142', change: '▲ 11 MoM', accentColor: '#378ADD' },
  ],
  marketing: [
    { dept: 'Marketing', label: 'Blended ROAS', value: '3.2×', change: '▲ 0.2× MoM', accentColor: '#7F77DD' },
    { dept: 'Paid', label: 'CPA vs. target', value: '94%', change: '▲ 3% pts MoM', accentColor: '#E85D75' },
    { dept: 'Content', label: 'Organic sessions', value: '128k', change: '▲ 6.2% MoM', accentColor: '#378ADD' },
  ],
  commerce: [
    { dept: 'Merch', label: 'In-stock rate (top SKUs)', value: '97.1%', change: '▼ 0.4% pts MoM', accentColor: '#7F77DD' },
    { dept: 'Catalog', label: 'Listing data quality', value: '91%', change: '▲ 2% pts MoM', accentColor: '#1D9E75' },
    { dept: 'Pricing', label: 'Margin vs. plan', value: '102%', change: '▲ 1% pts MoM', accentColor: '#378ADD' },
  ],
  ops: [
    { dept: 'Operations', label: 'Fulfillment SLA met', value: '96.2%', change: '▼ 0.8% pts MoM', accentColor: '#1D9E75' },
    { dept: 'Inventory', label: 'Stockout incidents', value: '14', change: '▼ 3 MoM', accentColor: '#7F77DD' },
    { dept: 'Returns', label: 'Return processing time', value: '2.1d', change: '▼ 0.3d MoM', accentColor: '#378ADD' },
  ],
  customer: [
    { dept: 'Support', label: 'First response time', value: '18m', change: '▼ 4m MoM', accentColor: '#7F77DD' },
    { dept: 'Success', label: 'Expansion pipeline health', value: '78%', change: '▲ 6% pts MoM', accentColor: '#1D9E75' },
    { dept: 'CX', label: 'CSAT (resolved tickets)', value: '4.6', change: '▲ 0.1 MoM', accentColor: '#378ADD' },
  ],
  sales: [
    { dept: 'Sales', label: 'Pipeline coverage', value: '3.4×', change: '▲ 0.2× MoM', accentColor: '#7F77DD' },
    { dept: 'Partners', label: 'Partner-sourced revenue', value: '$412k', change: '▲ 9% MoM', accentColor: '#1D9E75' },
    { dept: 'Accounts', label: 'Net revenue retention', value: '108%', change: '▲ 1% pts MoM', accentColor: '#378ADD' },
  ],
  finance: [
    { dept: 'Finance', label: 'Gross margin', value: '58.4%', change: '▲ 0.6% pts MoM', accentColor: '#378ADD' },
    { dept: 'Accounting', label: 'Close cycle time', value: '4.2d', change: '▼ 0.5d MoM', accentColor: '#7F77DD' },
    { dept: 'People', label: 'Open reqs filled (90d)', value: '72%', change: '▲ 5% pts MoM', accentColor: '#1D9E75' },
  ],
  risk: [
    { dept: 'Fraud', label: 'Chargeback rate', value: '0.42%', change: '▼ 0.05% pts MoM', accentColor: '#E85D75' },
    { dept: 'Risk', label: 'Step-up approval rate', value: '88%', change: '▲ 2% pts MoM', accentColor: '#7F77DD' },
    { dept: 'Compliance', label: 'Policy exceptions', value: '6', change: '▼ 2 MoM', accentColor: '#378ADD' },
  ],
  default: [
    { dept: 'Marketing', label: 'Email open rate', value: '24.7%', change: '▲ 1.3% pts MoM', accentColor: '#7F77DD' },
    { dept: 'Operations', label: 'Fulfillment SLA met', value: '96.2%', change: '▼ 0.8% pts MoM', accentColor: '#1D9E75' },
    { dept: 'Finance', label: 'Gross margin', value: '58.4%', change: '▲ 0.6% pts MoM', accentColor: '#378ADD' },
  ],
}

// ─── localStorage helpers ─────────────────────────────────────────────────────

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

// ─── Data generation ──────────────────────────────────────────────────────────

function generateKpiOverview() {
  const companyName = 'D2C Apparel Co.'
  const now = new Date()
  const periodLabel = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })

  const kpisById = {}

  const revenue = randInt(65_000, 210_000)
  const revenueDelta = randFloat(-0.12, 0.18)
  kpisById.revenue_mtd = {
    id: 'revenue_mtd',
    label: 'Revenue (MTD)',
    status: pickStatusFromDelta({ delta: revenueDelta, goodWhenHigher: true, smallThreshold: 0.03 }),
    value: formatMoney(revenue),
    change:
      revenueDelta >= 0
        ? `▲ ${formatMoney(Math.round(revenue * revenueDelta))} vs. last period`
        : `▼ ${formatMoney(Math.round(revenue * Math.abs(revenueDelta)))} vs. last period`,
    changeClass: revenueDelta >= 0 ? 'up' : 'down',
  }

  const customers = randInt(8_500, 29_500)
  const customerDelta = randFloat(-0.18, 0.22)
  kpisById.active_customers = {
    id: 'active_customers',
    label: 'Active Customers',
    status: pickStatusFromDelta({ delta: customerDelta, goodWhenHigher: true, smallThreshold: 0.035 }),
    value: formatNumber(customers),
    change:
      customerDelta >= 0
        ? `▲ ${formatNumber(Math.round(customers * customerDelta))} vs. last period`
        : `▼ ${formatNumber(Math.round(customers * Math.abs(customerDelta)))} vs. last period`,
    changeClass: customerDelta >= 0 ? 'up' : 'down',
  }

  const conversionBase = randFloat(1.2, 4.9)
  const conversionDelta = randFloat(-0.45, 0.65)
  const conversion = Math.max(0.4, conversionBase + conversionDelta)
  kpisById.conversion_rate = {
    id: 'conversion_rate',
    label: 'Conversion Rate',
    status: pickStatusFromDelta({ delta: conversionDelta, goodWhenHigher: true, smallThreshold: 0.12 }),
    value: formatPercent(conversion),
    change:
      conversionDelta >= 0
        ? `▲ ${formatPercentPoints(conversionDelta)} vs. last period`
        : `▼ ${formatPercentPoints(Math.abs(conversionDelta))} vs. last period`,
    changeClass: conversionDelta >= 0 ? 'up' : 'down',
  }

  const aov = randInt(52, 142)
  const aovDelta = randFloat(-0.09, 0.11)
  kpisById.aov = {
    id: 'aov',
    label: 'Avg Order Value',
    status: pickStatusFromDelta({ delta: aovDelta, goodWhenHigher: true, smallThreshold: 0.02 }),
    value: formatMoney(aov),
    change:
      aovDelta >= 0
        ? `▲ ${formatMoney(Math.round(aov * aovDelta))} vs. last period`
        : `▼ ${formatMoney(Math.round(aov * Math.abs(aovDelta)))} vs. last period`,
    changeClass: pickChangeClassFromDelta({ delta: aovDelta, goodWhenHigher: true }),
  }

  const repeatBase = randFloat(14.5, 33.0)
  const repeatDelta = randFloat(-1.6, 2.4)
  const repeatRate = Math.max(6, repeatBase + repeatDelta)
  kpisById.repeat_purchase_rate = {
    id: 'repeat_purchase_rate',
    label: 'Repeat Purchase Rate',
    status: pickStatusFromDelta({ delta: repeatDelta, goodWhenHigher: true, smallThreshold: 0.55 }),
    value: formatPercent(repeatRate),
    change:
      repeatDelta >= 0
        ? `▲ ${formatPercentPoints(repeatDelta)} vs. last period`
        : `▼ ${formatPercentPoints(Math.abs(repeatDelta))} vs. last period`,
    changeClass: pickChangeClassFromDelta({ delta: repeatDelta, goodWhenHigher: true }),
  }

  const cac = randInt(18, 62)
  const cacDelta = randFloat(-0.14, 0.18)
  const cacImproves = cacDelta < 0
  kpisById.cac = {
    id: 'cac',
    label: 'Customer Acquisition Cost',
    status: pickStatusFromDelta({ delta: cacDelta, goodWhenHigher: false, smallThreshold: 0.03 }),
    value: formatMoney(cac),
    change:
      cacDelta === 0
        ? `▲ ${formatMoney(0)} vs. last period`
        : cacImproves
        ? `▼ ${formatMoney(Math.round(cac * Math.abs(cacDelta)))} vs. last period`
        : `▲ ${formatMoney(Math.round(cac * Math.abs(cacDelta)))} vs. last period`,
    changeClass: pickChangeClassFromDelta({ delta: cacDelta, goodWhenHigher: false }),
  }

  const nps = randInt(26, 74)
  const npsDelta = randFloat(-6, 8)
  kpisById.nps = {
    id: 'nps',
    label: 'Net Promoter Score',
    status: pickStatusFromDelta({ delta: npsDelta, goodWhenHigher: true, smallThreshold: 1.9 }),
    value: `${nps}`,
    change:
      npsDelta >= 0
        ? `▲ ${Math.round(npsDelta)} pts vs. last period`
        : `▼ ${Math.round(Math.abs(npsDelta))} pts vs. last period`,
    changeClass: pickChangeClassFromDelta({ delta: npsDelta, goodWhenHigher: true }),
  }

  const churnBase = randFloat(1.0, 4.5)
  const churnDelta = randFloat(-0.7, 0.9)
  const churn = Math.max(0.4, churnBase + churnDelta)
  const churnImproves = churnDelta < 0
  kpisById.churn_rate = {
    id: 'churn_rate',
    label: 'Churn Rate',
    status: pickStatusFromDelta({ delta: churnDelta, goodWhenHigher: false, smallThreshold: 0.13 }),
    value: formatPercent(churn),
    change:
      churnDelta === 0
        ? '▲ 0.00% pts vs. last period'
        : churnImproves
        ? `▼ ${formatPercentPoints(Math.abs(churnDelta))} vs. last period`
        : `▲ ${formatPercentPoints(Math.abs(churnDelta))} vs. last period`,
    changeClass: churnDelta < 0 ? 'up' : 'down',
  }

  const agentKpi = kpisById[AGENT_KPI_ID]
  const insight =
    agentKpi.status === 'red'
      ? `Agent focus: ${agentKpi.label}. This week's pattern suggests elevated risk—I'd prioritize retention outreach + cancellation reason analysis.`
      : agentKpi.status === 'amber'
      ? `Agent focus: ${agentKpi.label}. Early signals are mixed—worth monitoring cohort-level churn and recent CX tickets.`
      : `Agent focus: ${agentKpi.label}. Looks healthy—I'll propose optimizations to keep churn flat while scaling acquisition.`

  return { companyName, periodLabel, kpisById, agentKpiId: AGENT_KPI_ID, insight }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function KpiOverviewWidget({ userRole = '' }) {
  const [open, setOpen] = useState(false)
  const [overview] = useState(() => generateKpiOverview())

  // Panel visibility
  const [swapOpen, setSwapOpen] = useState(false)
  const [promptOpen, setPromptOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)

  // Prompt / typing state
  const [promptText, setPromptText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [scenarioIdx, setScenarioIdx] = useState(0)
  const [promptDone, setPromptDone] = useState(false)
  const typeTimerRef = useRef(null)

  // KPI overrides set by a scenario
  const [kpiOverrides, setKpiOverrides] = useState({})
  const [agentOverride, setAgentOverride] = useState(null)
  const [insightOverride, setInsightOverride] = useState(null)
  const [trackedOverrideIds, setTrackedOverrideIds] = useState(null)

  const dropdownEls = useRef([])

  const [trackedIds, setTrackedIds] = useState(() => {
    const saved = readTrackedKpisFromStorage()
    return saved ?? ['revenue_mtd', 'active_customers', 'conversion_rate']
  })

  const activeTrackedIds = trackedOverrideIds ?? trackedIds

  // ─── Lifecycle helpers ───────────────────────────────────────────────────────

  const openAndRefresh = () => {
    setSwapOpen(false)
    setPromptOpen(false)
    setOpenDropdown(null)
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  useEffect(() => {
    if (!open) {
      setSwapOpen(false)
      setPromptOpen(false)
      setOpenDropdown(null)
    }
  }, [open])

  useEffect(() => {
    if (openDropdown === null) return
    const handler = (e) => {
      if (e.key === 'Escape') { setOpenDropdown(null); return }
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

  useEffect(() => () => clearTimeout(typeTimerRef.current), [])

  // ─── Derived KPI data ────────────────────────────────────────────────────────

  const trackedCatalog = useMemo(() => TRACKED_KPI_CATALOG, [])

  const trackedKpis = useMemo(() => {
    return activeTrackedIds
      .map((id) => {
        const base = overview.kpisById[id]
        if (!base) return null
        const ov = kpiOverrides[id]
        if (!ov) return base
        return {
          ...base,
          value: ov.valueFn ? ov.valueFn() : base.value,
          change: ov.changeFn ? ov.changeFn() : base.change,
          changeClass: ov.changeClass ?? base.changeClass,
          status: ov.status ?? base.status,
        }
      })
      .filter(Boolean)
  }, [overview.kpisById, activeTrackedIds, kpiOverrides])

  const agentKpi = useMemo(() => {
    const base = overview.kpisById[overview.agentKpiId]
    if (!agentOverride) return base
    return { ...base, ...agentOverride }
  }, [overview.agentKpiId, overview.kpisById, agentOverride])

  const activeInsight = insightOverride ?? overview.insight

  const departmentKpis = useMemo(() => {
    const category = getRoleCategory(userRole)
    return DEPT_KPIS_BY_CATEGORY[category] ?? DEPT_KPIS_BY_CATEGORY.default
  }, [userRole])

  // ─── Prompt typing animation ─────────────────────────────────────────────────

  function startTypingScenario(idx) {
    const scenario = PROMPT_SCENARIOS[idx % PROMPT_SCENARIOS.length]
    let charIdx = 0
    setPromptText('')
    setPromptDone(false)
    setIsTyping(true)

    function typeNext() {
      charIdx++
      setPromptText(scenario.prompt.slice(0, charIdx))
      if (charIdx < scenario.prompt.length) {
        typeTimerRef.current = setTimeout(typeNext, 36 + Math.random() * 30)
      } else {
        typeTimerRef.current = setTimeout(() => {
          setKpiOverrides(scenario.kpiOverrides ?? {})
          setTrackedOverrideIds(scenario.trackedIds ?? null)
          if (scenario.agentOverride) setAgentOverride(scenario.agentOverride)
          if (scenario.insightOverride) setInsightOverride(scenario.insightOverride)
          setIsTyping(false)
          setPromptDone(true)
          setScenarioIdx((prev) => (prev + 1) % PROMPT_SCENARIOS.length)
        }, 420)
      }
    }
    typeNext()
  }

  function handlePromptKeyDown(e) {
    if (isTyping) { e.preventDefault(); return }
    if (e.key === 'Enter') {
      e.preventDefault()
      triggerScenario()
      return
    }
    // Intercept any printable character — start scenario instead of typing it
    if (e.key.length === 1) {
      e.preventDefault()
      triggerScenario()
    }
  }

  function triggerScenario() {
    if (isTyping) return
    startTypingScenario(scenarioIdx)
  }

  // ─── Swap slot helper ────────────────────────────────────────────────────────

  const setTrackedIdAt = (index, nextId) => {
    setTrackedIds((prev) => {
      const next = [...prev]
      const existingIndex = next.indexOf(nextId)
      if (existingIndex === -1) {
        next[index] = nextId
        return next
      }
      next[existingIndex] = next[index]
      next[index] = nextId
      return next
    })
    // Clear scenario override so the manual choice takes effect
    setTrackedOverrideIds(null)
    setKpiOverrides({})
    setAgentOverride(null)
    setInsightOverride(null)
    setPromptText('')
    setPromptDone(false)
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

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

          {/* Header */}
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

            {/* Section row: label + Swap button */}
            <div className="kpi-section-row" style={{ marginTop: 14 }}>
              <div className="response-section-title" style={{ marginTop: 0, marginBottom: 0 }}>
                PERSONAL KPIs
              </div>
              <button
                type="button"
                className="kpi-swap-open-btn"
                onClick={() => {
                  const nextSwap = !swapOpen
                  setSwapOpen(nextSwap)
                  // Close prompt if swap is opening
                  if (nextSwap) setPromptOpen(false)
                  setOpenDropdown(null)
                }}
                aria-expanded={swapOpen ? 'true' : 'false'}
                aria-label="Swap tracked KPIs"
              >
                Swap KPIs
              </button>
            </div>

            {/* Swap panel */}
            {swapOpen && (
              <div className="kpi-swap-inline" aria-label="Swap tracked KPIs panel">
                <div className="kpi-swap-subtitle">
                  Swap the 3 tracked metrics. Agent focus stays constant.
                </div>

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

                        {isOpen && (
                          <div
                            className="kpi-dd-menu"
                            role="listbox"
                            aria-label={`Tracked KPI slot ${idx + 1} options`}
                          >
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
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="kpi-swap-agent">
                  <div className="kpi-swap-agent-pill">Agent focus</div>
                  <div className="kpi-swap-agent-name">{agentKpi?.label ?? '—'}</div>
                </div>

                {/* Button to open the prompt bar */}
                <button
                  type="button"
                  className="kpi-swap-open-btn"
                  style={{ marginTop: 10 }}
                  onClick={() => {
                    setPromptOpen((v) => !v)
                    setSwapOpen(false)
                  }}
                  aria-expanded={promptOpen ? 'true' : 'false'}
                >
                  Ask about your KPIs ↗
                </button>
              </div>
            )}

            {/* Prompt bar — visible when promptOpen */}
            {promptOpen && (
              <div className="kpi-prompt-bar">
                <div className="kpi-prompt-input-wrap">
                  <input
                    className="kpi-prompt-input"
                    type="text"
                    placeholder="What do you want to keep track of?"
                    value={promptText}
                    readOnly={isTyping}
                    onKeyDown={handlePromptKeyDown}
                    onChange={() => {}} // controlled — typing is intercepted via onKeyDown
                    autoFocus
                    aria-label="KPI prompt input"
                  />
                  <button
                    type="button"
                    className="kpi-prompt-send"
                    onClick={triggerScenario}
                    disabled={isTyping}
                    aria-label="Send prompt"
                  >
                    ↑
                  </button>
                </div>
                {isTyping && (
                  <div className="kpi-prompt-hint">Generating insight…</div>
                )}
                {!isTyping && promptDone && (
                  <div className="kpi-prompt-hint">KPIs updated. Type or click ↑ for next scenario.</div>
                )}
              </div>
            )}

            {/* Tracked KPI cards */}
            <div className="kpi-strip kpi-strip-3" style={{ marginTop: 12 }}>
              {trackedKpis.map((kpi) => (
                <div key={kpi.id} className="kpi-card">
                  <div className="kpi-label">
                    {kpi.label}
                    <span
                      className={`kpi-status ${kpi.status}`}
                      style={{ float: 'right', marginTop: '3px' }}
                    />
                  </div>
                  <div className="kpi-value">{kpi.value}</div>
                  <div className={`kpi-change ${kpi.changeClass}`}>{kpi.change}</div>
                </div>
              ))}
            </div>

            {/* Agent Focus */}
            <div className="response-section-title" style={{ marginTop: 14 }}>
              Agent Focus (This Week)
            </div>
            {agentKpi && (
              <div className="kpi-strip kpi-strip-1">
                <div className="kpi-card kpi-card-agent">
                  <div className="kpi-label kpi-label-row">
                    <span>{agentKpi.label}</span>
                    <span className="kpi-agent-pill">Agent</span>
                    <span className={`kpi-status ${agentKpi.status}`} />
                  </div>
                  <div className="kpi-value">{agentKpi.value}</div>
                  <div className={`kpi-change ${agentKpi.changeClass}`}>{agentKpi.change}</div>
                  <div className="kpi-agent-reason">
                    Constant for demo: the agent "determines" this KPI is most important given this week's data.
                  </div>
                </div>
              </div>
            )}

            {/* Insight callout */}
            <div className="insight-callout" style={{ marginTop: 18 }}>
              {activeInsight}
            </div>

            <div className="response-section-title" style={{ marginTop: 18 }}>
              Department KPIs
            </div>
            <div className="kpi-strip kpi-strip-3">
              {departmentKpis.map((d) => (
                <div
                  key={`${d.dept}-${d.label}`}
                  className="kpi-card"
                  style={{ borderTop: `3px solid ${d.accentColor}` }}
                >
                  <div className="kpi-label">{d.label}</div>
                  <div className="kpi-value">{d.value}</div>
                  <div className="kpi-change amber">{d.change}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}