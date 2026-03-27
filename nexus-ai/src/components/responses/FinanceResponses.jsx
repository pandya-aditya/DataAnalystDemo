import { InlineChart } from './shared'

// ─── Step 1: Profit waterfall (30d vs prior 30d) ─────────────────────────────

const WATERFALL_CONFIG = {
  type: 'bar',
  data: {
    labels: ['Gross Revenue', 'Discounts', 'Refunds', 'Shipping Costs', 'Paid Media', 'COGS Other', 'Net Contribution'],
    datasets: [
      {
        label: 'USD',
        data: [218000, -24600, -16200, -19800, -41300, -12400, 103700],
        backgroundColor: [
          '#52C97A',
          '#E05252',
          '#E05252',
          '#E05252',
          '#E8C547',
          '#E8C547',
          '#52C97A',
        ],
        borderRadius: 4,
      },
    ],
  },
  options: {
    scales: {
      y: { ticks: { callback: (v) => `$${(v / 1000).toFixed(0)}k` } },
    },
  },
}

export function FinanceResponse1({ onExpandChart }) {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the profit waterfall for the last 30 days vs the prior 30 days. Revenue held roughly flat (+1.2%), but net contribution margin compressed by 8.3 points — driven by three specific cost movements, not a revenue problem.
        </p>
        <p>
          The chart shows where each dollar went. The three biggest drivers of the margin compression are below.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="Profit bridge — last 30d"
          onExpand={() => onExpandChart?.('waterfall')}
          config={WATERFALL_CONFIG}
        />
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Profit variance drivers">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Last 30d</th>
                <th>Prior 30d</th>
                <th>Change</th>
                <th>Margin impact</th>
                <th>Root cause</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Discount rate</td>
                <td className="cell-red">11.3%</td>
                <td>8.1%</td>
                <td className="cell-red">+3.2 pts</td>
                <td className="cell-red">−$7,000</td>
                <td>Promo stacking on mid-margin SKUs</td>
              </tr>
              <tr>
                <td>Shipping cost / order</td>
                <td className="cell-red">$9.10</td>
                <td>$6.80</td>
                <td className="cell-red">+$2.30</td>
                <td className="cell-red">−$5,200</td>
                <td>Carrier rate increase + more split shipments</td>
              </tr>
              <tr>
                <td>Refund / return rate</td>
                <td className="cell-red">9.8%</td>
                <td>6.2%</td>
                <td className="cell-red">+3.6 pts</td>
                <td className="cell-red">−$7,900</td>
                <td>Fit/expectations issues on 3 outerwear SKUs</td>
              </tr>
              <tr>
                <td>Paid media efficiency (ROAS)</td>
                <td className="cell-amber">2.9×</td>
                <td>3.6×</td>
                <td className="cell-amber">−0.7×</td>
                <td className="cell-amber">−$4,100</td>
                <td>TikTok CAC spike; creative fatigue</td>
              </tr>
              <tr>
                <td>Gross Revenue</td>
                <td className="cell-green">$218,000</td>
                <td>$215,400</td>
                <td className="cell-green">+$2,600</td>
                <td className="cell-green">Neutral</td>
                <td>Flat; volume offset by AOV dip</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="insight-callout">
        Revenue is not the problem. All margin compression came from cost movements — discount leakage, shipping, and returns — which are all addressable without cutting revenue.
      </div>

      <div className="suggestions">
        <button className="suggestion-pill visible">Build 2-week margin protection plan</button>
        <button className="suggestion-pill visible">Drill into shipping cost by carrier zone</button>
        <button className="suggestion-pill visible">Show return rate by SKU cluster</button>
      </div>
    </>
  )
}

// ─── Step 2: Margin protection plan (2 weeks) ────────────────────────────────

export function FinanceResponse2() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's a 2-week margin protection plan with concrete actions across discounting, shipping, returns, and paid media — with estimated impact ranges for each lever.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Margin protection plan">
            <thead>
              <tr>
                <th>Lever</th>
                <th>Action</th>
                <th>Owner</th>
                <th>Timeline</th>
                <th>Est. margin recovery</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Promo governance</td>
                <td>Remove mid-margin SKUs from stacking; shift to bundle + threshold offers</td>
                <td>Merch / Marketing</td>
                <td>Day 1–2</td>
                <td className="cell-green">+$5–7k (2-week)</td>
                <td className="cell-green">Low</td>
              </tr>
              <tr>
                <td>Shipping costs</td>
                <td>Renegotiate Zone 6–8 rates; enforce packaging rules; reduce split shipments</td>
                <td>Ops</td>
                <td>Day 2–5</td>
                <td className="cell-green">+$3–5k</td>
                <td className="cell-amber">Medium (carrier lead time)</td>
              </tr>
              <tr>
                <td>Returns reduction</td>
                <td>Add fit/sizing guidance to 3 outerwear SKU PDPs; targeted post-purchase messaging</td>
                <td>Merch + CX</td>
                <td>Day 1–3</td>
                <td className="cell-amber">+$2–4k</td>
                <td className="cell-green">Low</td>
              </tr>
              <tr>
                <td>Paid media efficiency</td>
                <td>Pause bottom-quartile TikTok ad sets; reallocate $4k/week to Meta</td>
                <td>Marketing</td>
                <td>Today</td>
                <td className="cell-green">+$3–5k</td>
                <td className="cell-green">Low</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Daily monitoring</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Finance dashboard</span>
            <span className="action-type-pill pending">Daily</span>
            <span className="action-title">Margin pulse — 6 KPIs to watch</span>
          </div>
          <div className="action-description">
            Track daily: gross margin %, contribution margin %, discount rate, shipping cost/order, return rate, and blended ROAS. Alert if any metric moves &gt;1.5 pts unfavorably vs the prior 7-day average.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Set up alerts</button>
            <button className="action-btn-ghost">Open dashboard</button>
          </div>
        </div>
        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Weekly finance sync</span>
            <span className="action-type-pill done">Weekly</span>
            <span className="action-title">7-day margin recovery review</span>
          </div>
          <div className="action-description">
            Every Monday: review margin recovery progress vs plan, reforecast contribution margin for the month, and adjust levers if targets aren't tracking.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Schedule recurring sync</button>
            <button className="action-btn-ghost">Skip</button>
          </div>
        </div>
      </div>

      <div className="suggestions">
        <button className="suggestion-pill visible">Draft leadership finance readout</button>
        <button className="suggestion-pill visible">Build month-end margin forecast</button>
        <button className="suggestion-pill visible">Export plan to finance tracker</button>
      </div>
    </>
  )
}

// ─── Step 3: Leadership finance readout ──────────────────────────────────────

export function FinanceResponse3() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the leadership finance readout — written to be shared directly with the executive team. It leads with the narrative, not the spreadsheet.
        </p>
      </div>

      <div className="response-section-title response-section-title-taken">What happened</div>
      <div className="auto-actions">
        <div className="auto-action-item">
          <div className="auto-action-text"><strong>Revenue flat:</strong> $218k vs $215k prior period (+1.2%). Volume held; AOV dipped slightly due to promotional mix shift.</div>
          <div className="auto-action-time">Revenue</div>
        </div>
        <div className="auto-action-item">
          <div className="auto-action-text"><strong>Margin compressed 8.3 pts:</strong> Net contribution dropped from $127k to $104k despite flat revenue. Three cost lines moved against us in the same period.</div>
          <div className="auto-action-time">Margin</div>
        </div>
        <div className="auto-action-item">
          <div className="auto-action-text"><strong>Discount leakage:</strong> Promo stacking on mid-margin SKUs pushed discount rate from 8.1% to 11.3%. Not a promo failure — a governance gap.</div>
          <div className="auto-action-time">Driver 1</div>
        </div>
        <div className="auto-action-item">
          <div className="auto-action-text"><strong>Shipping cost increase:</strong> Carrier rate changes on Zone 6–8 routes + more split shipments pushed cost/order from $6.80 to $9.10.</div>
          <div className="auto-action-time">Driver 2</div>
        </div>
        <div className="auto-action-item">
          <div className="auto-action-text"><strong>Return spike:</strong> Return rate jumped from 6.2% to 9.8%, concentrated in 3 outerwear SKUs with fit/expectation mismatch on PDPs.</div>
          <div className="auto-action-time">Driver 3</div>
        </div>
      </div>

      <div className="response-section-title response-section-title-permission">What we're doing</div>
      <div className="intervention-item">
        <div className="intervention-header">
          Margin protection plan — 4 levers in 14 days
          <span className="permission-pill">In progress</span>
        </div>
        <div className="intervention-desc">
          Promo governance tightened (today), TikTok spend reallocated, PDP sizing fixes queued, and carrier renegotiation underway. Combined estimated recovery: $13–21k in contribution margin over 2 weeks.
        </div>
        <div className="action-btns">
          <button className="action-btn-primary">View full plan</button>
          <button className="action-btn-ghost">Request CFO review</button>
        </div>
      </div>

      <div className="insight-callout">
        This is a cost story, not a revenue story. All four levers are within operational control and don't require discounting, headcount changes, or capital investment to execute.
      </div>

      <div className="suggestions">
        <button className="suggestion-pill visible">Build month-end contribution margin forecast</button>
        <button className="suggestion-pill visible">Create board-ready P&amp;L slide</button>
        <button className="suggestion-pill visible">Set up weekly CFO digest</button>
      </div>
    </>
  )
}
