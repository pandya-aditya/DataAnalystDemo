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

      <div className="response-section-title">Proposed actions</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Promotions</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Stop promo stacking on mid-margin SKUs</span>
          </div>
          <div className="action-description">
            Tighten promo governance to reduce discount leakage (discount rate moved from 8.1% to 11.3%). Prioritize exclusions where stacking is common.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Draft rule changes</button>
            <button className="action-btn-ghost">Review impacted SKUs</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Shipping</span>
            <span className="action-type-pill pending">Needs review</span>
            <span className="action-title">Audit Zone 6–8 rates + split shipments</span>
          </div>
          <div className="action-description">
            Shipping cost/order increased from $6.80 to $9.10. Compare carriers by lane and enforce packaging rules to reduce split shipments.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Open rate audit</button>
            <button className="action-btn-ghost">Later</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Slack</span>
            <span className="action-type-pill done">Ready</span>
            <span className="action-title">Weekly margin driver digest</span>
          </div>
          <div className="action-description">
            Summary ready to send: discount rate, shipping cost/order, return rate, and paid media efficiency with variance drivers and suggested owners.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Send digest draft</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>
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
        <p>
          This is a cost story, not a revenue story: discount leakage, shipping, and returns moved against us, and all three levers are within operational control.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Leadership narrative summary">
            <thead>
              <tr>
                <th>Theme</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Revenue</td>
                <td>$218k vs $215k prior period (+1.2%). Volume held; AOV dipped slightly due to promotional mix shift.</td>
              </tr>
              <tr>
                <td>Margin</td>
                <td>Net contribution dropped from $127k to $104k (−8.3 pts) despite flat revenue.</td>
              </tr>
              <tr>
                <td>Driver 1</td>
                <td>Discount leakage: promo stacking pushed discount rate from 8.1% to 11.3% (governance gap).</td>
              </tr>
              <tr>
                <td>Driver 2</td>
                <td>Shipping: Zone 6–8 rate changes + more split shipments moved cost/order from $6.80 to $9.10.</td>
              </tr>
              <tr>
                <td>Driver 3</td>
                <td>Returns: return rate jumped from 6.2% to 9.8%, concentrated in 3 outerwear SKUs with fit/expectation mismatch.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Proposed actions</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Plan</span>
            <span className="action-type-pill pending">In progress</span>
            <span className="action-title">Margin protection plan — 4 levers in 14 days</span>
          </div>
          <div className="action-description">
            Promo governance tightened, paid media reallocated, PDP sizing fixes queued, and carrier renegotiation underway. Estimated recovery: $13–21k in contribution margin over 2 weeks.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">View full plan</button>
            <button className="action-btn-ghost">Request CFO review</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Exec Comms</span>
            <span className="action-type-pill done">Ready</span>
            <span className="action-title">Board-ready narrative + slide draft</span>
          </div>
          <div className="action-description">
            Summary and key drivers organized for exec sharing; includes a one-slide version and weekly digest template for the CFO.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Generate slide draft</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>
      </div>
    </>
  )
}
