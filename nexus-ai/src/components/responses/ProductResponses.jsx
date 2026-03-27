import { InlineChart } from './shared'

// ─── Step 1: Top user problems + sprint opportunities ───────────────────────

export function ProductResponse1() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's a sprint-ready view of what's hurting users most right now and where you'll get the biggest payoff this cycle.
        </p>
        <p>
          Two opportunities stand out on impact-vs-effort: mobile checkout friction is the single highest-volume complaint, and returns/refunds confusion is driving preventable support load and repeat-purchase churn.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Top user problems table">
            <thead>
              <tr>
                <th>#</th>
                <th>Problem</th>
                <th>Affected Users (14d)</th>
                <th>Severity</th>
                <th>Revenue Proxy</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mobile checkout friction — too many steps at shipping selection</td>
                <td className="cell-red">4,820</td>
                <td><span className="status-badge status-alert">Critical</span></td>
                <td className="cell-red">High</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Returns/refunds timing confusion — users can't find policy or ETA</td>
                <td className="cell-amber">3,110</td>
                <td><span className="status-badge status-ok">Medium</span></td>
                <td className="cell-amber">Medium</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Inventory surprises — "in stock" → "backordered" post add-to-cart</td>
                <td className="cell-amber">1,940</td>
                <td><span className="status-badge status-ok">Medium</span></td>
                <td className="cell-amber">Medium</td>
              </tr>
              <tr>
                <td>4</td>
                <td>Slow PDP first meaningful paint on mobile (LCP &gt; 4s)</td>
                <td className="cell-amber">2,670</td>
                <td><span className="status-badge status-ok">Medium</span></td>
                <td className="cell-green">Low</td>
              </tr>
              <tr>
                <td>5</td>
                <td>Promo code reliability — intermittent "invalid" + stacking confusion</td>
                <td className="cell-green">980</td>
                <td><span className="status-badge status-good">Low</span></td>
                <td className="cell-green">Low</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Two opportunities to prioritize</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Sprint A</span>
            <span className="action-type-pill pending">High Impact · Medium Effort</span>
            <span className="action-title">Mobile Checkout Simplification</span>
          </div>
          <div className="action-description">
            Reduce step count, prefill shipping for returning users, improve error copy, and add per-field drop-off instrumentation. Success: mobile CVR, checkout completion rate, time-to-complete.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Draft PRD</button>
            <button className="action-btn-ghost">Add to backlog</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Sprint B</span>
            <span className="action-type-pill done">Medium-High Impact · Low Effort</span>
            <span className="action-title">Returns Clarity + Self-Serve Flow</span>
          </div>
          <div className="action-description">
            Add a clear policy module, proactive order-status messaging, and a guided return eligibility checker. Success: ticket deflection, CSAT, repeat purchase rate for returners.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Draft PRD</button>
            <button className="action-btn-ghost">Add to backlog</button>
          </div>
        </div>
      </div>

      <div className="suggestions">
        <button className="suggestion-pill visible">Turn A into a full PRD</button>
        <button className="suggestion-pill visible">Map problems to NPS verbatims</button>
        <button className="suggestion-pill visible">Estimate revenue impact of fix A</button>
      </div>
    </>
  )
}

// ─── Step 2: Full 1-page PRD ─────────────────────────────────────────────────

export function ProductResponse2() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the 1-page PRD for Mobile Checkout Simplification — scoped for an MVP sprint with clear success metrics, guardrails, and phased rollout milestones.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="PRD scope table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Problem</strong></td>
                <td>Mobile checkout drop-offs spike at shipping selection and payment validation, driving lost orders and avoidable support load.</td>
              </tr>
              <tr>
                <td><strong>Goal</strong></td>
                <td>Increase mobile checkout completion rate and reduce time-to-checkout without increasing fraud or chargebacks.</td>
              </tr>
              <tr>
                <td><strong>In scope</strong></td>
                <td>Combine shipping + delivery steps; prefill known fields for returning users; clear validation + error messaging; per-step drop-off instrumentation.</td>
              </tr>
              <tr>
                <td><strong>Out of scope</strong></td>
                <td>New payment methods, major cart redesign, subscription/BNPL expansion (Phase 2).</td>
              </tr>
              <tr>
                <td><strong>Primary metrics</strong></td>
                <td>Mobile checkout completion rate (+target%), mobile CVR (+target%).</td>
              </tr>
              <tr>
                <td><strong>Secondary metrics</strong></td>
                <td>Time-to-complete (−target%), "checkout help" ticket volume (−target%).</td>
              </tr>
              <tr>
                <td><strong>Guardrails</strong></td>
                <td>Refund rate, chargeback rate, AOV — must not degrade.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Key risks</div>
      <div className="action-cards">
        <div className="action-card visible alert">
          <div className="action-card-header">
            <span className="platform-badge">Risk</span>
            <span className="action-type-pill alert">Medium</span>
            <span className="action-title">Shipping rule complexity + regressions</span>
          </div>
          <div className="action-description">
            Hidden complexity in shipping/tax rules may cause edge-case failures. Mitigation: thorough QA matrix (international, PO boxes, coupons, split shipments).
          </div>
        </div>
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Risk</span>
            <span className="action-type-pill pending">Low-Medium</span>
            <span className="action-title">Prefill defaults incorrectly shown</span>
          </div>
          <div className="action-description">
            Prefilled fields must show clear "edit" affordances. Run a pilot with a small returning-user segment before full rollout.
          </div>
        </div>
      </div>

      <div className="insight-callout">
        Phased rollout: 5% → 25% → 100% with automated rollback triggers on payment failure rate and checkout error spikes.
      </div>

      <div className="suggestions">
        <button className="suggestion-pill visible">Build A/B test + rollout plan</button>
        <button className="suggestion-pill visible">Generate ticket breakdown for eng</button>
        <button className="suggestion-pill visible">Estimate engineering effort</button>
      </div>
    </>
  )
}

// ─── Step 3: A/B test plan + instrumentation + rollout checklist ─────────────

const FUNNEL_CONFIG = {
  type: 'bar',
  data: {
    labels: ['Cart', 'Checkout Start', 'Shipping Step', 'Payment Step', 'Order Complete'],
    datasets: [
      {
        label: 'Control (%)',
        data: [100, 74, 51, 38, 29],
        backgroundColor: 'rgba(232,197,71,0.5)',
        borderRadius: 4,
      },
      {
        label: 'Treatment Target (%)',
        data: [100, 74, 62, 50, 38],
        backgroundColor: 'rgba(82,201,122,0.7)',
        borderRadius: 4,
      },
    ],
  },
  options: {
    scales: {
      y: { ticks: { callback: (v) => `${v}%` }, max: 110 },
    },
  },
}

export function ProductResponse3({ onExpandChart }) {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the full A/B test plan with instrumentation schema, monitoring thresholds, and a launch checklist for eng and QA.
        </p>
        <p>
          The funnel below shows the control drop-off vs. the treatment targets — the biggest expected recovery is at the shipping and payment steps.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="Checkout funnel: control vs treatment target"
          onExpand={() => onExpandChart?.('funnel')}
          config={FUNNEL_CONFIG}
        />
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="A/B test plan table">
            <thead>
              <tr>
                <th>Dimension</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Hypothesis</strong></td>
                <td>Simplifying mobile checkout reduces friction, increasing completion rate.</td>
              </tr>
              <tr>
                <td><strong>Variants</strong></td>
                <td>Control (current) vs Treatment (simplified flow + improved validation copy).</td>
              </tr>
              <tr>
                <td><strong>Targeting</strong></td>
                <td>Mobile web sessions; exclude internal traffic; stratify returning vs new.</td>
              </tr>
              <tr>
                <td><strong>Primary metric</strong></td>
                <td>Checkout completion rate.</td>
              </tr>
              <tr>
                <td><strong>Guardrails</strong></td>
                <td>Chargeback rate, refund rate, payment failure rate, LCP/INP.</td>
              </tr>
              <tr>
                <td><strong>Duration</strong></td>
                <td>Minimum 1 full week (weekday + weekend); extend to reach statistical power.</td>
              </tr>
              <tr>
                <td><strong>Rollback triggers</strong></td>
                <td>Payment failures +20% vs control; chargebacks trending up; JS errors spiking.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Launch checklist</div>
      <div className="action-cards">
        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">QA</span>
            <span className="action-type-pill done">Pre-launch</span>
            <span className="action-title">Edge case test matrix</span>
          </div>
          <div className="action-description">
            International addresses, PO boxes, coupons + promo stacking, split shipments, and gift cards. All must pass before ramp.
          </div>
        </div>
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Observability</span>
            <span className="action-type-pill pending">Pre-launch</span>
            <span className="action-title">Instrumentation + anomaly alerts</span>
          </div>
          <div className="action-description">
            Events: <span className="code-highlight">checkout_step_viewed</span>, <span className="code-highlight">checkout_error_shown</span>, <span className="code-highlight">order_completed</span>. Sentry alerts on checkout JS errors; anomaly monitor on completion rate.
          </div>
        </div>
      </div>

      <div className="suggestions">
        <button className="suggestion-pill visible">Export checklist as Jira tickets</button>
        <button className="suggestion-pill visible">Draft eng handoff notes</button>
        <button className="suggestion-pill visible">Set up automated result monitoring</button>
      </div>
    </>
  )
}
