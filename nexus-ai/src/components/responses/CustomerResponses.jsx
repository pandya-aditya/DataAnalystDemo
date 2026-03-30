import { InlineChart } from './shared'

const TICKET_VOLUME_CONFIG = {
  type: 'bar',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Tickets',
        data: [112, 126, 141, 158, 149, 173, 162],
        backgroundColor: ['#52C97A', '#52C97A', '#E8C547', '#E8C547', '#E8C547', '#E05252', '#E8C547'],
        borderRadius: 6,
      },
    ],
  },
  options: {
    plugins: { legend: { display: false } },
    scales: {
      y: { ticks: { callback: (v) => `${v}` } },
    },
  },
}

export function CustomerResponse1() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here’s what’s driving support volume this week. The spike is concentrated in shipping status and returns timing — both are good candidates for self-serve deflection.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="Ticket volume (last 7 days)"
          config={TICKET_VOLUME_CONFIG}
        />
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Top ticket drivers">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Share</th>
                <th>Trend</th>
                <th>Deflection</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Where is my order?</td>
                <td>34%</td>
                <td className="cell-amber">↑</td>
                <td className="cell-green">High</td>
              </tr>
              <tr>
                <td>Returns timeline</td>
                <td>21%</td>
                <td className="cell-amber">↑</td>
                <td className="cell-green">High</td>
              </tr>
              <tr>
                <td>Promo / discount issues</td>
                <td>14%</td>
                <td className="cell-amber">→</td>
                <td className="cell-amber">Medium</td>
              </tr>
              <tr>
                <td>Damaged / wrong item</td>
                <td>9%</td>
                <td className="cell-amber">→</td>
                <td className="cell-red">Low</td>
              </tr>
              <tr>
                <td>Account / login</td>
                <td>7%</td>
                <td className="cell-green">↓</td>
                <td className="cell-amber">Medium</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Top 3 deflection opportunities</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Tracking</span>
            <span className="action-status">Ready</span>
          </div>
          <div className="action-card-title">Proactive “Where is my order?” updates</div>
          <div className="action-card-desc">Send SMS/email at label created, in transit, out for delivery, delivered + exception handling.</div>
        </div>
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Returns</span>
            <span className="action-status">Ready</span>
          </div>
          <div className="action-card-title">Returns status page + timelines</div>
          <div className="action-card-desc">Single page: eligibility, steps, and “what to expect” dates; link from order status.</div>
        </div>
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Help Center</span>
            <span className="action-status">Ready</span>
          </div>
          <div className="action-card-title">Discount troubleshooting flow</div>
          <div className="action-card-desc">Common causes (stacking, exclusions, expiration) + one-click “apply best code” guidance.</div>
        </div>
      </div>
    </>
  )
}

export function CustomerResponse2() {
  return (
    <>
      <div className="ai-text">
        <p>
          Drafted a tight macro + automation set to cut handle time and deflect the highest-volume reasons. These are optimized for clarity and “next action” — the fastest path to resolution.
        </p>
      </div>

      <div className="response-section-title">Macro pack (5)</div>
      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Support macros">
            <thead>
              <tr>
                <th>Macro</th>
                <th>Use case</th>
                <th>Expected impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>WISMO — in transit</td>
                <td>Customer asks for status; package moving normally</td>
                <td className="cell-green">-30s AHT</td>
              </tr>
              <tr>
                <td>WISMO — exception</td>
                <td>Carrier delay, address issue, or weather exception</td>
                <td className="cell-green">-45s AHT</td>
              </tr>
              <tr>
                <td>Returns — timeline & next steps</td>
                <td>“When will I get my refund?”</td>
                <td className="cell-green">-35s AHT</td>
              </tr>
              <tr>
                <td>Discount — doesn’t apply</td>
                <td>Code invalid / excluded items / stacking</td>
                <td className="cell-amber">-25s AHT</td>
              </tr>
              <tr>
                <td>Damaged / wrong item</td>
                <td>Collect photos + trigger replacement workflow</td>
                <td className="cell-amber">-20s AHT</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Automation rules (3)</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Gorgias</span>
            <span className="action-status">Rule</span>
          </div>
          <div className="action-card-title">Auto-tag WISMO + route to queue</div>
          <div className="action-card-desc">If subject/body contains tracking keywords, tag `wismo` and assign to “Shipping” queue.</div>
        </div>
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Gorgias</span>
            <span className="action-status">Rule</span>
          </div>
          <div className="action-card-title">Self-serve link first response</div>
          <div className="action-card-desc">For WISMO/returns intents, reply with tracking/returns portal link before an agent touches it.</div>
        </div>
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Gorgias</span>
            <span className="action-status">Rule</span>
          </div>
          <div className="action-card-title">SLA watch + escalation</div>
          <div className="action-card-desc">If VIP/customer sentiment high and no reply in 2h, escalate and notify lead.</div>
        </div>
      </div>
    </>
  )
}

export function CustomerResponse3() {
  return (
    <>
      <div className="ai-text">
        <p><strong>Weekly CX report (draft)</strong></p>
        <p>
          Support volume increased mid-week and peaked over the weekend. The mix shifted toward shipping status and returns timing, which suggests we can reduce load with proactive comms and clearer self-serve experiences.
        </p>
        <p>
          Biggest risks: weekend backlog growth, exception shipments, and discounts creating confusion at checkout. Biggest win: we can remove repeat questions with targeted help-center content and automated first responses.
        </p>
      </div>

      <div className="response-section-title">Next actions</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Tracking</span>
            <span className="action-status">This week</span>
          </div>
          <div className="action-card-title">Enable proactive shipment updates</div>
          <div className="action-card-desc">Reduce WISMO tickets by 10–15% with event-driven notifications + exceptions messaging.</div>
        </div>
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Returns</span>
            <span className="action-status">This week</span>
          </div>
          <div className="action-card-title">Publish “refund timeline” help article</div>
          <div className="action-card-desc">Set expectations; link it from order status and macros for consistent messaging.</div>
        </div>
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Ops</span>
            <span className="action-status">Ongoing</span>
          </div>
          <div className="action-card-title">Monitor weekend backlog and SLA</div>
          <div className="action-card-desc">Add a weekend coverage checkpoint; auto-escalate VIP/high-sentiment tickets.</div>
        </div>
      </div>
    </>
  )
}

