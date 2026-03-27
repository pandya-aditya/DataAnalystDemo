import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

function getOverlayChartConfig(chartKey) {
  if (chartKey === 'waterfall') {
    return {
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
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { ticks: { callback: (v) => `$${v / 1000}k` } },
        },
      },
    }
  }

  if (chartKey === 'forecast') {
    return {
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
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: false } },
      },
    }
  }

  return null
}

export default function ChartOverlay({ open, onClose, chartKey }) {
  const chartInstanceRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const canvas = document.getElementById('overlayChart')
    if (!canvas) return

    const config = getOverlayChartConfig(chartKey)
    if (!config) return

    if (chartInstanceRef.current) chartInstanceRef.current.destroy()
    chartInstanceRef.current = new Chart(canvas, config)

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
    }
  }, [open, chartKey])

  return (
    <div className={`chart-overlay${open ? ' open' : ''}`} onClick={onClose}>
      <div className="chart-overlay-inner" onClick={e => e.stopPropagation()}>
        <canvas id="overlayChart" width="640" height="320" aria-hidden="true" />
      </div>
      <button type="button" className="chart-overlay-close" onClick={onClose} title="Close chart overlay" aria-label="Close chart overlay">
        ✕
      </button>
    </div>
  )
}
