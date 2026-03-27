import { InlineChart } from './shared'

// ─── Step 1: Pipeline health + deal risk analysis ────────────────────────────

const PIPELINE_CONFIG = {
  type: 'bar',
  data: {
    labels: ['Discovery', 'Qualification', 'Demo/Eval', 'Proposal', 'Negotiation', 'Closed'],
    datasets: [
      {
        label: 'Deal count',
        data: [24, 18, 14, 9, 5, 3],
        backgroundColor: ['#52C97A', '#52C97A', '#E8C547', '#E8C547', '#E05252', '#52C97A'],
        borderRadius: 4,
      },
    ],
  },
  options: {
    scales: {
      y: { ticks: { callback: (v) => `${v}` } },
    },
  },
}

export function SalesResponse1({ onExpandChart }) {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the pipeline health summary. The biggest concern is the drop from Demo/Eval to Proposal — 5 deals are stalled at that stage, and 3 of them have had no logged activity in 14+ days.
        </p>
        <p>
          Below are the top 5 deal risks with a specific next best action for each.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="Pipeline by stage (deal count)"
          onExpand={() => onExpandChart?.('pipeline')}
          config={PIPELINE_CONFIG}
        />
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Deal risk breakdown">
            <thead>
              <tr>
                <th>Deal</th>
                <th>Stage</th>
                <th>Value</th>
                <th>Risk type</th>
                <th>Days stalled</th>
                <th>Next best action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Acme Corp</td>
                <td>Negotiation</td>
                <td>$84,000</td>
                <td className="cell-red">Pricing friction</td>
                <td className="cell-red">18</td>
                <td>Propose phased rollout; anchor on 6-month ROI</td>
              </tr>
              <tr>
                <td>Northstar Ltd</td>
                <td>Proposal</td>
                <td>$52,000</td>
                <td className="cell-red">Missing champion</td>
                <td className="cell-red">21</td>
                <td>Identify internal sponsor; send exec-level ROI summary</td>
              </tr>
              <tr>
                <td>Brightfield Co</td>
                <td>Demo/Eval</td>
                <td>$38,000</td>
                <td className="cell-amber">Competitive threat</td>
                <td className="cell-amber">14</td>
                <td>Run differentiation workshop; secure exec alignment call</td>
              </tr>
              <tr>
                <td>Keystone Inc</td>
                <td>Proposal</td>
                <td>$27,000</td>
                <td className="cell-amber">No next step</td>
                <td className="cell-amber">16</td>
                <td>Send recap + 3 concrete options with booking links</td>
              </tr>
              <tr>
                <td>Vantage Group</td>
                <td>Negotiation</td>
                <td>$61,000</td>
                <td className="cell-amber">Unclear decision criteria</td>
                <td className="cell-amber">12</td>
                <td>Build mutual action plan; confirm decision date + stakeholders</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="insight-callout">
        Total at-risk pipeline: $262,000. If stalled deals don't progress within 7 days, probability of close in this quarter drops significantly. Start with Acme Corp and Northstar Ltd — highest value + longest stall.
      </div>

      <div className="suggestions">
        <button className="suggestion-pill visible">Build 2-week outreach plan</button>
        <button className="suggestion-pill visible">Draft ROI summary for Northstar</button>
        <button className="suggestion-pill visible">Generate mutual action plan template</button>
      </div>
    </>
  )
}

// ─── Step 2: 2-week outreach plan ────────────────────────────────────────────

export function SalesResponse2() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the 2-week outreach plan for your at-risk deals and renewals. The cadence is designed to re-establish momentum without spamming — each touchpoint has a specific goal and leaves a clear next step open.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="2-week outreach cadence">
            <thead>
              <tr>
                <th>Day</th>
                <th>Touchpoint</th>
                <th>Format</th>
                <th>Goal</th>
                <th>Key deals</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Day 1</td>
                <td>Value recap + mutual action plan</td>
                <td>Email</td>
                <td>Re-anchor on their goals; propose a shared close path</td>
                <td>Acme, Northstar, Vantage</td>
              </tr>
              <tr>
                <td>Day 2</td>
                <td>Stakeholder mapping call</td>
                <td>Call (20 min)</td>
                <td>Identify missing sponsors; clarify decision criteria</td>
                <td>Northstar, Brightfield</td>
              </tr>
              <tr>
                <td>Day 3</td>
                <td>ROI artifact + social proof</td>
                <td>Email + doc</td>
                <td>Build business case; counter competitive narrative</td>
                <td>Brightfield, Keystone</td>
              </tr>
              <tr>
                <td>Day 5</td>
                <td>LinkedIn connection / comment</td>
                <td>Social</td>
                <td>Stay visible with champion and exec; warm the relationship</td>
                <td>All 5 deals</td>
              </tr>
              <tr>
                <td>Day 7</td>
                <td>Mid-point check-in call</td>
                <td>Call (30 min)</td>
                <td>Unblock objections; confirm next step before end of week</td>
                <td>Acme, Vantage</td>
              </tr>
              <tr>
                <td>Day 10</td>
                <td>Executive alignment touch</td>
                <td>Email (exec to exec)</td>
                <td>Sponsor-to-sponsor signal; accelerate decision timeline</td>
                <td>Northstar, Acme</td>
              </tr>
              <tr>
                <td>Day 14</td>
                <td>Close plan + hard next step</td>
                <td>Call + follow-up email</td>
                <td>Confirm decision date; lock in trial, POC, or contract review</td>
                <td>All 5 deals</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Message templates</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Day 1 email</span>
            <span className="action-type-pill pending">Template</span>
            <span className="action-title">Value recap + mutual action plan</span>
          </div>
          <div className="action-description">
            Subject: "Next steps — [Company] + [Your Company]". Open with their stated goal, summarize the value we've shown, and propose 3 concrete options for moving forward with specific dates.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Generate for Acme Corp</button>
            <button className="action-btn-ghost">Edit template</button>
          </div>
        </div>
        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Day 3 email</span>
            <span className="action-type-pill done">Template</span>
            <span className="action-title">ROI artifact + competitive differentiator</span>
          </div>
          <div className="action-description">
            Lead with a 1-page ROI summary (their goals + our impact + comparable customer result). Acknowledge the competitive evaluation and provide a differentiation table without attacking competitors.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Generate for Brightfield</button>
            <button className="action-btn-ghost">Edit template</button>
          </div>
        </div>
      </div>

      <div className="suggestions">
        <button className="suggestion-pill visible">Draft leadership pipeline update</button>
        <button className="suggestion-pill visible">Generate ROI doc for Northstar</button>
        <button className="suggestion-pill visible">Log all tasks in CRM</button>
      </div>
    </>
  )
}

// ─── Step 3: Leadership pipeline update ──────────────────────────────────────

export function SalesResponse3() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here's the leadership update on pipeline risks — written to give executives the context they need to act, not just a list of numbers.
        </p>
      </div>

      <div className="response-section-title response-section-title-taken">Pipeline status</div>
      <div className="auto-actions">
        <div className="auto-action-item">
          <div className="auto-action-text"><strong>Total pipeline:</strong> $262k in at-risk deals across 5 accounts at Proposal and Negotiation stages. Stall average: 16 days without logged activity.</div>
          <div className="auto-action-time">Overview</div>
        </div>
        <div className="auto-action-item">
          <div className="auto-action-text"><strong>Acme Corp ($84k):</strong> Pricing friction in negotiation. Proposed a phased rollout to reduce initial commitment. Champion engaged; needs exec alignment to close.</div>
          <div className="auto-action-time">Top deal</div>
        </div>
        <div className="auto-action-item">
          <div className="auto-action-text"><strong>Northstar Ltd ($52k):</strong> Missing internal sponsor — deal is stalled without a champion to push internally. Exec-to-exec touch requested.</div>
          <div className="auto-action-time">At risk</div>
        </div>
        <div className="auto-action-item">
          <div className="auto-action-text"><strong>2-week plan underway:</strong> Mutual action plans sent; ROI artifacts in progress; stakeholder mapping calls scheduled for Northstar and Brightfield.</div>
          <div className="auto-action-time">In progress</div>
        </div>
      </div>

      <div className="response-section-title response-section-title-permission">What we need from leadership</div>
      <div className="intervention-item">
        <div className="intervention-header">
          Executive sponsor for Acme Corp and Northstar Ltd
          <span className="permission-pill">Ask</span>
        </div>
        <div className="intervention-desc">
          Both deals need an exec-to-exec touch to unblock decision-making. A 15-minute intro call from a VP or C-level would significantly increase close probability. Can you reach out directly to your contacts at each?
        </div>
        <div className="action-btns">
          <button className="action-btn-primary">Confirm availability</button>
          <button className="action-btn-ghost">Share contact details</button>
        </div>
      </div>

      <div className="intervention-item">
        <div className="intervention-header">
          Approve phased rollout pricing option for Acme Corp
          <span className="permission-pill">Approval</span>
        </div>
        <div className="intervention-desc">
          Acme is hesitating on full contract value. A phased rollout (Month 1–3 at 60% seats, then full expansion) would unlock the deal. This requires pricing approval outside standard discount authority.
        </div>
        <div className="action-btns">
          <button className="action-btn-primary">Approve</button>
          <button className="action-btn-ghost">Schedule review call</button>
        </div>
      </div>

      <div className="suggestions">
        <button className="suggestion-pill visible">Generate exec intro email for Acme</button>
        <button className="suggestion-pill visible">Update CRM stage + forecast</button>
        <button className="suggestion-pill visible">Schedule weekly pipeline review</button>
      </div>
    </>
  )
}
