import { InlineChart } from './shared'

const FORECAST_CONFIG = {
  type: 'line',
  data: {
    labels: ['D+1', 'D+2', 'D+3', 'D+4', 'D+5', 'D+6', 'D+7'],
    datasets: [
      {
        label: 'Projected demand',
        data: [92, 97, 101, 126, 141, 134, 118],
        borderColor: '#E8C547',
        backgroundColor: 'rgba(232,197,71,0.18)',
        tension: 0.25,
        fill: true,
      },
    ],
  },
  options: {
    scales: { y: { beginAtZero: false } },
  },
}


export default function Response3({ onExpandChart }) {
  return (
    <>
      <div className="ai-text">
        <p>
          Inventory looks tight on a few Winter Collection staples. The 14‑day Northeast forecast shows a sharp temperature drop mid‑window, which historically lifts demand for outerwear.
        </p>
        <p>
          I recommend raising reorder points for the highest-velocity SKUs and preparing a purchase order draft.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="Projected demand index (next 7 days)"
          onExpand={() => onExpandChart?.('forecast')}
          config={FORECAST_CONFIG}
        />
      </div>

      <div className="response-section-title">Proposed actions</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">BigQuery</span>
            <span className="action-type-pill pending">Suggested</span>
            <span className="action-title">Increase reorder points</span>
          </div>
          <div className="action-detail">
            Raise reorder points by <span className="code-highlight">+40%</span> for 4 SKUs with stockout risk &lt; 9 days.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Apply changes</button>
            <button className="action-btn-ghost">View SKUs</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">Slack</span>
            <span className="action-type-pill done">Ready</span>
            <span className="action-title">Set threshold alert</span>
          </div>
          <div className="action-description">
            Alerts when projected stock coverage drops below 7 days for any Winter Collection SKU.
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

