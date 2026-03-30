import { InlineChart } from './shared'

// ─── Step 1: Fraud risk trends + mitigations ─────────────────────────────────

const FRAUD_CONFIG = {
  type: 'line',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Chargeback rate (%)',
        data: [0.41, 0.44, 0.48, 0.61, 0.74, 0.89, 0.82],
        borderColor: '#E05252',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Manual review rate (%)',
        data: [2.1, 2.3, 2.8, 3.4, 4.1, 4.9, 4.6],
        borderColor: '#E8C547',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Approval rate (%)',
        data: [97.2, 97.1, 96.8, 96.4, 95.9, 95.3, 95.5],
        borderColor: '#52C97A',
        tension: 0.3,
        fill: false,
      },
    ],
  },
  options: {
    scales: {
      y: { ticks: { callback: (v) => `${v}%` } },
    },
  },
}

export function RiskResponse1({ onExpandChart }) {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the fraud risk summary for this week. Chargeback rate spiked on Friday and Saturday — more than doubling the Monday baseline. The spike correlates with a burst of high-velocity orders from 3 device fingerprint clusters using mismatched billing/shipping addresses.
        </p>
        <p>
          The good news: the pattern is detectable and the mitigations below are targeted enough to cut losses without damaging approval rates for good customers.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="Chargeback, review, and approval rate (7-day)"
          onExpand={() => onExpandChart?.('fraud_trends')}
          config={FRAUD_CONFIG}
        />
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Fraud risk signals">
            <thead>
              <tr>
                <th>Signal</th>
                <th>Volume</th>
                <th>Change (WoW)</th>
                <th>Segment</th>
                <th>Severity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Chargeback rate</td>
                <td className="cell-red">0.89% (Sat peak)</td>
                <td className="cell-red">+117% WoW</td>
                <td>Debit cards, Zone 4–5, mobile web</td>
                <td><span className="status-badge status-alert">Critical</span></td>
              </tr>
              <tr>
                <td>High-velocity order attempts (&gt;4 orders/hr same fingerprint)</td>
                <td className="cell-red">48 sessions</td>
                <td className="cell-red">+340% vs prior week</td>
                <td>New accounts, no order history</td>
                <td><span className="status-badge status-alert">Critical</span></td>
              </tr>
              <tr>
                <td>Billing/shipping mismatch on orders &gt;$120</td>
                <td className="cell-amber">212 orders</td>
                <td className="cell-amber">+28% WoW</td>
                <td>Guest checkout, prepaid cards</td>
                <td><span className="status-badge status-ok">High</span></td>
              </tr>
              <tr>
                <td>Repeat card-test attempts (low-value followed by large order)</td>
                <td className="cell-amber">34 flagged</td>
                <td className="cell-amber">+90% WoW</td>
                <td>VPN IPs, new device fingerprints</td>
                <td><span className="status-badge status-ok">High</span></td>
              </tr>
              <tr>
                <td>Manual review backlog</td>
                <td className="cell-amber">4.9%</td>
                <td className="cell-amber">+2.8 pts</td>
                <td>All channels</td>
                <td><span className="status-badge status-ok">Watch</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">3 mitigations — low false-positive risk</div>
      <div className="action-cards">
        <div className="action-card visible alert">
          <div className="action-card-header">
            <span className="platform-badge">Rule engine</span>
            <span className="action-type-pill alert">Today</span>
            <span className="action-title">Velocity limits on high-risk device fingerprint clusters</span>
          </div>
          <div className="action-description">
            Cap to 2 order attempts/hr per device fingerprint for new accounts with no order history. Block the 3 identified fingerprint clusters immediately. Guardrail: monitor approval rate for new accounts daily — rollback if drops &gt;3 pts.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Apply rule</button>
            <button className="action-btn-ghost">Review clusters first</button>
          </div>
        </div>
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Step-up auth</span>
            <span className="action-type-pill pending">High priority</span>
            <span className="action-title">Step-up verification for billing/shipping mismatch on orders &gt;$120</span>
          </div>
          <div className="action-description">
            Require SMS or email OTP only for orders meeting this criteria — not sitewide. Estimated: catches 60–70% of the mismatch-related chargebacks with minimal friction for good customers. Guardrail: step-up abandonment rate.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Configure step-up</button>
            <button className="action-btn-ghost">Adjust threshold</button>
          </div>
        </div>
        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Model tuning</span>
            <span className="action-type-pill done">This week</span>
            <span className="action-title">Retrain fraud model on this week's confirmed bad orders</span>
          </div>
          <div className="action-description">
            Label this week's confirmed chargebacks as positive fraud signals and retrain. Focus features: device fingerprint hash, velocity, billing/shipping delta distance, and prepaid card BIN. Rerun on Friday's order set to validate.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Start retraining</button>
            <button className="action-btn-ghost">Schedule for later</button>
          </div>
        </div>
      </div>

    </>
  )
}

// ─── Step 2: Monitoring dashboard + alert thresholds ─────────────────────────

export function RiskResponse2() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the fraud monitoring dashboard outline and alert threshold configuration. Two views: a real-time ops view for the fraud team, and a weekly risk summary for leadership.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Fraud monitoring dashboard">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Baseline</th>
                <th>Warning threshold</th>
                <th>Critical threshold</th>
                <th>Slice by</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Chargeback rate</td>
                <td>0.41%</td>
                <td className="cell-amber">+2σ (&gt;0.65%)</td>
                <td className="cell-red">+3σ (&gt;0.90%)</td>
                <td>Payment method, country, device</td>
              </tr>
              <tr>
                <td>Fraud loss rate ($ / GMV)</td>
                <td>0.18%</td>
                <td className="cell-amber">&gt;0.30%</td>
                <td className="cell-red">&gt;0.50%</td>
                <td>Channel, order value band</td>
              </tr>
              <tr>
                <td>Manual review rate</td>
                <td>2.1%</td>
                <td className="cell-amber">&gt;4%</td>
                <td className="cell-red">&gt;6%</td>
                <td>New vs returning customers</td>
              </tr>
              <tr>
                <td>Approval rate</td>
                <td>97.2%</td>
                <td className="cell-amber">Drops &gt;1.5 pts in a segment</td>
                <td className="cell-red">Drops &gt;3 pts in a segment</td>
                <td>Payment method, device, geography</td>
              </tr>
              <tr>
                <td>Step-up abandonment rate</td>
                <td>N/A (new)</td>
                <td className="cell-amber">&gt;15%</td>
                <td className="cell-red">&gt;25%</td>
                <td>Device, order value, customer tenure</td>
              </tr>
              <tr>
                <td>Review backlog age</td>
                <td>&lt;2 hrs</td>
                <td className="cell-amber">&gt;4 hrs</td>
                <td className="cell-red">&gt;8 hrs</td>
                <td>Priority tier</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Alert routing</div>
      <div className="action-cards">
        <div className="action-card visible alert">
          <div className="action-card-header">
            <span className="platform-badge">PagerDuty</span>
            <span className="action-type-pill alert">Critical</span>
            <span className="action-title">Chargeback spike + approval rate drop alerts</span>
          </div>
          <div className="action-description">
            Any metric hitting critical threshold triggers a PagerDuty alert to Fraud Analyst on-call + Ops Manager. Auto-links to the relevant Datadog dashboard segment for fast triage.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Configure PagerDuty</button>
            <button className="action-btn-ghost">Use Slack only</button>
          </div>
        </div>
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Slack</span>
            <span className="action-type-pill pending">Warning</span>
            <span className="action-title">Warning-level alerts → #fraud-ops channel</span>
          </div>
          <div className="action-description">
            Warning thresholds route to #fraud-ops with a summary of the triggering metric, the affected segment, and a link to drill down. No page — just visibility.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Configure Slack alerts</button>
            <button className="action-btn-ghost">Skip</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Dashboard</span>
            <span className="action-type-pill done">Ready</span>
            <span className="action-title">Ops + leadership views blueprint</span>
          </div>
          <div className="action-description">
            Two-view outline is ready: real-time fraud ops dashboard for triage and a weekly leadership summary that rolls up risk, losses, and mitigation status.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Generate dashboard scaffold</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>
      </div>

    </>
  )
}

// ─── Step 3: Weekly fraud leadership update ───────────────────────────────────

export function RiskResponse3() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the weekly fraud risk update — written for leadership: what changed, what we did, and what to watch next week.
        </p>
        <p>
          Net assessment: attack surface is now narrowed. Next week is about monitoring approval rate in the new-account segment while the new mitigations run.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Weekly fraud summary">
            <thead>
              <tr>
                <th>Theme</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Signal</td>
                <td>Chargeback rate rose from 0.41% (Mon) to 0.89% peak (Sat), driven by 3 device fingerprint clusters with billing/shipping mismatch on mobile web. Est. gross fraud loss: $4,200.</td>
              </tr>
              <tr>
                <td>Pattern</td>
                <td>48 sessions with &gt;4 order attempts/hr from new accounts; consistent with card testing followed by large-order execution.</td>
              </tr>
              <tr>
                <td>Mitigations</td>
                <td>Velocity limits applied, step-up verification live, and model retraining queued with confirmed labels for Friday deploy.</td>
              </tr>
              <tr>
                <td>Outlook</td>
                <td>Estimated fraud loss rate next week: 0.20–0.25% (assuming no new vectors). Monitor in real time.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Proposed actions</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Monitoring</span>
            <span className="action-type-pill pending">Watch</span>
            <span className="action-title">Monitor approval rate in new-account segment</span>
          </div>
          <div className="action-description">
            If legitimate new customers show conversion drop &gt;2 pts vs baseline by Wednesday, loosen the threshold from 2/hr to 3/hr for accounts with email-verified status.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Set monitoring alert</button>
            <button className="action-btn-ghost">Adjust threshold now</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Rules</span>
            <span className="action-type-pill done">Completed</span>
            <span className="action-title">Velocity limits + cluster blocks</span>
          </div>
          <div className="action-description">
            Capped repeat order attempts for flagged device clusters; three clusters blocked. Approval rate for good customers remains stable (monitored hourly).
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">View rule changelog</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Step-up</span>
            <span className="action-type-pill done">Completed</span>
            <span className="action-title">OTP for mismatch orders &gt;$120</span>
          </div>
          <div className="action-description">
            Step-up verification is live for billing/shipping mismatches on high-value orders; abandonment is 9% and early chargeback signal is improving.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">View results</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>
      </div>
    </>
  )
}
