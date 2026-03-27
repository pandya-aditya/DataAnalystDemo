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

      <div className="insight-callout">
        Recommendation: pause the worst-performing TikTok ad sets, reallocate 15–25% of spend to Meta high-intent audiences, and tighten Google brand exclusions.
      </div>

      <div className="suggestions">
        <button className="suggestion-pill visible">Draft reallocation plan</button>
        <button className="suggestion-pill visible">Show cohorts by creative</button>
        <button className="suggestion-pill visible">Set CAC guardrails</button>
      </div>
    </>
  )
}

