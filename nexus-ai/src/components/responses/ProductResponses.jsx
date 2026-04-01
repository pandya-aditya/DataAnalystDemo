import { InlineChart } from './shared'

// ─── Turn 1: Diagnose margin bleed ───────────────────────────────────────────

const CATEGORY_MARGIN_SCATTER = {
  type: 'scatter',
  data: {
    datasets: [
      {
        label: 'Categories',
        data: [
          { x: 51, y: 28, label: 'Tops & basics' },
          { x: 47, y: 18, label: 'Outerwear' },
          { x: 62, y: 12, label: 'Accessories' },
          { x: 44, y: 8, label: 'Dresses' },
        ],
        backgroundColor: 'rgba(82, 201, 122, 0.75)',
        borderColor: 'rgba(82, 201, 122, 1)',
        pointRadius: 5,
      },
      {
        label: 'Denim',
        data: [{ x: 29, y: 34, label: 'Denim' }],
        backgroundColor: 'rgba(224, 82, 82, 0.85)',
        borderColor: 'rgba(224, 82, 82, 1)',
        pointRadius: 7,
      },
      // Reference line: Brand margin target (x = 44)
      {
        type: 'line',
        label: 'Brand margin target',
        data: [{ x: 44, y: 0 }, { x: 44, y: 40 }],
        borderColor: 'rgba(232, 197, 71, 0.6)',
        borderDash: [4, 4],
        pointRadius: 0,
        borderWidth: 1.5,
      },
      // Reference line: Material revenue threshold (y = 25)
      {
        type: 'line',
        label: 'Material revenue threshold',
        data: [{ x: 20, y: 25 }, { x: 65, y: 25 }],
        borderColor: 'rgba(232, 197, 71, 0.35)',
        borderDash: [4, 4],
        pointRadius: 0,
        borderWidth: 1.5,
      },
    ],
  },
  options: {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const p = ctx?.raw
            const name = p?.label ? `${p.label}: ` : ''
            return `${name}${p?.y}% revenue @ ${p?.x}% GM`
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Gross Margin %' },
        min: 20,
        max: 65,
        ticks: { callback: (v) => `${v}%` },
      },
      y: {
        title: { display: true, text: 'Share of Total Revenue %' },
        min: 0,
        max: 40,
        ticks: { callback: (v) => `${v}%` },
      },
    },
  },
}

export function ProductResponse1({ onExpandChart }) {
  return (
    <>
      <div className="ai-text">
        <p>
          The margin bleed is coming from two places: acquisition quality and category mix.
          Paid channels (especially Meta) are bringing revenue, but the paid cohort is repurchasing far less than organic/email—so LTV is lagging while CAC rises.
        </p>
        <p>
          The second driver is denim. It’s your fastest-growing category by revenue, but it’s also your thinnest by margin. As denim becomes a larger share of sales, it mechanically drags blended gross margin down.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="Revenue contribution vs gross margin % (current quarter)"
          onExpand={() => onExpandChart?.('category-margin')}
          config={CATEGORY_MARGIN_SCATTER}
        />
      </div>

      <div className="response-section-title">Actions</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Gmail</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Draft the 10am pre-read</span>
          </div>
          <div className="action-description">
            Draft a concise brief to CEO/CFO summarizing: paid cohort retention drag + denim margin dilution + a counter-proposal to hit growth without losing margin.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Draft email</button>
            <button className="action-btn-ghost">Not now</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Slack</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Alert the buying team</span>
          </div>
          <div className="action-description">
            Flag that denim is scaling as a margin drag; request a focused review of the two lowest-margin denim SKUs for pricing correction.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Message #buying</button>
            <button className="action-btn-ghost">Later</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Klaviyo</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Surface the high-LTV retention segment</span>
          </div>
          <div className="action-description">
            Identify and tag top repurchase-rate customers so retention flows can be built immediately (high margin, low incremental cost).
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Create segment</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Turn 2: Q2 plan (3 levers) ──────────────────────────────────────────────

const Q2_WATERFALL = {
  type: 'bar',
  data: {
    labels: ['Baseline', 'Retention flows', 'Denim reprice', 'Paid reallocation', 'Projected Q2'],
    datasets: [
      {
        label: 'Base',
        data: [0, 2.1, 3.5, 4.1, 0],
        backgroundColor: 'rgba(0,0,0,0)',
        borderColor: 'rgba(0,0,0,0)',
        stack: 'waterfall',
        borderSkipped: false,
      },
      {
        label: 'Increment ($M)',
        data: [2.1, 1.4, 0.6, 0.9, 5.0],
        backgroundColor: [
          'rgba(160, 167, 181, 0.55)',
          'rgba(82, 201, 122, 0.75)',
          'rgba(232, 197, 71, 0.65)',
          'rgba(82, 201, 122, 0.75)',
          'rgba(127, 119, 221, 0.70)',
        ],
        borderColor: [
          'rgba(160, 167, 181, 0.9)',
          'rgba(82, 201, 122, 1)',
          'rgba(232, 197, 71, 1)',
          'rgba(82, 201, 122, 1)',
          'rgba(127, 119, 221, 1)',
        ],
        stack: 'waterfall',
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  },
  options: {
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const v = ctx?.raw
            const label = ctx?.label || ''
            if (label === 'Denim reprice') return `$${v}M (margin recovery equivalent)`
            return `$${v}M`
          },
        },
      },
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: { callback: (v) => `$${v}M` },
        suggestedMax: 6,
      },
    },
  },
}

export function ProductResponse2({ onExpandChart }) {
  return (
    <>
      <div className="ai-text">
        <p>
          Hitting 40% growth is achievable if you change the mix: grow retention first, fix denim margin before it scales, and use paid spend more selectively.
        </p>
        <p>
          The model stacks three levers—retention flows, targeted denim repricing, and paid reallocation—into a budget-neutral path to ~38–43% growth while holding ~42–44% blended gross margin.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="Path to 40% growth (waterfall: incremental impact by lever)"
          onExpand={() => onExpandChart?.('q2-waterfall')}
          config={Q2_WATERFALL}
        />
      </div>

      <div className="response-section-title">Actions</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Gmail</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Send the Q2 growth plan brief to CEO/CFO</span>
          </div>
          <div className="action-description">
            Share the 3-lever plan with projections, guardrails, and a 30-day checkpoint. Emphasize: no budget increase required.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Draft brief</button>
            <button className="action-btn-ghost">Not now</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Google Drive</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Save the model to Strategy</span>
          </div>
          <div className="action-description">
            Save a clean version of the analysis (inputs, assumptions, outputs) to the Q2 Planning folder so stakeholders can review without spreadsheet sprawl.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Save model</button>
            <button className="action-btn-ghost">Later</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Klaviyo</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Trigger retention flow setup</span>
          </div>
          <div className="action-description">
            Generate a structured flow brief: segment definition, cadence, offer logic, success metrics, and weekly reporting.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Create flow brief</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Turn 3: Board deck section ──────────────────────────────────────────────

export function ProductResponse3() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here’s the board-ready Q2 Growth Plan section. It’s structured as a decision memo: situation, opportunity, levers, projection, and the ask.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Q2 Growth Plan — board copy">
            <thead>
              <tr>
                <th>Section</th>
                <th>Board copy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Situation</strong></td>
                <td>Growth is strong, but channel mix and category expansion are pressuring gross margin. Without changes, scaling to 40% revenue growth risks further margin compression.</td>
              </tr>
              <tr>
                <td><strong>Opportunity</strong></td>
                <td>Three high-conviction levers can deliver ~38–43% Q2 growth at ~42–44% blended gross margin—meeting the growth target while protecting profitability.</td>
              </tr>
              <tr>
                <td><strong>Lever 1</strong></td>
                <td><strong>Retention:</strong> activate high-LTV customers via targeted Klaviyo flows (margin-accretive growth).</td>
              </tr>
              <tr>
                <td><strong>Lever 2</strong></td>
                <td><strong>Denim margin correction:</strong> targeted repricing on two underperforming SKUs to neutralize mix-driven margin drag before scaling.</td>
              </tr>
              <tr>
                <td><strong>Lever 3</strong></td>
                <td><strong>Paid reallocation:</strong> shift spend from cold prospecting to warmer audiences (retargeting/lapsed) to improve ROAS without increasing budget.</td>
              </tr>
              <tr>
                <td><strong>Ask</strong></td>
                <td>Approve the proposed Q2 budget allocation with a 30-day performance checkpoint (growth and margin guardrails) to validate the plan and scale winners.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Q2 projected outcomes</div>
      <div className="data-block">
        <div className="kpi-strip kpi-strip-3">
          <div className="kpi-card">
            <div className="kpi-label">Revenue growth</div>
            <div className="kpi-value">38–43%</div>
            <div className="kpi-change amber">Board target: 40%</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Blended gross margin</div>
            <div className="kpi-value">42–44%</div>
            <div className="kpi-change amber">Margin floor: 42%</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Incremental revenue</div>
            <div className="kpi-value">$5.0M</div>
            <div className="kpi-change up">Across 3 levers</div>
          </div>
        </div>
      </div>

      <div className="response-section-title">Actions</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Gmail</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Send to CEO for final review</span>
          </div>
          <div className="action-description">
            Forward the board section for a quick pass (one sentence on longer-term brand positioning is the most likely add).
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Draft email</button>
            <button className="action-btn-ghost">Not now</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Slack</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Notify the deck owner</span>
          </div>
          <div className="action-description">
            Message the design/deck owner that the copy is board-ready and the chart is available in the Q2 Planning folder.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Message #brand-creative</button>
            <button className="action-btn-ghost">Later</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Slack</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Kick off the 3 workstreams</span>
          </div>
          <div className="action-description">
            Post one-paragraph briefs to #email-marketing, #buying, and #paid-social so the teams can start immediately on board approval.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Send briefs</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>
      </div>
    </>
  )
}

