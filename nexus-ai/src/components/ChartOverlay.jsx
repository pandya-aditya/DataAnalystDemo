import { useEffect, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import { withChartTheme } from './chartTheme'


function getOverlayChartConfig(chartKey) {
  if (chartKey === 'q4_margin_erosion') {
    return {
      type: 'bar',
      data: {
        labels: ['October', 'November', 'December'],
        datasets: [
          {
            type: 'bar',
            label: 'Organic customer gross margin',
            data: [49, 48, 47],
            backgroundColor: '#52C97A',
            borderRadius: 6,
            yAxisID: 'y',
          },
          {
            type: 'bar',
            label: 'Paid-acquired customer gross margin',
            data: [41, 36, 31],
            backgroundColor: '#E05252',
            borderRadius: 6,
            yAxisID: 'y',
          },
          {
            type: 'bar',
            label: 'New SKU blended gross margin',
            data: [38, 34, 31],
            backgroundColor: '#E8C547',
            borderRadius: 6,
            yAxisID: 'y',
          },
          {
            type: 'line',
            label: 'Meta monthly spend',
            data: [142000, 198000, 231000],
            borderColor: '#7C6CF6',
            backgroundColor: '#7C6CF6',
            pointRadius: 3,
            tension: 0.25,
            fill: false,
            yAxisID: 'y1',
          },
          {
            type: 'line',
            label: 'Company GM target (42%)',
            data: [42, 42, 42],
            borderColor: 'rgba(232, 197, 71, 0.9)',
            borderDash: [6, 6],
            pointRadius: 0,
            tension: 0,
            fill: false,
            yAxisID: 'y',
          },
        ],
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: {
            min: 28,
            max: 52,
            ticks: { callback: (v) => `${v}%` },
          },
          y1: {
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { callback: (v) => `$${Math.round(v / 1000)}k` },
          },
        },
      },
    }
  }

  if (chartKey === 'q1_margin_projection') {
    return {
      type: 'line',
      data: {
        labels: Array.from({ length: 13 }, (_, i) => `Week ${i + 1}`),
        datasets: [
          {
            label: 'Current paid-heavy plan margin trajectory (baseline)',
            data: [33.0, 33.0, 33.1, 33.1, 33.2, 33.2, 33.3, 33.4, 33.4, 33.5, 33.6, 33.7, 34.0],
            borderColor: '#E8C547',
            backgroundColor: 'rgba(232, 197, 71, 0.18)',
            tension: 0.25,
            fill: true,
            pointRadius: 0,
          },
          {
            label: 'Projected margin with Klaviyo shift',
            data: [33.0, 33.5, 34.5, 35.5, 36.3, 37.0, 37.5, 38.0, 38.3, 38.6, 38.7, 38.8, 38.8],
            borderColor: '#52C97A',
            backgroundColor: 'rgba(82, 201, 122, 0.18)',
            tension: 0.25,
            fill: true,
            pointRadius: 0,
          },
          {
            label: 'Company gross margin target = 42%',
            data: Array.from({ length: 13 }, () => 42),
            borderColor: 'rgba(232, 197, 71, 0.9)',
            borderDash: [6, 6],
            tension: 0,
            fill: false,
            pointRadius: 0,
          },
          {
            label: 'Realistic Q1 ceiling under reallocation = 38.5%',
            data: Array.from({ length: 13 }, () => 38.5),
            borderColor: 'rgba(124, 108, 246, 0.9)',
            borderDash: [6, 6],
            tension: 0,
            fill: false,
            pointRadius: 0,
          },
        ],
      },
      options: {
        interaction: { mode: 'index', intersect: false },
        scales: {
          y: {
            min: 30,
            max: 50,
            ticks: { callback: (v) => `${v}%` },
          },
        },
      },
    }
  }

  if (chartKey === 'q1_scenarios') {
    const labels = [
      'Scenario A — Reallocation + COGS fixed',
      'Scenario B — Reallocation only, COGS unresolved',
      'Scenario C — Reallocation + SKU swap in flows, COGS unresolved',
      'Scenario D — No changes made (baseline)',
    ]

    return {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Projected Q1 blended gross margin',
            data: [38.5, 35.2, 37.8, 33.5],
            backgroundColor: ['#52C97A', '#E8C547', '#7C6CF6', '#6B7280'],
            borderRadius: 8,
          },
          {
            type: 'line',
            label: 'Company gross margin target = 42%',
            data: labels.map((y) => ({ x: 42, y })),
            borderColor: 'rgba(232, 197, 71, 0.9)',
            borderDash: [6, 6],
            pointRadius: 0,
            showLine: true,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { position: 'bottom' } },
        scales: {
          x: {
            min: 30,
            max: 50,
            ticks: { callback: (v) => `${v}%` },
          },
        },
      },
    }
  }

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
        plugins: { legend: { display: false } },
        scales: {
          y: { ticks: { callback: (v) => `$${v / 1000}k` } },
        },
      },
    }
  }

  if (chartKey === 'latency') {
    return {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'p50 (ms)',
            data: [182, 178, 191, 204, 198, 215, 211],
            borderColor: '#52C97A',
            tension: 0.3,
            fill: false,
          },
          {
            label: 'p95 (ms)',
            data: [410, 398, 461, 589, 572, 644, 631],
            borderColor: '#E05252',
            tension: 0.3,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          y: { ticks: { callback: (v) => `${v}ms` } },
        },
      },
    }
  }

  if (chartKey === 'cac_trend') {
    return {
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
        scales: { y: { ticks: { callback: (v) => `$${v}` } } },
      },
    }
  }

  if (chartKey === 'margin') {
    return {
      type: 'bar',
      data: {
        labels: ['SKU-104', 'SKU-218', 'SKU-033', 'SKU-091', 'SKU-176'],
        datasets: [
          {
            label: 'Gross Margin %',
            data: [18, 14, 11, 9, 6],
            backgroundColor: ['#E8C547', '#E8C547', '#E05252', '#E05252', '#E05252'],
            borderRadius: 6,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { callback: (v) => `${v}%` }, max: 35 },
        },
      },
    }
  }

  if (chartKey === 'pipeline') {
    return {
      type: 'bar',
      data: {
        labels: ['Discovery', 'Qualification', 'Demo/Eval', 'Proposal', 'Negotiation', 'Closed'],
        datasets: [
          {
            label: 'Deal count',
            data: [24, 18, 14, 9, 5, 3],
            backgroundColor: ['#52C97A', '#52C97A', '#E8C547', '#E8C547', '#E05252', '#52C97A'],
            borderRadius: 6,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { ticks: { callback: (v) => `${v}` } },
        },
      },
    }
  }

  if (chartKey === 'fulfillment') {
    return {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'On-time %',
            data: [96, 94, 91, 88, 85, 79, 82],
            backgroundColor: (ctx) => {
              const v = ctx.raw
              return v >= 92 ? '#52C97A' : v >= 86 ? '#E8C547' : '#E05252'
            },
            borderRadius: 6,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { ticks: { callback: (v) => `${v}%` }, min: 70, max: 100 },
        },
      },
    }
  }

  if (chartKey === 'fraud_trends') {
    return {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Chargeback rate (%)',
            data: [0.41, 0.44, 0.48, 0.61, 0.74, 0.89, 0.82],
            borderColor: '#E05252',
            tension: 0.3,
            fill: false,
          },
          {
            label: 'Manual review rate (%)',
            data: [2.1, 2.3, 2.8, 3.4, 4.1, 4.9, 4.6],
            borderColor: '#E8C547',
            tension: 0.3,
            fill: false,
          },
          {
            label: 'Approval rate (%)',
            data: [97.2, 97.1, 96.8, 96.4, 95.9, 95.3, 95.5],
            borderColor: '#52C97A',
            tension: 0.3,
            fill: false,
          },
        ],
      },
      options: {
        scales: { y: { ticks: { callback: (v) => `${v}%` } } },
      },
    }
  }

  if (chartKey === 'retention') {
    return {
      type: 'line',
      data: {
        labels: ['Week 0', 'Week 1', 'Week 2', 'Week 4', 'Week 8', 'Week 12'],
        datasets: [
          {
            label: 'Jan cohort',
            data: [100, 62, 48, 39, 31, 27],
            borderColor: '#52C97A',
            tension: 0.3,
            fill: false,
          },
          {
            label: 'Feb cohort',
            data: [100, 58, 44, 36, 29, null],
            borderColor: '#E8C547',
            tension: 0.3,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          y: { ticks: { callback: (v) => `${v}%` }, max: 110 },
        },
      },
    }
  }

  if (chartKey === 'funnel') {
    return {
      type: 'bar',
      data: {
        labels: ['Cart', 'Checkout Start', 'Shipping Step', 'Payment Step', 'Order Complete'],
        datasets: [
          {
            label: 'Control (%)',
            data: [100, 74, 51, 38, 29],
            backgroundColor: 'rgba(232,197,71,0.5)',
            borderRadius: 6,
          },
          {
            label: 'Treatment Target (%)',
            data: [100, 74, 62, 50, 38],
            backgroundColor: 'rgba(82,201,122,0.7)',
            borderRadius: 6,
          },
        ],
      },
      options: {
        scales: {
          y: { ticks: { callback: (v) => `${v}%` }, max: 110 },
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
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: false } },
      },
    }
  }

  return null
}

export default function ChartOverlay({ open, onClose, chartKey }) {
  const chartInstanceRef = useRef(null)
  const canvasRef = useRef(null)
  const [themeVersion, setThemeVersion] = useState(0)

  useEffect(() => {
    const root = document.documentElement
    const obs = new MutationObserver(() => setThemeVersion(v => v + 1))
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!open) return
    const canvas = canvasRef.current
    if (!canvas) return

    const config = withChartTheme(getOverlayChartConfig(chartKey), { variant: 'overlay' })
    if (!config) return

    if (chartInstanceRef.current) chartInstanceRef.current.destroy()
    chartInstanceRef.current = new Chart(canvas, config)

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
    }
  }, [open, chartKey, themeVersion])

  return (
    <div className={`chart-overlay${open ? ' open' : ''}`} onClick={onClose}>
      <div className="chart-overlay-inner" onClick={e => e.stopPropagation()}>
        <div className="chart-overlay-canvas-wrap">
          <canvas ref={canvasRef} aria-hidden="true" />
        </div>
      </div>
      <button type="button" className="chart-overlay-close" onClick={onClose} title="Close chart overlay" aria-label="Close chart overlay">
        ✕
      </button>
    </div>
  )
}
