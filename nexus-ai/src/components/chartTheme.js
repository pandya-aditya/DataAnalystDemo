export function withChartTheme(baseConfig, { variant = 'inline' } = {}) {
  if (!baseConfig) return null

  const style = getComputedStyle(document.documentElement)
  const textPrimary = style.getPropertyValue('--text-primary').trim() || '#151B26'
  const textSecondary = style.getPropertyValue('--text-secondary').trim() || '#46566F'
  const textMuted = style.getPropertyValue('--text-muted').trim() || '#6A7890'
  const borderSubtle = style.getPropertyValue('--border-subtle').trim() || '#D7DEE8'
  const bgSurface = style.getPropertyValue('--bg-surface').trim() || '#FFFFFF'

  const isInline = variant === 'inline'
  const baseFontSize = isInline ? 10 : 12
  const tickFontSize = isInline ? 10 : 11
  const legendFontSize = isInline ? 10 : 11
  const tooltipFontSize = isInline ? 11 : 12
  const layoutPadding = isInline
    ? { top: 6, right: 10, bottom: 0, left: 6 }
    : { top: 10, right: 14, bottom: 8, left: 10 }

  const datasetCount = baseConfig.data?.datasets?.length ?? 0
  const defaultLegendDisplay = datasetCount > 1
  const legendDisplay = baseConfig.options?.plugins?.legend?.display ?? defaultLegendDisplay

  const incomingScales = baseConfig.options?.scales ?? {}
  const themedScales = Object.fromEntries(
    Object.entries(incomingScales).map(([axisKey, axis]) => {
      const grid = axis?.grid ?? {}
      const ticks = axis?.ticks ?? {}
      return [
        axisKey,
        {
          ...axis,
          grid: {
            drawBorder: false,
            color: borderSubtle,
            ...grid,
          },
          ticks: {
            color: textMuted,
            font: { size: tickFontSize },
            maxRotation: 0,
            autoSkip: true,
            padding: 6,
            ...ticks,
          },
        },
      ]
    })
  )

  // If the caller didn't specify scales at all, still apply sane defaults for x/y.
  if (!baseConfig.options?.scales) {
    themedScales.x = {
      grid: { display: false, drawBorder: false, color: borderSubtle },
      ticks: { color: textMuted, font: { size: tickFontSize }, maxRotation: 0, autoSkip: true, padding: 6 },
    }
    themedScales.y = {
      grid: { drawBorder: false, color: borderSubtle },
      ticks: { color: textMuted, font: { size: tickFontSize }, padding: 6 },
    }
  } else {
    // Reduce clutter for compact charts unless explicitly overridden.
    if (themedScales.x && themedScales.x.grid && themedScales.x.grid.display === undefined) {
      themedScales.x.grid.display = false
    }
  }

  return {
    ...baseConfig,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      ...baseConfig.options,
      layout: {
        padding: layoutPadding,
        ...baseConfig.options?.layout,
      },
      font: {
        family: "DM Sans, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        size: baseFontSize,
        ...baseConfig.options?.font,
      },
      interaction: {
        mode: baseConfig.type === 'bar' ? 'nearest' : 'index',
        intersect: false,
        ...baseConfig.options?.interaction,
      },
      elements: {
        line: { borderWidth: 2 },
        point: { radius: isInline ? 0 : 2, hoverRadius: 3, hitRadius: 10 },
        bar: { borderSkipped: false },
        ...baseConfig.options?.elements,
      },
      plugins: {
        ...baseConfig.options?.plugins,
        legend: {
          display: legendDisplay,
          position: 'bottom',
          align: 'start',
          ...baseConfig.options?.plugins?.legend,
          labels: {
            color: textSecondary,
            boxWidth: 10,
            boxHeight: 10,
            usePointStyle: true,
            pointStyle: 'circle',
            padding: isInline ? 10 : 14,
            font: { size: legendFontSize },
            ...baseConfig.options?.plugins?.legend?.labels,
          },
        },
        tooltip: {
          backgroundColor: bgSurface,
          titleColor: textPrimary,
          bodyColor: textSecondary,
          borderColor: borderSubtle,
          borderWidth: 1,
          padding: 10,
          titleFont: { size: tooltipFontSize, weight: '600' },
          bodyFont: { size: tooltipFontSize },
          displayColors: datasetCount > 1,
          ...baseConfig.options?.plugins?.tooltip,
        },
      },
      scales: themedScales,
    },
  }
}

