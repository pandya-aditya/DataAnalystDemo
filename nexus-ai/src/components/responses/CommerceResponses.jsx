import { InlineChart } from './shared'

// ─── Step 1: Top 10 SKUs + margin risk analysis ──────────────────────────────

const MARGIN_CONFIG = {
  type: 'bar',
  data: {
    labels: ['SKU-104', 'SKU-218', 'SKU-033', 'SKU-091', 'SKU-176'],
    datasets: [
      {
        label: 'Gross Margin %',
        data: [18, 14, 11, 9, 6],
        backgroundColor: ['#E8C547', '#E8C547', '#E05252', '#E05252', '#E05252'],
        borderRadius: 4,
      },
    ],
  },
  options: {
    indexAxis: 'y',
    scales: {
      x: { ticks: { callback: (v) => `${v}%` }, max: 35 },
    },
  },
}

export function CommerceResponse1({ onExpandChart }) {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the SKU performance breakdown: top 10 revenue drivers and the 5 SKUs with the sharpest margin compression right now.
        </p>
        <p>
          The margin risk is concentrated in 3 SKUs that are being over-discounted and have above-average return rates. The chart below shows the at-risk cluster.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="Gross margin % — at-risk SKUs"
          onExpand={() => onExpandChart?.('margin')}
          config={MARGIN_CONFIG}
        />
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Top 10 SKUs by revenue">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Revenue (7d)</th>
                <th>Units sold</th>
                <th>Gross margin</th>
                <th>Return rate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>SKU-001</td>
                <td>$28,400</td>
                <td>710</td>
                <td className="cell-green">42%</td>
                <td className="cell-green">3.1%</td>
                <td><span className="status-badge status-good">Healthy</span></td>
              </tr>
              <tr>
                <td>SKU-008</td>
                <td>$21,100</td>
                <td>528</td>
                <td className="cell-green">38%</td>
                <td className="cell-green">2.8%</td>
                <td><span className="status-badge status-good">Healthy</span></td>
              </tr>
              <tr>
                <td>SKU-015</td>
                <td>$17,600</td>
                <td>440</td>
                <td className="cell-amber">29%</td>
                <td className="cell-amber">6.2%</td>
                <td><span className="status-badge status-ok">Watch</span></td>
              </tr>
              <tr>
                <td>SKU-033</td>
                <td>$14,900</td>
                <td>745</td>
                <td className="cell-red">11%</td>
                <td className="cell-red">14.1%</td>
                <td><span className="status-badge status-alert">Action</span></td>
              </tr>
              <tr>
                <td>SKU-091</td>
                <td>$11,200</td>
                <td>280</td>
                <td className="cell-red">9%</td>
                <td className="cell-red">11.8%</td>
                <td><span className="status-badge status-alert">Action</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Recommended actions</div>
      <div className="action-cards">
        <div className="action-card visible alert">
          <div className="action-card-header">
            <span className="platform-badge">Pricing</span>
            <span className="action-type-pill alert">Priority</span>
            <span className="action-title">Remove at-risk SKUs from promo stacking</span>
          </div>
          <div className="action-description">
            SKU-033 and SKU-091 are being double-discounted via code stacking. Exclude them immediately. Estimated margin recovery: +4–6 pts per SKU.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Update promo rules</button>
            <button className="action-btn-ghost">Review first</button>
          </div>
        </div>
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Merchandising</span>
            <span className="action-type-pill pending">This week</span>
            <span className="action-title">Refresh bundles on top-revenue SKUs</span>
          </div>
          <div className="action-description">
            Bundle SKU-001 + SKU-008 on homepage and search pages to lift AOV. Add fit/size guidance to SKU-033 PDP to reduce return rate before next restock.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Build bundle</button>
            <button className="action-btn-ghost">Add to backlog</button>
          </div>
        </div>
      </div>

      <div className="suggestions">
        <button className="suggestion-pill visible">Build pricing + promo strategy</button>
        <button className="suggestion-pill visible">Drill into return reasons for SKU-033</button>
        <button className="suggestion-pill visible">Show inventory days of cover per SKU</button>
      </div>
    </>
  )
}

// ─── Step 2: 2-week pricing + promo strategy ─────────────────────────────────

export function CommerceResponse2() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's a 2-week pricing and promo strategy that protects margin without sacrificing revenue. The principle: move spend from broad discounts to targeted, bundle-first, threshold-based offers.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Pricing strategy">
            <thead>
              <tr>
                <th>Tactic</th>
                <th>Applies to</th>
                <th>Expected impact</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Exclude margin-risk SKUs from stacking</td>
                <td>SKU-033, SKU-091</td>
                <td className="cell-green">+4–6 pts GM per SKU</td>
                <td className="cell-green">Low</td>
              </tr>
              <tr>
                <td>Threshold offer ("Spend $75, get 10% off")</td>
                <td>Sitewide</td>
                <td className="cell-green">AOV +8–12%</td>
                <td className="cell-green">Low</td>
              </tr>
              <tr>
                <td>Bundle promo on top-margin SKUs</td>
                <td>SKU-001, SKU-008</td>
                <td className="cell-green">AOV +15%, margin held</td>
                <td className="cell-amber">Cannibalization risk — monitor</td>
              </tr>
              <tr>
                <td>Reduce sitewide discount depth 15% → 10%</td>
                <td>Sitewide</td>
                <td className="cell-amber">GM +2–3 pts; CVR may dip slightly</td>
                <td className="cell-amber">Watch CVR daily</td>
              </tr>
              <tr>
                <td>Targeted loyalty discount for top-tier customers</td>
                <td>VIP segment only</td>
                <td className="cell-green">Repeat purchase +10%; contained cost</td>
                <td className="cell-green">Low</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="insight-callout">
        Monitor daily: gross margin %, discount rate, return rate, conversion rate, and AOV. If CVR drops &gt;10% vs baseline within 48 hours, revert the sitewide discount change first.
      </div>

      <div className="response-section-title">Implementation</div>
      <div className="action-cards">
        <div className="action-card visible alert">
          <div className="action-card-header">
            <span className="platform-badge">Today</span>
            <span className="action-type-pill alert">Immediate</span>
            <span className="action-title">Update promo exclusion rules</span>
          </div>
          <div className="action-description">
            Add SKU-033 and SKU-091 to the promo exclusion list in your promotions engine. Verify stacking rules are correctly blocked in cart.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Open promotions config</button>
            <button className="action-btn-ghost">Skip</button>
          </div>
        </div>
        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Day 2–3</span>
            <span className="action-type-pill done">This week</span>
            <span className="action-title">Launch bundle + threshold offers</span>
          </div>
          <div className="action-description">
            Set up SKU-001/SKU-008 bundle product and create threshold discount rule. Update homepage hero to feature bundle prominently.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Create bundle</button>
            <button className="action-btn-ghost">Schedule for later</button>
          </div>
        </div>
      </div>

      <div className="suggestions">
        <button className="suggestion-pill visible">Build daily merchandising checklist</button>
        <button className="suggestion-pill visible">Estimate margin recovery over 2 weeks</button>
        <button className="suggestion-pill visible">Draft PDP copy for SKU-033</button>
      </div>
    </>
  )
}

// ─── Step 3: Daily merchandising checklist ───────────────────────────────────

export function CommerceResponse3() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's your daily merchandising workflow — ordered by decision priority so you always tackle the most time-sensitive signals first.
        </p>
      </div>

      <div className="response-section-title response-section-title-taken">Daily checklist (in order)</div>
      <div className="auto-actions">
        <div className="auto-action-item">
          <div className="auto-action-text"><strong>1. Availability check</strong> — Stockouts or backorders on top 20 SKUs. Any in-stock → backordered transitions in the last 24h?</div>
          <div className="auto-action-time">First</div>
        </div>
        <div className="auto-action-item">
          <div className="auto-action-text"><strong>2. Margin pulse</strong> — Discount rate and promo leakage. Are any excluded SKUs appearing in promo-eligible segments?</div>
          <div className="auto-action-time">Second</div>
        </div>
        <div className="auto-action-item">
          <div className="auto-action-text"><strong>3. Returns spike check</strong> — Return rate by SKU vs 7-day average. Any SKU spiking &gt;2× baseline needs an immediate PDP review.</div>
          <div className="auto-action-time">Third</div>
        </div>
        <div className="auto-action-item">
          <div className="auto-action-text"><strong>4. Traffic + conversion breakpoints</strong> — Top landing pages by sessions, and where the funnel is leaking (PDP → ATC → checkout).</div>
          <div className="auto-action-time">Fourth</div>
        </div>
        <div className="auto-action-item">
          <div className="auto-action-text"><strong>5. Merch actions</strong> — Update homepage/collections for availability, reprioritize promoted bundles, adjust promo rules if margin is drifting.</div>
          <div className="auto-action-time">Fifth</div>
        </div>
      </div>

      <div className="response-section-title response-section-title-permission">Weekly extras (Mondays)</div>
      <div className="intervention-item">
        <div className="intervention-header">
          Review SKU-level margin vs prior week
          <span className="permission-pill">Weekly</span>
        </div>
        <div className="intervention-desc">
          Full margin report across top 30 SKUs: discount depth, return rate, COGS changes. Flag any new at-risk SKUs before they become a problem.
        </div>
        <div className="action-btns">
          <button className="action-btn-primary">Run margin report</button>
          <button className="action-btn-ghost">Schedule for Monday</button>
        </div>
      </div>

      <div className="insight-callout">
        Pro tip: if any two of the five daily signals are red on the same day, escalate to a same-day team review — that combination is the strongest early predictor of a revenue-at-risk week.
      </div>

      <div className="suggestions">
        <button className="suggestion-pill visible">Set up automated daily digest</button>
        <button className="suggestion-pill visible">Build anomaly alerts for return rate</button>
        <button className="suggestion-pill visible">Create next week's promo calendar</button>
      </div>
    </>
  )
}
