import { InlineChart } from './shared'

// ─── Step 1: Top operational risks this week ─────────────────────────────────

const FULFILLMENT_CONFIG = {
  type: 'bar',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'On-time %',
        data: [96, 94, 91, 88, 85, 79, 82],
        backgroundColor: (ctx) => {
          const v = ctx.raw
          return v >= 92 ? '#52C97A' : v >= 86 ? '#E8C547' : '#E05252'
        },
        borderRadius: 4,
      },
    ],
  },
  options: {
    scales: {
      y: { ticks: { callback: (v) => `${v}%` }, min: 70, max: 100 },
    },
  },
}

export function OpsResponse1({ onExpandChart }) {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the operational risk snapshot for this week. Fulfillment SLA is deteriorating through the week — on-time rate dropped to 79% on Saturday, well below the 90% SLA target. That's the most urgent issue.
        </p>
        <p>
          Two other risks need attention this week: a small cluster of high-velocity SKUs are within 7 days of stockout, and returns are trending up on a specific product group.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="On-time fulfillment rate (this week)"
          onExpand={() => onExpandChart?.('fulfillment')}
          config={FULFILLMENT_CONFIG}
        />
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Ops risk summary">
            <thead>
              <tr>
                <th>Risk area</th>
                <th>Severity</th>
                <th>Current signal</th>
                <th>Days to impact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fulfillment SLA — on-time rate below target</td>
                <td className="cell-red">High</td>
                <td>79% (target: ≥90%)</td>
                <td className="cell-red">Now</td>
                <td><span className="status-badge status-alert">Action</span></td>
              </tr>
              <tr>
                <td>Stockout risk — 4 high-velocity SKUs</td>
                <td className="cell-red">High</td>
                <td>≤7 days of cover</td>
                <td className="cell-red">3–7 days</td>
                <td><span className="status-badge status-alert">Urgent</span></td>
              </tr>
              <tr>
                <td>Returns spike — outerwear SKU cluster</td>
                <td className="cell-amber">Medium</td>
                <td>+38% WoW return rate</td>
                <td className="cell-amber">14 days (CSAT impact)</td>
                <td><span className="status-badge status-ok">Watch</span></td>
              </tr>
              <tr>
                <td>Carrier variability — USPS zone 6–8</td>
                <td className="cell-amber">Medium</td>
                <td>+1.4 day avg delay</td>
                <td className="cell-amber">Ongoing</td>
                <td><span className="status-badge status-ok">Monitor</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">What to do first</div>
      <div className="action-cards">
        <div className="action-card visible alert">
          <div className="action-card-header">
            <span className="platform-badge">Fulfillment</span>
            <span className="action-type-pill alert">Today</span>
            <span className="action-title">Triage Saturday backlog + add picking capacity</span>
          </div>
          <div className="action-description">
            Prioritize premium and high-LTV orders in the backlog. Send proactive delay notifications to affected customers. Add 2 picking shifts over the next 3 days to clear the backlog.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Open fulfillment queue</button>
            <button className="action-btn-ghost">Set delay notifications</button>
          </div>
        </div>
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Inventory</span>
            <span className="action-type-pill pending">Today</span>
            <span className="action-title">Expedite reorder for 4 stockout-risk SKUs</span>
          </div>
          <div className="action-description">
            SKUs with &lt;7 days cover: raise reorder points by 40% and place expedited POs. Estimated cost of stockout: $18k+ in lost revenue based on current velocity.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Draft POs</button>
            <button className="action-btn-ghost">View SKU list</button>
          </div>
        </div>
      </div>

      <div className="suggestions">
        <button className="suggestion-pill visible">Build 10-day reorder + fulfillment plan</button>
        <button className="suggestion-pill visible">Investigate return reasons for outerwear</button>
        <button className="suggestion-pill visible">Compare carrier performance by zone</button>
      </div>
    </>
  )
}

// ─── Step 2: 10-day ops plan ─────────────────────────────────────────────────

export function OpsResponse2() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the 10-day inventory reorder and fulfillment plan, including alert thresholds to catch problems before they escalate.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="10-day ops plan">
            <thead>
              <tr>
                <th>Days</th>
                <th>Action</th>
                <th>Owner</th>
                <th>Success criteria</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1–2</td>
                <td>Place expedited POs for 4 stockout-risk SKUs; clear Saturday backlog</td>
                <td>Inventory Planner + Fulfillment</td>
                <td className="cell-green">POs confirmed; on-time rate &gt;88% by Day 2</td>
              </tr>
              <tr>
                <td>2–4</td>
                <td>Raise reorder points +40% for Winter Collection; confirm carrier pickups for peak days</td>
                <td>Inventory Planner + 3PL</td>
                <td className="cell-green">All high-velocity SKUs at ≥14 days cover</td>
              </tr>
              <tr>
                <td>3–5</td>
                <td>Update PDP sizing + fit guidance for outerwear SKU cluster to reduce returns</td>
                <td>Merch + CX</td>
                <td className="cell-green">Return rate trending back toward baseline by Day 7</td>
              </tr>
              <tr>
                <td>5–7</td>
                <td>Receiving plan for expedited POs; QC and put-away for new stock</td>
                <td>Warehouse</td>
                <td className="cell-green">New stock live and available to sell</td>
              </tr>
              <tr>
                <td>7–10</td>
                <td>Review carrier performance by zone; renegotiate USPS Zone 6–8 or route via UPS Ground</td>
                <td>Ops Manager</td>
                <td className="cell-green">Avg delay reduced by 0.5+ days on affected zones</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Alert thresholds</div>
      <div className="action-cards">
        <div className="action-card visible alert">
          <div className="action-card-header">
            <span className="platform-badge">Inventory</span>
            <span className="action-type-pill alert">Critical</span>
            <span className="action-title">Stockout forecast alert — &lt;7 days cover</span>
          </div>
          <div className="action-description">
            Alert triggers when any Winter Collection SKU drops below 7 days projected cover. Escalates to Inventory Planner + Ops Manager via Slack.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Configure alert</button>
            <button className="action-btn-ghost">Adjust threshold</button>
          </div>
        </div>
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Fulfillment</span>
            <span className="action-type-pill pending">High</span>
            <span className="action-title">SLA breach alert — on-time rate &lt;87%</span>
          </div>
          <div className="action-description">
            Alert triggers when on-time fulfillment rate drops below 87% on any day. Auto-creates a fulfillment triage ticket and notifies the CX team to prepare delay comms.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Configure alert</button>
            <button className="action-btn-ghost">Skip</button>
          </div>
        </div>
      </div>

      <div className="suggestions">
        <button className="suggestion-pill visible">Draft leadership update</button>
        <button className="suggestion-pill visible">Generate expedited PO drafts</button>
        <button className="suggestion-pill visible">Set up Slack fulfillment bot</button>
      </div>
    </>
  )
}

// ─── Step 3: Leadership update ───────────────────────────────────────────────

export function OpsResponse3() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the leadership update — concise, with the risks clearly stated, mitigations already underway, and the two items that need approval from leadership to execute fully.
        </p>
      </div>

      <div className="response-section-title response-section-title-taken">What we've done</div>
      <div className="auto-actions">
        <div className="auto-action-item">
          <div className="auto-action-text">Placed expedited POs for 4 stockout-risk SKUs; expected receiving in 4–5 days.</div>
          <div className="auto-action-time">Done</div>
        </div>
        <div className="auto-action-item">
          <div className="auto-action-text">Triaged Saturday fulfillment backlog: prioritized premium orders, sent proactive delay notifications to 340 customers.</div>
          <div className="auto-action-time">Done</div>
        </div>
        <div className="auto-action-item">
          <div className="auto-action-text">Configured stockout forecast alert (&lt;7 days cover) and fulfillment SLA alert (&lt;87% on-time) for real-time monitoring.</div>
          <div className="auto-action-time">Done</div>
        </div>
      </div>

      <div className="response-section-title response-section-title-permission">What we need</div>
      <div className="intervention-item">
        <div className="intervention-header">
          Approve expedited shipping cost cap (+$3,200 this week)
          <span className="permission-pill">Approval</span>
        </div>
        <div className="intervention-desc">
          Expedited POs carry a premium freight charge of ~$3,200 above standard. The estimated cost of stockout on those 4 SKUs is $18k+ in lost revenue. The ROI is clear but we need budget sign-off.
        </div>
        <div className="action-btns">
          <button className="action-btn-primary">Approve</button>
          <button className="action-btn-ghost">Request more detail</button>
        </div>
      </div>

      <div className="intervention-item">
        <div className="intervention-header">
          Approve temporary staffing for peak fulfillment (3 days)
          <span className="permission-pill">Approval</span>
        </div>
        <div className="intervention-desc">
          Clearing the backlog and hitting SLA through the weekend requires 2 additional picking shifts over the next 3 days. Estimated cost: $1,800. Without this, on-time rate stays below target through Friday.
        </div>
        <div className="action-btns">
          <button className="action-btn-primary">Approve</button>
          <button className="action-btn-ghost">Not now</button>
        </div>
      </div>

      <div className="suggestions">
        <button className="suggestion-pill visible">Schedule fulfillment review for Friday</button>
        <button className="suggestion-pill visible">Generate carrier rate comparison</button>
        <button className="suggestion-pill visible">Draft customer delay email template</button>
      </div>
    </>
  )
}
