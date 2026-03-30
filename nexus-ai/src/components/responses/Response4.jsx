export default function Response4() {
  return (
    <>
      <div className="ai-text">
        <p>
          Weekend summary is ready. I consolidated performance, flagged items that need your attention, and outlined a plan for the week.
        </p>
        <p>
          Two items need approval to move quickly this week; everything else is already staged and ready to execute.
        </p>
      </div>

      <div className="response-section-title">Proposed actions</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Meta Ads</span>
            <span className="action-type-pill pending">Approval</span>
            <span className="action-title">Increase prospecting spend by 15%</span>
          </div>
          <div className="action-description">
            Efficiency improved on retargeting; prospecting is constrained. Shift budget from TikTok to Meta for the next 72 hours and monitor CAC daily.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Approve</button>
            <button className="action-btn-ghost">Not now</button>
          </div>
        </div>

        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">Klaviyo</span>
            <span className="action-type-pill pending">Approval</span>
            <span className="action-title">Launch winback email to lapsed customers</span>
          </div>
          <div className="action-description">
            Target customers with prior AOV above $120 and no purchase in 30+ days. Draft copy and a send-time recommendation.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Approve</button>
            <button className="action-btn-ghost">Edit first</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Ads</span>
            <span className="action-type-pill done">Completed</span>
            <span className="action-title">Paused 2 underperforming ad sets</span>
          </div>
          <div className="action-description">
            Guardrails triggered on CPA; paused the two worst performers and preserved budget for higher-intent segments.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">View changes</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Pipelines</span>
            <span className="action-type-pill done">Completed</span>
            <span className="action-title">Refreshed KPI cache + anomaly report</span>
          </div>
          <div className="action-description">
            Synced 12 sources, refreshed KPI cache, and filed the weekly anomaly report for shipping cost variance.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Open report</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>
      </div>
    </>
  )
}
