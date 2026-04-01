import { InlineChart } from './shared'

// ─── Step 1: Q4 margin erosion — paid vs organic vs new SKUs ─────────────────

const Q4_MARGIN_EROSION_CONFIG = {
  type: 'bar',
  data: {
    labels: ['October', 'November', 'December'],
    datasets: [
      {
        type: 'bar',
        label: 'Organic customer gross margin',
        data: [49, 48, 47],
        backgroundColor: '#52C97A',
        borderRadius: 4,
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'Paid-acquired customer gross margin',
        data: [41, 36, 31],
        backgroundColor: '#E05252',
        borderRadius: 4,
        yAxisID: 'y',
      },
      {
        type: 'bar',
        label: 'New SKU blended gross margin',
        data: [38, 34, 31],
        backgroundColor: '#E8C547',
        borderRadius: 4,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: 'Meta monthly spend',
        data: [142000, 198000, 231000],
        borderColor: '#7C6CF6',
        backgroundColor: '#7C6CF6',
        pointRadius: 3,
        tension: 0.25,
        fill: false,
        yAxisID: 'y1',
      },
      {
        type: 'line',
        label: 'Company GM target (42%)',
        data: [42, 42, 42],
        borderColor: 'rgba(232, 197, 71, 0.9)',
        borderDash: [6, 6],
        pointRadius: 0,
        tension: 0,
        fill: false,
        yAxisID: 'y',
      },
    ],
  },
  options: {
    interaction: { mode: 'index', intersect: false },
    scales: {
      y: {
        min: 28,
        max: 52,
        ticks: { callback: (v) => `${v}%` },
      },
      y1: {
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { callback: (v) => `$${Math.round(v / 1000)}k` },
      },
    },
  },
}

export function DataResponse1({ onExpandChart }) {
  return (
    <>
      <div className="ai-text">
        <p>
          Both are partially right — but your CMO has the larger problem.
        </p>
        <p>
          Paid acquisition (primarily Meta) drove 61% of new customer revenue in Q4, but those customers carried a 34% lower LTV-to-CAC ratio than your organic cohort, meaning you bought growth at a loss. Your 3 new SKUs are also running 11% above their COGS forecast, which accounts for roughly 1.4 of the 4 margin points lost. The remaining 2.6 points came from paid channel inefficiency — inflated CPMs in November and December and a drop in return purchase rate among paid-acquired customers.
        </p>
        <p>
          Your core business is healthy. The problem is allocation, not the business model.
        </p>
        <p>
          <strong>Recommended next steps:</strong>
        </p>
        <p>
          - Reduce Meta top-of-funnel spend by 20–25% in Q1 and reallocate toward Klaviyo email flows targeting your existing high-LTV segment, which converts at 3.1x the margin of paid new customers.
        </p>
        <p>
          - Put a 60-day review on the 3 underperforming SKUs. Either renegotiate supplier pricing or discontinue the lowest-margin variant.
        </p>
        <p>
          - Set a hard CAC payback threshold of 5 months before approving any paid spend increase in Q1. Your Google Drive OKR doc specifies a 4.5-month target — you're currently at 7.2.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="Q4 Margin Erosion by Source — Paid vs. Organic vs. New SKUs"
          onExpand={() => onExpandChart?.('q4_margin_erosion')}
          config={Q4_MARGIN_EROSION_CONFIG}
        />
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Q4 margin erosion table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Organic GM%</th>
                <th>Paid GM%</th>
                <th>New SKU GM%</th>
                <th>Meta spend</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>October</td>
                <td className="cell-green">49%</td>
                <td className="cell-amber">41%</td>
                <td className="cell-amber">38%</td>
                <td>$142k</td>
              </tr>
              <tr>
                <td>November</td>
                <td className="cell-green">48%</td>
                <td className="cell-red">36%</td>
                <td className="cell-red">34%</td>
                <td>$198k</td>
              </tr>
              <tr>
                <td>December</td>
                <td className="cell-green">47%</td>
                <td className="cell-red">31%</td>
                <td className="cell-red">31%</td>
                <td>$231k</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Recommended next steps</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Gmail</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Draft board summary email</span>
          </div>
          <div className="action-description">
            Pre-draft a concise executive summary addressed to your CMO and VP of Finance with the key findings and recommended Q1 reallocation.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Approve</button>
            <button className="action-btn-ghost">Not now</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Slack</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Post to #marketing-leadership</span>
          </div>
          <div className="action-description">
            Send a formatted summary of the CAC inefficiency findings so marketing leadership can align before Q1 planning.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Approve</button>
            <button className="action-btn-ghost">Not now</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Klaviyo</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Flag high-LTV segment</span>
          </div>
          <div className="action-description">
            Tag and surface your top organic LTV segment so your email team can build a Q1 retention + upsell flow against it immediately.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Approve</button>
            <button className="action-btn-ghost">Not now</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Pipelines</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Suggested follow-ups</span>
          </div>
          <div className="action-description">
            Next questions that will sharpen the Q1 plan.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Which specific Meta campaigns are driving the lowest-quality customers, and what should we do with them?</button>
            <button className="action-btn-ghost">Can you model what Q1 margin looks like if we reallocate 25% of paid spend to Klaviyo retention flows?</button>
            <button className="action-btn-ghost">Which of our new SKUs should we cut, and what's the projected margin recovery if we do?</button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Step 2: Q1 margin projection — baseline vs reallocation ─────────────────

const Q1_MARGIN_PROJECTION_CONFIG = {
  type: 'line',
  data: {
    labels: Array.from({ length: 13 }, (_, i) => `Week ${i + 1}`),
    datasets: [
      {
        label: 'Current paid-heavy plan margin trajectory (baseline)',
        data: [33.0, 33.0, 33.1, 33.1, 33.2, 33.2, 33.3, 33.4, 33.4, 33.5, 33.6, 33.7, 34.0],
        borderColor: '#E8C547',
        backgroundColor: 'rgba(232, 197, 71, 0.18)',
        tension: 0.25,
        fill: true,
        pointRadius: 0,
      },
      {
        label: 'Projected margin with Klaviyo shift',
        data: [33.0, 33.5, 34.5, 35.5, 36.3, 37.0, 37.5, 38.0, 38.3, 38.6, 38.7, 38.8, 38.8],
        borderColor: '#52C97A',
        backgroundColor: 'rgba(82, 201, 122, 0.18)',
        tension: 0.25,
        fill: true,
        pointRadius: 0,
      },
      {
        label: 'Company gross margin target = 42%',
        data: Array.from({ length: 13 }, () => 42),
        borderColor: 'rgba(232, 197, 71, 0.9)',
        borderDash: [6, 6],
        tension: 0,
        fill: false,
        pointRadius: 0,
      },
      {
        label: 'Realistic Q1 ceiling under reallocation = 38.5%',
        data: Array.from({ length: 13 }, () => 38.5),
        borderColor: 'rgba(124, 108, 246, 0.9)',
        borderDash: [6, 6],
        tension: 0,
        fill: false,
        pointRadius: 0,
      },
    ],
  },
  options: {
    interaction: { mode: 'index', intersect: false },
    scales: {
      y: {
        min: 30,
        max: 50,
        ticks: { callback: (v) => `${v}%` },
      },
    },
  },
}

export function DataResponse2({ onExpandChart }) {
  return (
    <>
      <div className="ai-text">
        <p>
          If you reallocate 25% of your current Meta budget (~$145K quarterly) into Klaviyo retention flows targeting your top organic LTV segment, the model projects a Q1 blended gross margin improvement of 3.1 to 3.8 percentage points — nearly fully recovering the 4-point decline you saw in Q4.
        </p>
        <p>
          Here is what drives that recovery: Klaviyo retention flows generate revenue at near-zero marginal CAC. Your existing high-LTV segment has an average 68% gross margin on repurchase orders versus 31% on net-new paid customers. Shifting revenue mix even modestly toward retention significantly moves the blended margin. The $145K freed from Meta would have generated approximately $390K in revenue at the paid cohort's current efficiency — but at a 31% margin. That same $145K invested in Klaviyo infrastructure and offers is projected to generate $480–$520K in incremental retention revenue at a 62% margin, based on your current flow conversion benchmarks and segment size.
        </p>
        <p>
          The one risk: this only holds if your retention segment is not already over-messaged. Your Google Drive brand guidelines flag an 8-email-per-month contact cap — current flow cadence is at 5, so you have room.
        </p>
        <p>
          <strong>Recommended next steps:</strong>
        </p>
        <p>
          - Approve the Klaviyo flow build for the high-LTV retention segment this week — the Q1 revenue window is narrow.
        </p>
        <p>
          - Brief your Meta buyer to shift the freed budget to retargeting existing customers rather than zeroing it out, which preserves some paid efficiency at lower CPMs.
        </p>
        <p>
          - Revisit this model in week 4 of Q1 with actual flow conversion data to confirm the margin trajectory.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="Projected Q1 Gross Margin % — Current Plan vs. Reallocation Scenario"
          onExpand={() => onExpandChart?.('q1_margin_projection')}
          config={Q1_MARGIN_PROJECTION_CONFIG}
        />
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Q1 margin milestones">
            <thead>
              <tr>
                <th>Milestone</th>
                <th>Baseline GM%</th>
                <th>Reallocation GM%</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Week 1</td>
                <td className="cell-amber">33.0%</td>
                <td className="cell-amber">33.0%</td>
                <td>Starting point</td>
              </tr>
              <tr>
                <td>Week 3</td>
                <td className="cell-amber">33.1%</td>
                <td className="cell-green">34.5%</td>
                <td>Klaviyo flows go live</td>
              </tr>
              <tr>
                <td>Week 6</td>
                <td className="cell-amber">33.2%</td>
                <td className="cell-green">37.0%</td>
                <td>Ramp phase</td>
              </tr>
              <tr>
                <td>Week 10</td>
                <td className="cell-amber">33.5%</td>
                <td className="cell-green">38.6%</td>
                <td>Stabilizes</td>
              </tr>
              <tr>
                <td>Week 13</td>
                <td className="cell-amber">34.0%</td>
                <td className="cell-green">38.8%</td>
                <td>End of quarter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Recommended next steps</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Klaviyo</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Draft flow brief</span>
          </div>
          <div className="action-description">
            Auto-generate a Klaviyo retention flow brief (segment definition, recommended send cadence, offer logic) as a Google Doc shareable with your email team.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Approve</button>
            <button className="action-btn-ghost">Not now</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Gmail</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Email the media buyer</span>
          </div>
          <div className="action-description">
            Send a pre-drafted email to reduce top-of-funnel prospecting spend by 25% and shift toward retargeting, with supporting rationale attached.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Approve</button>
            <button className="action-btn-ghost">Not now</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Slack</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Notify the retention team</span>
          </div>
          <div className="action-description">
            Post the projected margin uplift and prompt the team to begin flow setup so no time is lost in the Q1 window.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Approve</button>
            <button className="action-btn-ghost">Not now</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Pipelines</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Suggested follow-ups</span>
          </div>
          <div className="action-description">
            Next questions to pressure-test the plan.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">What offer strategy should we use for the Klaviyo retention flows — discount, free shipping, or loyalty points?</button>
            <button className="action-btn-ghost">How does this margin recovery change if our new SKU COGS problem isn't fixed in Q1?</button>
            <button className="action-btn-ghost">Which customer segments should we prioritize for the retention flows to maximize margin impact?</button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Step 3: Q1 scenarios — COGS unresolved vs SKU swap ──────────────────────

const Q1_SCENARIOS_LABELS = [
  'Scenario A — Reallocation + COGS fixed',
  'Scenario B — Reallocation only, COGS unresolved',
  'Scenario C — Reallocation + SKU swap in flows, COGS unresolved',
  'Scenario D — No changes made (baseline)',
]

const Q1_SCENARIOS_CONFIG = {
  type: 'bar',
  data: {
    labels: Q1_SCENARIOS_LABELS,
    datasets: [
      {
        label: 'Projected Q1 blended gross margin',
        data: [38.5, 35.2, 37.8, 33.5],
        backgroundColor: ['#52C97A', '#E8C547', '#7C6CF6', '#6B7280'],
        borderRadius: 6,
      },
      {
        type: 'line',
        label: 'Company gross margin target = 42%',
        data: Q1_SCENARIOS_LABELS.map((y) => ({ x: 42, y })),
        borderColor: 'rgba(232, 197, 71, 0.9)',
        borderDash: [6, 6],
        pointRadius: 0,
        showLine: true,
      },
    ],
  },
  options: {
    indexAxis: 'y',
    interaction: { mode: 'nearest', intersect: false },
    plugins: { legend: { position: 'bottom' } },
    scales: {
      x: {
        min: 30,
        max: 50,
        ticks: { callback: (v) => `${v}%` },
      },
    },
  },
}

export function DataResponse3({ onExpandChart }) {
  return (
    <>
      <div className="ai-text">
        <p>
          If the new SKU COGS overrun is not resolved in Q1, the Klaviyo reallocation still improves your margin — but the recovery is cut roughly in half.
        </p>
        <p>
          Instead of recovering 3.1–3.8 points, you recover approximately 1.5–2.1 points, landing your Q1 blended gross margin in the 34–36% range versus the 38–39% range in the clean scenario. The reason is compounding: your new SKUs are being promoted in some of the same Klaviyo retention flows we are proposing to build. If those SKUs carry 31% margins and your flow offers are anchored to them, the retention revenue you generate is partially margin-diluted before it even hits the blended rate.
        </p>
        <p>
          The practical implication is that the Klaviyo strategy and the SKU decision are not independent. You need to do one of three things before the flows launch: redirect flow offers away from the underperforming SKUs toward your highest-margin catalog items, renegotiate COGS on at least the top-volume new SKU, or accept the reduced recovery and plan a Q2 corrective.
        </p>
        <p>
          Of the three, redirecting flow offers to high-margin SKUs is the fastest and costs nothing. Your top 5 SKUs by margin average 58% gross margin — anchoring the retention flows to those alone recovers 2.9 points even with the COGS problem unresolved.
        </p>
        <p>
          <strong>Recommended next steps:</strong>
        </p>
        <p>
          - Immediately audit which SKUs are featured in the planned Q1 Klaviyo flows and swap any underperforming new SKUs for your top-margin catalog items.
        </p>
        <p>
          - Open a supplier renegotiation on your highest-volume new SKU — even a 4-point COGS reduction gets you back to the 38% margin scenario.
        </p>
        <p>
          - Update the Q1 campaign calendar in Google Drive to reflect the SKU swap so the broader team is aligned before flows go live.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="Q1 Projected Gross Margin Recovery — Three Scenarios"
          onExpand={() => onExpandChart?.('q1_scenarios')}
          config={Q1_SCENARIOS_CONFIG}
        />
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Q1 scenarios table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Projected Q1 GM%</th>
                <th>Interpretation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>A</strong> — Reallocation + COGS fixed</td>
                <td className="cell-green">38.5%</td>
                <td>Full recovery scenario</td>
              </tr>
              <tr>
                <td><strong>B</strong> — Reallocation only, COGS unresolved</td>
                <td className="cell-amber">35.2%</td>
                <td>Recovery cut ~in half</td>
              </tr>
              <tr>
                <td><strong>C</strong> — Reallocation + SKU swap in flows (COGS unresolved)</td>
                <td className="cell-green">37.8%</td>
                <td>Fastest path, no budget required</td>
              </tr>
              <tr>
                <td><strong>D</strong> — No changes made (baseline)</td>
                <td className="cell-red">33.5%</td>
                <td>Status quo</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Recommended next steps</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Gmail</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Draft supplier renegotiation email</span>
          </div>
          <div className="action-description">
            Generate a pre-written email requesting a cost review, pre-populated with volume context and a renegotiation target.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Approve</button>
            <button className="action-btn-ghost">Not now</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Google Drive</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Update Q1 campaign calendar</span>
          </div>
          <div className="action-description">
            Flag the SKUs featured in the Q1 Klaviyo campaign calendar and insert a comment recommending the swap to high-margin items.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Approve</button>
            <button className="action-btn-ghost">Not now</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Slack</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Alert the merchandising team</span>
          </div>
          <div className="action-description">
            Send a Slack message summarizing the SKU-margin risk and requesting confirmation of the supplier renegotiation timeline.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Approve</button>
            <button className="action-btn-ghost">Not now</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Pipelines</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Suggested follow-ups</span>
          </div>
          <div className="action-description">
            Next questions to turn the scenario into execution.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Which of our top-margin SKUs should anchor the Q1 retention flows, and how do we structure the offers?</button>
            <button className="action-btn-ghost">Can you build a full Q1 margin forecast with weekly milestones I can present to the leadership team?</button>
            <button className="action-btn-ghost">What does our supplier renegotiation leverage look like — how much volume are we giving them and what's a realistic ask?</button>
          </div>
        </div>
      </div>
    </>
  )
}
