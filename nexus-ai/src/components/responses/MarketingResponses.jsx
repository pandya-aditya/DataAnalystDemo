import { InlineChart } from './shared'

// ─── Step 1: 7-day acquisition performance audit ─────────────────────────────

const CAC_TREND_CONFIG = {
  type: 'line',
  data: {
    labels: ['D-7', 'D-6', 'D-5', 'D-4', 'D-3', 'D-2', 'D-1'],
    datasets: [
      {
        label: 'Meta CAC',
        data: [29, 27, 30, 28, 26, 25, 28],
        borderColor: '#52C97A',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'Google CAC',
        data: [41, 44, 43, 48, 46, 45, 44],
        borderColor: '#E8C547',
        tension: 0.3,
        fill: false,
      },
      {
        label: 'TikTok CAC',
        data: [52, 55, 59, 62, 65, 68, 72],
        borderColor: '#E05252',
        tension: 0.3,
        fill: false,
      },
    ],
  },
  options: {
    scales: {
      y: { ticks: { callback: (v) => `$${v}` } },
    },
  },
}

export function MarketingResponse1({ onExpandChart }) {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the 7-day acquisition audit across all active channels. TikTok is the single biggest lever — CAC has climbed 38% week-over-week while LTV has stayed flat. Reallocating 20% of TikTok spend to Meta's best-performing audience segment is the fastest ROI move.
        </p>
        <p>
          The goal is to protect volume while improving blended CAC: cut waste on TikTok, scale Meta winners, and keep Google Search under watch.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="CAC trend by channel (7-day)"
          onExpand={() => onExpandChart?.('cac_trend')}
          config={CAC_TREND_CONFIG}
        />
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Channel acquisition performance">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Spend (7d)</th>
                <th>CAC</th>
                <th>ROAS</th>
                <th>LTV:CAC</th>
                <th>CVR</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Meta</td>
                <td>$41,200</td>
                <td className="cell-green">$28</td>
                <td className="cell-green">4.8×</td>
                <td className="cell-green">5.1×</td>
                <td className="cell-green">3.2%</td>
                <td><span className="status-badge status-good">Scale</span></td>
              </tr>
              <tr>
                <td>Google Search</td>
                <td>$28,900</td>
                <td className="cell-amber">$44</td>
                <td className="cell-amber">3.4×</td>
                <td className="cell-amber">3.7×</td>
                <td className="cell-amber">2.1%</td>
                <td><span className="status-badge status-ok">Watch</span></td>
              </tr>
              <tr>
                <td>TikTok</td>
                <td>$19,300</td>
                <td className="cell-red">$72</td>
                <td className="cell-red">1.6×</td>
                <td className="cell-red">1.6×</td>
                <td className="cell-red">0.9%</td>
                <td><span className="status-badge status-alert">Cut</span></td>
              </tr>
              <tr>
                <td>Email</td>
                <td>$2,100</td>
                <td className="cell-green">$9</td>
                <td className="cell-green">11.2×</td>
                <td className="cell-green">14×</td>
                <td className="cell-green">5.8%</td>
                <td><span className="status-badge status-good">Best</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Proposed actions</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Meta / TikTok</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Reallocate 20% of TikTok spend to Meta</span>
          </div>
          <div className="action-detail">
            Pause bottom-quartile TikTok ad sets and shift <span className="code-highlight">$4–5k/week</span> into Meta's best-performing retargeting audience. Target: ~12% blended CAC improvement in 10 days.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Draft reallocation plan</button>
            <button className="action-btn-ghost">Review ad sets</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Slack</span>
            <span className="action-type-pill done">Ready</span>
            <span className="action-title">Set CAC guardrails by channel</span>
          </div>
          <div className="action-description">
            Alert when CAC drifts above thresholds (TikTok most sensitive) and post a weekly channel health summary with LTV:CAC and ROAS.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Send alert draft</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Step 2: 2-week test plan ────────────────────────────────────────────────

export function MarketingResponse2() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's a structured 2-week test plan with 3 experiments — each targeting a different lever in the acquisition funnel. Budget is split 70% to proven winners, 30% to experiments, rebalanced at end of Week 1.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="2-week test plan">
            <thead>
              <tr>
                <th>#</th>
                <th>Experiment</th>
                <th>Hypothesis</th>
                <th>Channel</th>
                <th>Primary metric</th>
                <th>Guardrail</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Creative refresh — new hook + value prop</td>
                <td>Clearer value prop reduces bounce, improves CTR and CVR by 15%+</td>
                <td>Meta</td>
                <td className="cell-green">CTR, CVR, CAC</td>
                <td className="cell-amber">Refund rate</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Audience tightening — 3-day retargeting window</td>
                <td>Shorter retargeting window = higher purchase intent = ROAS +20%</td>
                <td>Meta / Google</td>
                <td className="cell-green">ROAS, CAC</td>
                <td className="cell-amber">Frequency, CPM</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Landing page message-match variant</td>
                <td>Aligning offer copy on PDP to ad headline improves ATC rate by 10%</td>
                <td>Google Search</td>
                <td className="cell-green">PDP→ATC rate, checkout start</td>
                <td className="cell-amber">Bounce rate, AOV</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Week-by-week plan</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Week 1</span>
            <span className="action-type-pill pending">Launch</span>
            <span className="action-title">Launch all 3 experiments + reallocate TikTok budget</span>
          </div>
          <div className="action-description">
            Pause bottom-quartile TikTok ad sets immediately. Launch experiments 1–3 with 10% budget each. Monitor CAC daily; check creative fatigue signals by Day 4.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Start Week 1 tasks</button>
            <button className="action-btn-ghost">Adjust budget split</button>
          </div>
        </div>
        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Week 2</span>
            <span className="action-type-pill done">Optimize</span>
            <span className="action-title">Kill losers, scale winners, refine landing variant</span>
          </div>
          <div className="action-description">
            By Day 8: cut experiments with CAC &gt;15% above control. Scale the top-performing creative and audience combo to 25% of budget. Iterate on landing copy using heatmap data.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Schedule Week 2 review</button>
            <button className="action-btn-ghost">Skip</button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Step 3: Stakeholder update ──────────────────────────────────────────────

export function MarketingResponse3() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the stakeholder update — written for a leadership audience who cares about what we're doing, why, and what success looks like. Paste directly into email or Slack.
        </p>
        <p>
          Success is blended CAC down, ROAS up, with AOV and refund rate neutral or improved while holding acquisition volume.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Experiment summary">
            <thead>
              <tr>
                <th>Experiment</th>
                <th>What we're changing</th>
                <th>Target outcome</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Exp 1</td>
                <td>Creative refresh on Meta (new hook + value prop)</td>
                <td className="cell-green">15–20% CAC reduction</td>
              </tr>
              <tr>
                <td>Exp 2</td>
                <td>Audience tightening (3-day retargeting window) on Meta and Google</td>
                <td className="cell-green">Higher intent signal, ROAS up</td>
              </tr>
              <tr>
                <td>Exp 3</td>
                <td>Landing page message-match (ad offer copy → PDP headline)</td>
                <td className="cell-green">+10% add-to-cart rate</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Proposed actions</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Design</span>
            <span className="action-type-pill pending">Approval</span>
            <span className="action-title">Approve $2,500 creative budget (3 variants)</span>
          </div>
          <div className="action-description">
            Fund 3 new creative assets (video hooks + static) for Experiment 1. Without this, the test is copy-only and the upside is limited.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Approve</button>
            <button className="action-btn-ghost">Use existing creative</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Ops</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Schedule Week 2 review + budget rebalance</span>
          </div>
          <div className="action-description">
            Day 8 decision: kill losers (CAC &gt;15% above control), scale winners, and refine landing page variant using heatmap and cohort data.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Schedule review</button>
            <button className="action-btn-ghost">Later</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">TikTok</span>
            <span className="action-type-pill done">Completed</span>
            <span className="action-title">Paused bottom-quartile ad sets</span>
          </div>
          <div className="action-description">
            Paused the worst performers (CAC $72 vs $28 Meta) and redirected <span className="code-highlight">$4.5k/week</span> to proven Meta audiences.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">View changes</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>
      </div>
    </>
  )
}
