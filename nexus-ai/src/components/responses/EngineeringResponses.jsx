import { InlineChart } from './shared'

// ─── Step 1: Reliability + performance audit ─────────────────────────────────

const LATENCY_CONFIG = {
  type: 'line',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'p50 (ms)',
        data: [182, 178, 191, 204, 198, 215, 211],
        borderColor: '#52C97A',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'p95 (ms)',
        data: [410, 398, 461, 589, 572, 644, 631],
        borderColor: '#E05252',
        tension: 0.3,
        fill: false,
      },
    ],
  },
  options: {
    scales: {
      y: { ticks: { callback: (v) => `${v}ms` } },
    },
  },
}

export function EngineeringResponse1({ onExpandChart }) {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the impact-ranked breakdown of this week's user-facing issues — pulled from frontend error logs, performance vitals, and API latency percentiles.
        </p>
        <p>
          p95 API latency is the most alarming trend: it nearly doubled mid-week, and it correlates with a deploy on Wednesday. The chart below shows the drift.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="API latency — p50 vs p95 (7-day)"
          onExpand={() => onExpandChart?.('latency')}
          config={LATENCY_CONFIG}
        />
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Issues by impact">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Layer</th>
                <th>User Impact</th>
                <th>Effort</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Checkout JS errors — intermittent payment validation failures</td>
                <td>Frontend</td>
                <td className="cell-red">High</td>
                <td className="cell-green">Low</td>
                <td><span className="status-badge status-alert">P0</span></td>
              </tr>
              <tr>
                <td>Slow PDP load on mobile (LCP &gt; 4s, INP spiky)</td>
                <td>Frontend</td>
                <td className="cell-amber">Medium</td>
                <td className="cell-amber">Medium</td>
                <td><span className="status-badge status-ok">P1</span></td>
              </tr>
              <tr>
                <td>p95 API latency spike on /cart and /checkout endpoints</td>
                <td>Backend</td>
                <td className="cell-red">High</td>
                <td className="cell-amber">Medium</td>
                <td><span className="status-badge status-alert">P0</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Fastest 3 fixes</div>
      <div className="action-cards">
        <div className="action-card visible alert">
          <div className="action-card-header">
            <span className="platform-badge">FE</span>
            <span className="action-type-pill alert">P0 · 1–2 days</span>
            <span className="action-title">Defensive validation + fallback UI on checkout</span>
          </div>
          <div className="action-description">
            Prevent hard failures; log structured error codes (<span className="code-highlight">error_code</span>, <span className="code-highlight">step_name</span>) for rapid triage. Add recovery CTA so users aren't stuck.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Create ticket</button>
            <button className="action-btn-ghost">View error logs</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">BE</span>
            <span className="action-type-pill pending">P0 · 2–3 days</span>
            <span className="action-title">Stabilize p95 latency on critical endpoints</span>
          </div>
          <div className="action-description">
            Cache hot reads on <span className="code-highlight">/cart</span> and <span className="code-highlight">/checkout</span>; tighten DB indices for slow queries; add circuit-breaker timeouts upstream.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Create ticket</button>
            <button className="action-btn-ghost">Inspect slow queries</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">FE</span>
            <span className="action-type-pill done">P1 · 2–4 days</span>
            <span className="action-title">PDP payload reduction + image strategy</span>
          </div>
          <div className="action-description">
            Serve responsive images, prioritize above-the-fold assets via <span className="code-highlight">fetchpriority="high"</span>, and defer non-critical third-party widgets.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Create ticket</button>
            <button className="action-btn-ghost">Run Lighthouse audit</button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Step 2: 1-week execution plan ───────────────────────────────────────────

export function EngineeringResponse2() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the sequenced 1-week execution plan with owners, acceptance criteria, and rollback triggers for all three fixes.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Execution plan">
            <thead>
              <tr>
                <th>Days</th>
                <th>Work item</th>
                <th>Owner</th>
                <th>Acceptance criteria</th>
                <th>Rollback trigger</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1–2</td>
                <td>Checkout reliability hardening</td>
                <td>FE + QA</td>
                <td className="cell-green">JS error rate −50%; payment failures −30%; no conversion regression</td>
                <td className="cell-red">Error or failure rate +20% vs baseline for 30 min</td>
              </tr>
              <tr>
                <td>2–4</td>
                <td>PDP performance (LCP/INP)</td>
                <td>FE</td>
                <td className="cell-green">Mobile LCP −300ms; INP −50ms on top 20 PDPs</td>
                <td className="cell-amber">LCP/INP regression &gt;10% on mobile cohort</td>
              </tr>
              <tr>
                <td>3–5</td>
                <td>API latency stabilization</td>
                <td>BE / Platform</td>
                <td className="cell-green">p95 back to target; timeout rate down; slow queries reduced</td>
                <td className="cell-red">Elevated 5xx or timeouts sustained 15 min</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Monitoring setup</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Sentry</span>
            <span className="action-type-pill pending">Configure now</span>
            <span className="action-title">Checkout JS error + anomaly alerts</span>
          </div>
          <div className="action-description">
            Alert on checkout JS error rate exceeding baseline by 2σ. Include <span className="code-highlight">step_name</span> and <span className="code-highlight">error_code</span> in breadcrumbs for instant triage.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Open Sentry config</button>
            <button className="action-btn-ghost">Skip</button>
          </div>
        </div>
        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Datadog</span>
            <span className="action-type-pill done">Configure now</span>
            <span className="action-title">p95 API latency + 5xx dashboard</span>
          </div>
          <div className="action-description">
            Real-time dashboard for p50/p95/p99 per endpoint, 5xx rate, and timeout count. Rollback decision can be made from this view alone.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Open Datadog config</button>
            <button className="action-btn-ghost">Skip</button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Step 3: Stakeholder update + release note ───────────────────────────────

export function EngineeringResponse3() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's a concise post-ship update ready to paste into Slack or your release notes page. It's written for a mixed technical/non-technical audience.
        </p>
        <p>
          The three highest-impact fixes are shipped; the remaining work is monitoring and ramping safely to 100%.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Post-ship summary">
            <thead>
              <tr>
                <th>Shipped change</th>
                <th>Outcome</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Checkout reliability hardening</td>
                <td>Reduced intermittent validation failures; improved error recovery so users don't hit dead-ends.</td>
              </tr>
              <tr>
                <td>PDP performance improvements</td>
                <td>Faster mobile load via responsive images, above-the-fold prioritization, and deferred non-critical scripts.</td>
              </tr>
              <tr>
                <td>API latency stabilization</td>
                <td>Improved p95 on <span className="code-highlight">/cart</span> and <span className="code-highlight">/checkout</span> via caching, index tuning, and circuit-breaker timeouts.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Impact we're watching</div>
      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Post-launch monitoring metrics">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Baseline</th>
                <th>Target</th>
                <th>Current</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mobile checkout completion rate</td>
                <td>29%</td>
                <td className="cell-green">≥35%</td>
                <td><span className="status-badge status-ok">Tracking</span></td>
              </tr>
              <tr>
                <td>Payment failure rate</td>
                <td>4.1%</td>
                <td className="cell-green">≤2.5%</td>
                <td><span className="status-badge status-ok">Tracking</span></td>
              </tr>
              <tr>
                <td>Mobile PDP LCP (p75)</td>
                <td>4.2s</td>
                <td className="cell-green">≤2.5s</td>
                <td><span className="status-badge status-ok">Tracking</span></td>
              </tr>
              <tr>
                <td>API p95 latency (/cart)</td>
                <td>644ms</td>
                <td className="cell-green">≤350ms</td>
                <td><span className="status-badge status-ok">Tracking</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Proposed actions</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Release</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Ramp to 100% if metrics hold for 48 hours</span>
          </div>
          <div className="action-description">
            If payment failures, checkout completion, and latency remain stable for 48 hours, ramp from partial exposure to 100% and close remaining edge-case tickets.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Start ramp checklist</button>
            <button className="action-btn-ghost">Hold at current %</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">RCA</span>
            <span className="action-type-pill done">Ready</span>
            <span className="action-title">Schedule retro + publish release note</span>
          </div>
          <div className="action-description">
            Retro agenda drafted with rollback triggers, lessons learned, and follow-ups; release note format ready for Slack or release page.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Schedule retro</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>
      </div>
    </>
  )
}
