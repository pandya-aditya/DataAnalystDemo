import { useEffect, useMemo, useRef, useState } from 'react'
import Chart from 'chart.js/auto'
import { withChartTheme } from '../chartTheme'

export function InlineChart({ title, config, buildConfig, onExpand }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const [themeVersion, setThemeVersion] = useState(0)

  useEffect(() => {
    const root = document.documentElement
    const obs = new MutationObserver(() => setThemeVersion(v => v + 1))
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])

  const resolvedConfig = useMemo(() => {
    if (typeof buildConfig === 'function') return buildConfig()
    if (typeof config === 'function') return config()
    return config ?? null
  }, [buildConfig, config])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const themed = withChartTheme(resolvedConfig, { variant: 'inline' })
    if (!themed) return

    if (chartRef.current) chartRef.current.destroy()
    chartRef.current = new Chart(canvas, themed)

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [resolvedConfig, themeVersion])

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
        <canvas ref={canvasRef} aria-label={title} role="img" />
      </div>
    </div>
  )
}
