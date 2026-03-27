export default function Response4() {
  return (
    <>
      <div className="ai-text">
        <p>
          Weekend summary is ready. I consolidated performance, flagged items that need your attention, and outlined a plan for the week.
        </p>
      </div>

      <div className="response-section-title response-section-title-taken">Completed</div>
      <div className="auto-actions">
        <div className="auto-action-item">
          <div className="auto-action-text">Paused 2 underperforming ad sets after CPA breached guardrails.</div>
          <div className="auto-action-time">Sat 10:14</div>
        </div>
        <div className="auto-action-item">
          <div className="auto-action-text">Synced 12 sources and refreshed KPI cache.</div>
          <div className="auto-action-time">Sat 11:02</div>
        </div>
        <div className="auto-action-item">
          <div className="auto-action-text">Filed weekly anomaly report for shipping cost variance.</div>
          <div className="auto-action-time">Sun 08:41</div>
        </div>
        <div className="auto-action-item">
          <div className="auto-action-text">Drafted a retention segment for high-LTV customers with 21–30 day inactivity.</div>
          <div className="auto-action-time">Sun 17:26</div>
        </div>
      </div>

      <div className="response-section-title response-section-title-permission">Needs your input</div>
      <div className="intervention-item">
        <div className="intervention-header">
          Increase prospecting spend on Meta by 15%
          <span className="permission-pill">Approval</span>
        </div>
        <div className="intervention-desc">
          Efficiency improved on retargeting; prospecting is constrained. I can shift budget from TikTok to Meta for the next 72 hours and monitor CAC daily.
        </div>
        <div className="action-btns">
          <button className="action-btn-primary">Approve</button>
          <button className="action-btn-ghost">Not now</button>
        </div>
      </div>

      <div className="intervention-item">
        <div className="intervention-header">
          Launch a winback email to lapsed customers
          <span className="permission-pill">Approval</span>
        </div>
        <div className="intervention-desc">
          This targets customers with prior AOV above $120 and no purchase in 30+ days. I’ll draft copy and a send-time recommendation.
        </div>
        <div className="action-btns">
          <button className="action-btn-primary">Approve</button>
          <button className="action-btn-ghost">Edit first</button>
        </div>
      </div>
    </>
  )
}

