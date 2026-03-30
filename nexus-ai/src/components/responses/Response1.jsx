export default function Response1() {
  return (
    <>
      <div className="ai-text">
        <p>
          Here’s the blended CAC for the last 7 days across Meta, Google, and TikTok, compared to predicted 30‑day LTV by acquisition source.
        </p>
        <p>
          Two channels are compressing margin: TikTok is trending high CAC relative to LTV, and Google Search is borderline. Meta is healthy.
        </p>
      </div>

      <div className="data-block">
        <div className="data-table-wrap">
          <table className="data-table" aria-label="Channel performance table">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Spend (7d)</th>
                <th>CAC</th>
                <th>Pred LTV (30d)</th>
                <th>LTV:CAC</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Meta</td>
                <td>$41,200</td>
                <td className="cell-green">$28.40</td>
                <td>$142.00</td>
                <td className="cell-green">5.0×</td>
                <td><span className="status-badge status-good">Healthy</span></td>
              </tr>
              <tr>
                <td>Google</td>
                <td>$28,900</td>
                <td className="cell-amber">$44.10</td>
                <td>$162.50</td>
                <td className="cell-amber">3.7×</td>
                <td><span className="status-badge status-ok">Watch</span></td>
              </tr>
              <tr>
                <td>TikTok</td>
                <td>$19,300</td>
                <td className="cell-red">$61.80</td>
                <td>$118.20</td>
                <td className="cell-red">1.9×</td>
                <td><span className="status-badge status-alert">Action</span></td>
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
            <span className="action-title">Reallocate spend to Meta</span>
          </div>
          <div className="action-detail">
            Pause bottom-quartile TikTok ad sets and shift <span className="code-highlight">15–25%</span> of spend into Meta high-intent audiences; tighten Google brand exclusions.
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
            <span className="action-title">Set CAC guardrails</span>
          </div>
          <div className="action-description">
            Alert when TikTok CAC exceeds <span className="code-highlight">$55</span> or LTV:CAC drops below <span className="code-highlight">2.5×</span>, and send a weekly channel health summary.
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
