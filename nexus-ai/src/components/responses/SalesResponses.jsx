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

      <div className="response-section-title">Proposed actions</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">CRM</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Restart stalled deals (next 7 days)</span>
          </div>
          <div className="action-description">
            At-risk pipeline totals <span className="code-highlight">$262k</span>. Start with Acme and Northstar (highest value + longest stall) and drive to a scheduled next step this week.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Build 2-week outreach plan</button>
            <button className="action-btn-ghost">Open stalled deals</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Enablement</span>
            <span className="action-type-pill done">Ready</span>
            <span className="action-title">Mutual action plan template</span>
          </div>
          <div className="action-description">
            Template ready for a shared close path (decision criteria, stakeholders, dates) to unblock deals stuck in Demo/Eval → Proposal.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Generate MAP</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>
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
        <p>
          Two asks unlock the highest-value stalled deals: exec sponsor outreach and approval for a phased pricing option.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Leadership pipeline summary">
            <thead>
              <tr>
                <th>Item</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>At-risk pipeline</td>
                <td>$262k across 5 accounts in Proposal/Negotiation; avg stall is 16 days without logged activity.</td>
              </tr>
              <tr>
                <td>Top deal (Acme, $84k)</td>
                <td>Pricing friction in negotiation; phased rollout proposed; needs exec alignment to close.</td>
              </tr>
              <tr>
                <td>Most at-risk (Northstar, $52k)</td>
                <td>Missing internal sponsor; exec-to-exec touch requested to unblock decision-making.</td>
              </tr>
              <tr>
                <td>Plan status</td>
                <td>Mutual action plans sent; ROI artifacts in progress; stakeholder mapping calls scheduled.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="response-section-title">Proposed actions</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Leadership</span>
            <span className="action-type-pill pending">Ask</span>
            <span className="action-title">Exec sponsor outreach for Acme + Northstar</span>
          </div>
          <div className="action-description">
            A 15-minute exec-to-exec intro call materially increases close probability for both deals. Confirm availability and share contact details.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Confirm availability</button>
            <button className="action-btn-ghost">Share contact details</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Pricing</span>
            <span className="action-type-pill pending">Approval</span>
            <span className="action-title">Approve phased rollout pricing for Acme</span>
          </div>
          <div className="action-description">
            Month 1–3 at 60% seats, then expand to full. This unlocks the deal but requires approval outside standard discount authority.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Approve</button>
            <button className="action-btn-ghost">Schedule review call</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">CRM</span>
            <span className="action-type-pill done">In progress</span>
            <span className="action-title">2-week outreach plan underway</span>
          </div>
          <div className="action-description">
            Mutual action plans and ROI artifacts are in motion; stakeholder mapping calls are scheduled for Northstar and Brightfield.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">View tasks</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>
      </div>
    </>
  )
}
