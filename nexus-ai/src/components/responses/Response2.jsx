import { InlineChart } from './shared'

const WATERFALL_CONFIG = {
  type: 'bar',
  data: {
    labels: ['Gross', 'Refunds', 'Shipping', 'Fees', 'Net'],
    datasets: [
      {
        label: 'USD',
        data: [124000, -9200, -14800, -5300, 94700],
        backgroundColor: ['#52C97A', '#E05252', '#E8C547', '#E8C547', '#52C97A'],
        borderRadius: 4,
      },
    ],
  },
  options: {
    scales: {
      y: { ticks: { callback: (v) => `$${v / 1000}k` } },
    },
  },
}


export default function Response2({ onExpandChart }) {
  return (
    <>
      <div className="ai-text">
        <p>
          You’re right to notice it: revenue is roughly flat, but costs moved against you. The biggest drivers are higher shipping charges and an uptick in refunds on a small set of SKUs.
        </p>
        <p>
          Below is a profit bridge for the last 30 days vs the prior 30 days.
        </p>
      </div>

      <div className="data-block">
        <InlineChart
          title="Profit bridge (30d vs prior)"
          onExpand={() => onExpandChart?.('waterfall')}
          config={WATERFALL_CONFIG}
        />
      </div>

      <div className="response-section-title">Proposed actions</div>
      <div className="action-cards">
        <div className="action-card visible pending">
          <div className="action-card-header">
            <span className="platform-badge">ShipStation</span>
            <span className="action-type-pill pending">Needs review</span>
            <span className="action-title">Audit carrier rate changes</span>
          </div>
          <div className="action-detail">
            Compare <span className="code-highlight">USPS Priority</span> vs <span className="code-highlight">UPS Ground</span> zone pricing for your top lanes.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Open rate audit</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>

        <div className="action-card visible alert">
          <div className="action-card-header">
            <span className="platform-badge">Returnly</span>
            <span className="action-type-pill alert">Priority</span>
            <span className="action-title">Investigate refund cluster</span>
          </div>
          <div className="action-description">
            3 SKUs account for ~52% of the month-over-month increase in refunds. I can pull ticket themes and create a remediation checklist.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Generate checklist</button>
            <button className="action-btn-ghost">Later</button>
          </div>
        </div>

        <div className="action-card visible done">
          <div className="action-card-header">
            <span className="platform-badge">BigQuery</span>
            <span className="action-type-pill done">Ready</span>
            <span className="action-title">Set cost variance alerts</span>
          </div>
          <div className="action-description">
            Daily alert when shipping cost/order moves &gt; <span className="code-highlight">$1.00</span> or refund rate moves &gt; <span className="code-highlight">1.5 pts</span> versus the prior 7‑day average.
          </div>
          <div className="action-btns">
            <button className="action-btn-primary">Create alert</button>
            <button className="action-btn-ghost">Dismiss</button>
          </div>
        </div>
      </div>
    </>
  )
}
