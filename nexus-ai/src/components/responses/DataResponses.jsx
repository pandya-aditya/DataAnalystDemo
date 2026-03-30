import { InlineChart } from './shared'

// ─── Step 1: KPI definitions + metric layer ──────────────────────────────────

export function DataResponse1() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here are the 10 KPIs that matter most for your business model — along with a clean metric definition layer to ensure every team is calculating them the same way.
        </p>
        <p>
          The most common sources of metric drift are: CAC attribution model mismatches, revenue gross-vs-net confusion, and LTV window inconsistencies. The definitions below lock those down.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="KPI definitions">
            <thead>
              <tr>
                <th>#</th>
                <th>KPI</th>
                <th>Category</th>
                <th>Key edge case</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Revenue (Gross / Net)</td>
                <td>Profitability</td>
                <td>Exclude refunds, tax, shipping from net; define refund lag handling</td>
                <td><span className="status-badge status-alert">Critical</span></td>
              </tr>
              <tr>
                <td>2</td>
                <td>Gross Margin</td>
                <td>Profitability</td>
                <td>Include allocated shipping + packaging in COGS</td>
                <td><span className="status-badge status-alert">Critical</span></td>
              </tr>
              <tr>
                <td>3</td>
                <td>Contribution Margin</td>
                <td>Profitability</td>
                <td>Deduct variable paid media spend; exclude fixed overhead</td>
                <td><span className="status-badge status-alert">Critical</span></td>
              </tr>
              <tr>
                <td>4</td>
                <td>Conversion Rate</td>
                <td>Acquisition</td>
                <td>Session vs user-level; bot filter; exclude internal traffic</td>
                <td><span className="status-badge status-alert">Critical</span></td>
              </tr>
              <tr>
                <td>5</td>
                <td>AOV</td>
                <td>Acquisition</td>
                <td>Use net revenue / completed orders; exclude cancelled</td>
                <td><span className="status-badge status-ok">High</span></td>
              </tr>
              <tr>
                <td>6</td>
                <td>CAC (blended + by channel)</td>
                <td>Acquisition</td>
                <td>Allocate spend to acquisition cohort; define multi-touch vs last-touch</td>
                <td><span className="status-badge status-alert">Critical</span></td>
              </tr>
              <tr>
                <td>7</td>
                <td>LTV (cohort-based)</td>
                <td>Retention</td>
                <td>Define window (30/60/90d); censor open cohorts; include margin for LTV:CAC</td>
                <td><span className="status-badge status-alert">Critical</span></td>
              </tr>
              <tr>
                <td>8</td>
                <td>Repeat Purchase Rate</td>
                <td>Retention</td>
                <td>Tie to acquisition cohort; define "repeat" window clearly</td>
                <td><span className="status-badge status-ok">High</span></td>
              </tr>
              <tr>
                <td>9</td>
                <td>Refund / Return Rate</td>
                <td>Ops / Quality</td>
                <td>Tie return to original order; handle partial returns + exchanges</td>
                <td><span className="status-badge status-ok">High</span></td>
              </tr>
              <tr>
                <td>10</td>
                <td>On-time Fulfillment Rate</td>
                <td>Ops</td>
                <td>Define "on-time" by carrier scan; exclude pre-announced delays</td>
                <td><span className="status-badge status-ok">High</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Proposed actions</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">dbt</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Create a metrics/semantic definition layer</span>
          </div>
          <div className="action-description">
            Codify KPI definitions in a dbt metrics layer or semantic layer (Looker, Cube, or similar) so every team computes the same numbers.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Draft metrics YAML</button>
            <button className="action-btn-ghost">Map to sources</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Docs</span>
            <span className="action-type-pill done">Ready</span>
            <span className="action-title">KPI definition pack</span>
          </div>
          <div className="action-description">
            Definitions and edge cases are consolidated for the top 10 KPIs to prevent drift (attribution, gross vs net, LTV windows).
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Export definitions</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Step 2: Automated data quality checks ───────────────────────────────────

export function DataResponse2() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here are 6 automated data quality checks that cover the most common failure modes for this KPI layer — freshness, volume, nulls, duplicates, referential integrity, and spend coverage.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="DQ checks">
            <thead>
              <tr>
                <th>#</th>
                <th>Check</th>
                <th>Target table(s)</th>
                <th>Alert threshold</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Freshness</td>
                <td>orders, sessions, ad_spend</td>
                <td className="cell-red">Updated &gt;2× expected delay</td>
                <td><span className="status-badge status-alert">Critical</span></td>
              </tr>
              <tr>
                <td>2</td>
                <td>Volume anomaly</td>
                <td>orders, events</td>
                <td className="cell-red">±3σ vs 28-day rolling baseline</td>
                <td><span className="status-badge status-alert">Critical</span></td>
              </tr>
              <tr>
                <td>3</td>
                <td>Required-field null rate</td>
                <td>orders, order_lines</td>
                <td className="cell-amber">order_id / customer_id / revenue null &gt;0.5%</td>
                <td><span className="status-badge status-ok">High</span></td>
              </tr>
              <tr>
                <td>4</td>
                <td>Duplicate order IDs</td>
                <td>orders</td>
                <td className="cell-red">Any duplicates (0 tolerance)</td>
                <td><span className="status-badge status-alert">Critical</span></td>
              </tr>
              <tr>
                <td>5</td>
                <td>Referential integrity</td>
                <td>order_lines → orders</td>
                <td className="cell-amber">Join coverage &lt;99.5%</td>
                <td><span className="status-badge status-ok">High</span></td>
              </tr>
              <tr>
                <td>6</td>
                <td>Spend-to-order attribution coverage</td>
                <td>ad_spend → orders</td>
                <td className="cell-amber">Coverage drops &gt;5 pts vs prior day</td>
                <td><span className="status-badge status-ok">High</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Implementation</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">dbt</span>
            <span className="action-type-pill pending">Recommended</span>
            <span className="action-title">dbt tests for checks 1–5</span>
          </div>
          <div className="action-description">
            Use <span className="code-highlight">dbt_expectations</span> for volume and null checks; <span className="code-highlight">unique</span> + <span className="code-highlight">not_null</span> for order_id; <span className="code-highlight">relationships</span> for FK coverage. Run on every pipeline execution.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Generate dbt test YAML</button>
            <button className="action-btn-ghost">Use Great Expectations instead</button>
          </div>
        </div>
        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Slack / PagerDuty</span>
            <span className="action-type-pill done">Alert routing</span>
            <span className="action-title">Alert tiers by severity</span>
          </div>
          <div className="action-description">
            Critical checks (1, 2, 4) → PagerDuty + #data-alerts. High checks (3, 5, 6) → Slack #data-quality only. Auto-link to failing query for fast triage.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Configure routing</button>
            <button className="action-btn-ghost">Skip</button>
          </div>
        </div>
      </div>

    </>
  )
}

// ─── Step 3: Dashboard outline — exec vs operator ────────────────────────────

const RETENTION_CONFIG = {
  type: 'line',
  data: {
    labels: ['Week 0', 'Week 1', 'Week 2', 'Week 4', 'Week 8', 'Week 12'],
    datasets: [
      {
        label: 'Jan cohort',
        data: [100, 62, 48, 39, 31, 27],
        borderColor: '#52C97A',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Feb cohort',
        data: [100, 58, 44, 36, 29, null],
        borderColor: '#E8C547',
        tension: 0.3,
        fill: false,
      },
    ],
  },
  options: {
    scales: {
      y: { ticks: { callback: (v) => `${v}%` }, max: 110 },
    },
  },
}

export function DataResponse3({ onExpandChart }) {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's a two-view dashboard architecture — one for executives (weekly strategic pulse) and one for operators (daily action-oriented view). They share the same underlying metric layer but surface very different decisions.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="Retention by cohort (sample — operator view)"
          onExpand={() => onExpandChart?.('retention')}
          config={RETENTION_CONFIG}
        />
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Dashboard views">
            <thead>
              <tr>
                <th>View</th>
                <th>Audience</th>
                <th>Cadence</th>
                <th>Key sections</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Executive</strong></td>
                <td>CEO, CFO, VP</td>
                <td>Weekly</td>
                <td>Revenue, Gross/Contribution Margin, CAC, LTV, ROAS, Conversion, Retention — plus "what changed and why" (top 3 drivers) and top risks</td>
              </tr>
              <tr>
                <td><strong>Operator</strong></td>
                <td>Marketing, Ops, Merch, Support</td>
                <td>Daily</td>
                <td>Channel CAC/ROAS by campaign + creative; funnel diagnostics (PDP → ATC → checkout → purchase); inventory/fulfillment SLA; returns by SKU; alerts + next-best-actions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Design principles</div>
      <div className="action-cards">
        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Exec view</span>
            <span className="action-type-pill done">Best practice</span>
            <span className="action-title">Lead with narrative, not raw numbers</span>
          </div>
          <div className="action-description">
            Every exec dashboard page should open with a 2-sentence "what changed and why" summary before showing charts. Executives make decisions; they don't want to hunt for the insight.
          </div>
        </div>
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Operator view</span>
            <span className="action-type-pill pending">Best practice</span>
            <span className="action-title">Surface anomalies + recommended actions inline</span>
          </div>
          <div className="action-description">
            Operators need to act fast. Embed anomaly flags directly in the funnel and channel views — not in a separate "alerts" tab — so the insight and the decision live together.
          </div>
        </div>
        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Tooling</span>
            <span className="action-type-pill done">Ready</span>
            <span className="action-title">Single semantic layer, two surfaces</span>
          </div>
          <div className="action-description">
            Recommended: dbt semantic layer → Looker/Metabase for operator workflows; same layer → Notion/Hex for executive narrative. Avoid maintaining two data models.
          </div>
        </div>
      </div>
    </>
  )
}
