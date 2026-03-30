import { useState, useEffect } from 'react'

export default function ThoughtTrace({ lines, collapsing }) {
  const [visibleCount, setVisibleCount] = useState(0)

  useEffect(() => {
    setVisibleCount(0)
    const timers = lines.map((_, i) =>
      setTimeout(() => setVisibleCount(i + 1), i * 280)
    )
    return () => timers.forEach(clearTimeout)
  }, [lines])

  return (
    <div className={`thought-trace${collapsing ? ' collapsing' : ''}`}>
      {lines.map((line, i) => (
        <div
          key={i}
          className={`trace-line${i < visibleCount ? ' visible' : ''}${i === lines.length - 1 && i < visibleCount ? ' complete' : ''}`}
        >
          →&nbsp;&nbsp;{line}
        </div>
      ))}
    </div>
  )
}
