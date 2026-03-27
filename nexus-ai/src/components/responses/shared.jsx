import { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'

export function InlineChart({ title, buildConfig, onExpand }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const config = buildConfig?.()
    if (!config) return

    if (chartRef.current) chartRef.current.destroy()
    chartRef.current = new Chart(canvas, config)

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [buildConfig])

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="chart-title">{title}</div>
        {onExpand && (
          <button className="chart-expand-btn" onClick={onExpand} title="Expand chart" aria-label="Expand chart">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 2H2v4M10 14h4v-4M2 10v4h4M14 6V2h-4"/>
            </svg>
          </button>
        )}
      </div>
      <div className="chart-canvas-wrap">
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
    </div>
  )
}

