import { Children, Fragment, cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from 'react'
import { useSourceAccess } from './SourceAccessContext'

const INTERNAL_ACTION_SOURCES = new Set(['Pipelines'])

const SOURCE_ALIASES = {
  Meta: 'Meta Ads',
  'Meta Ads': 'Meta Ads',
  TikTok: 'TikTok Ads',
  'TikTok Ads': 'TikTok Ads',
  Google: 'Google Ads',
  'Google Ads': 'Google Ads',
  Slack: 'Slack',
  Klaviyo: 'Klaviyo',
  Shopify: 'Shopify',
  GA4: 'GA4',
  BigQuery: 'BigQuery',
  Stripe: 'Stripe',
  Gorgias: 'Gorgias',
  Returnly: 'Returnly',
  ShipStation: 'ShipStation',
}

function flattenChildren(children) {
  const out = []
  Children.forEach(children, (child) => {
    if (child == null || child === false) return
    if (isValidElement(child) && child.type === Fragment) {
      out.push(...flattenChildren(child.props?.children))
      return
    }
    out.push(child)
  })
  return out
}

function classHas(el, token) {
  if (!isValidElement(el)) return false
  const className = el.props?.className
  if (typeof className !== 'string') return false
  return className.split(/\s+/).includes(token)
}

function classIncludes(el, needle) {
  if (!isValidElement(el)) return false
  const className = el.props?.className
  if (typeof className !== 'string') return false
  return className.includes(needle)
}

function collectText(node) {
  if (node == null || node === false) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (!isValidElement(node)) return ''
  const children = flattenChildren(node.props?.children)
  return children.map(collectText).join('')
}

function findFirstTextByClass(node, classToken) {
  if (!isValidElement(node)) return null
  if (classHas(node, classToken)) return collectText(node.props?.children).trim() || null

  const children = flattenChildren(node.props?.children)
  for (const child of children) {
    const found = findFirstTextByClass(child, classToken)
    if (found) return found
  }
  return null
}

function replaceFirstByClass(node, classToken, replaceFn) {
  if (!isValidElement(node)) return node
  if (classHas(node, classToken)) return replaceFn(node)

  const children = flattenChildren(node.props?.children)
  let replaced = false
  const nextChildren = children.map((child) => {
    if (replaced) return child
    if (!isValidElement(child)) return child
    const nextChild = replaceFirstByClass(child, classToken, (match) => {
      replaced = true
      return replaceFn(match)
    })
    return nextChild
  })

  if (!replaced) return node
  return cloneElement(node, { ...node.props }, ...nextChildren)
}

function normalizeSources(platformBadgeText) {
  if (!platformBadgeText) return []
  const raw = platformBadgeText.trim()
  if (!raw) return []

  if (raw === 'Ads') return ['Meta Ads', 'Google Ads', 'TikTok Ads']

  const parts = raw
    .split(/[\/,&+]/g)
    .map(s => s.trim())
    .filter(Boolean)

  const normalized = parts
    .map((p) => SOURCE_ALIASES[p] ?? p)
    .filter(Boolean)

  return Array.from(new Set(normalized))
}

function shouldTreatAsExternalAction(platformBadgeText) {
  const badge = (platformBadgeText || '').trim()
  if (!badge) return true
  if (INTERNAL_ACTION_SOURCES.has(badge)) return false
  return true
}

function reclassActionCard(card, nextStatus) {
  if (!isValidElement(card)) return card
  const base = String(card.props?.className || '')
  const without = base
    .split(/\s+/)
    .filter(Boolean)
    .filter(c => c !== 'pending' && c !== 'done' && c !== 'alert')
    .join(' ')

  const updated = cloneElement(card, { ...card.props, className: `${without} ${nextStatus}`.trim() })

  return replaceFirstByClass(updated, 'action-type-pill', (pill) => {
    const nextPillClass = `action-type-pill ${nextStatus === 'done' ? 'done' : 'pending'}`
    const nextText = nextStatus === 'done' ? 'Completed' : 'Needs approval'
    return cloneElement(pill, { ...pill.props, className: nextPillClass }, nextText)
  })
}

function extractActionCards(nodes) {
  const actionContainers = nodes.filter(n => classHas(n, 'action-cards'))
  if (actionContainers.length === 0) return []

  const cards = []
  for (const container of actionContainers) {
    const children = flattenChildren(container.props?.children)
    for (const child of children) {
      if (classIncludes(child, 'action-card')) cards.push(child)
    }
  }
  return cards
}

function extractSuggestedPrompts(actionCards) {
  const ignore = new Set(['Approve', 'Not now', 'Later', 'Dismiss', 'View changes', 'Open report'])
  const labels = []

  for (const card of actionCards) {
    const btns = []
    const primary = findAllTextByClass(card, 'action-btn-primary')
    const ghost = findAllTextByClass(card, 'action-btn-ghost')
    btns.push(...primary, ...ghost)
    for (const b of btns) {
      const label = (b || '').trim()
      if (!label) continue
      if (ignore.has(label)) continue
      if (label.length < 8) continue
      labels.push(label)
    }
  }

  const uniq = Array.from(new Set(labels)).slice(0, 4)
  return uniq
}

function findAllTextByClass(node, classToken) {
  const out = []
  const visit = (n) => {
    if (!isValidElement(n)) return
    if (classHas(n, classToken)) {
      const text = collectText(n.props?.children).trim()
      if (text) out.push(text)
    }
    const children = flattenChildren(n.props?.children)
    children.forEach(visit)
  }
  visit(node)
  return out
}

function attachActionButtonHandlers(node, ctx) {
  const { onAction, cardKey, runState } = ctx
  if (!isValidElement(node)) return node
  const cn = node.props?.className || ''
  const classStr = typeof cn === 'string' ? cn : ''

  const children = flattenChildren(node.props?.children)
  const nextChildren = children.map(c => attachActionButtonHandlers(c, ctx))

  const isActionBtn = node.type === 'button' && (
    classStr.includes('action-btn-primary') || classStr.includes('action-btn-ghost')
  )

  if (isActionBtn) {
    const label = collectText(node.props?.children).trim() || 'Action'
    const btnKey = `${cardKey}::${label}`
    const phase = runState[btnKey]
    const prevOnClick = node.props?.onClick
    const baseClass = classStr.replace(/\s+action-btn-executing\b|\s+action-btn-completed\b/g, '').trim()
    const phaseClass =
      phase === 'executing' ? 'action-btn-executing'
        : phase === 'completed' ? 'action-btn-completed'
          : ''
    const mergedClass = [baseClass, phaseClass].filter(Boolean).join(' ')
    const shownText =
      phase === 'executing' ? 'Executing'
        : phase === 'completed' ? 'Completed'
          : null
    return cloneElement(
      node,
      {
        ...node.props,
        type: node.props?.type ?? 'button',
        className: mergedClass,
        disabled: Boolean(phase),
        onClick: (e) => {
          if (phase) {
            e.preventDefault()
            return
          }
          prevOnClick?.(e)
          onAction(label)
        },
      },
      shownText ?? nextChildren,
    )
  }

  if (nextChildren.some((c, i) => c !== children[i])) {
    return cloneElement(node, { ...node.props }, ...nextChildren)
  }
  return node
}

function EmptyState({ label }) {
  return (
    <div className="agent-empty" aria-label={label}>
      —
    </div>
  )
}

function Section({ children }) {
  return (
    <section className="agent-section">
      <div className="agent-section-body">{children}</div>
    </section>
  )
}

/** Renders above the input bar; exported for CanvasArea. */
export function SuggestedPromptPills({ prompts, onSelect }) {
  if (!Array.isArray(prompts) || prompts.length === 0) return null
  return (
    <div className="suggestions suggestions-above-input" role="list" aria-label="Suggested prompts">
      {prompts.map((p) => (
        <button
          key={p}
          type="button"
          className="suggestion-pill visible"
          onClick={() => onSelect?.(p)}
          title={p}
          aria-label={p}
        >
          {p}
        </button>
      ))}
    </div>
  )
}

function ActionCards({ cards, sectionPrefix, doneKeys, runState, onMarkAction }) {
  if (!Array.isArray(cards) || cards.length === 0) return <EmptyState label="No actions" />
  return (
    <div className="action-cards">
      {cards.map((c, idx) => {
        const key = `${sectionPrefix}-${idx}`
        const resolved =
          sectionPrefix === 'needs' && doneKeys.has(key)
            ? reclassActionCard(c, 'done')
            : c
        const withHandlers = attachActionButtonHandlers(resolved, {
          onAction: (label) => onMarkAction(key, label),
          cardKey: key,
          runState,
        })
        return <Fragment key={key}>{withHandlers}</Fragment>
      })}
    </div>
  )
}

const ACTION_RUN_MS = 1500

export default function AgentResponseLayout({ children, onSuggestedPromptsChange, onAgentActionCompleted }) {
  const { canWrite } = useSourceAccess()
  const [doneActionKeys, setDoneActionKeys] = useState(() => new Set())
  const [runState, setRunState] = useState({})
  const runTimeoutsRef = useRef([])
  const actionRunInflightRef = useRef(new Set())

  useEffect(() => () => {
    runTimeoutsRef.current.forEach((id) => window.clearTimeout(id))
    runTimeoutsRef.current = []
  }, [])

  const onMarkAction = useCallback((cardKey, label) => {
    const btnKey = `${cardKey}::${label}`
    if (actionRunInflightRef.current.has(btnKey)) return
    actionRunInflightRef.current.add(btnKey)
    setRunState((prev) => ({ ...prev, [btnKey]: 'executing' }))
    const t = window.setTimeout(() => {
      setRunState((prev) => ({ ...prev, [btnKey]: 'completed' }))
      setDoneActionKeys((prev) => new Set(prev).add(cardKey))
      onAgentActionCompleted?.({ text: label })
    }, ACTION_RUN_MS)
    runTimeoutsRef.current.push(t)
  }, [onAgentActionCompleted])

  const nodes = flattenChildren(children)

  const analysis = nodes.filter(n => classHas(n, 'ai-text') || classHas(n, 'insight-callout'))
  const data = nodes.filter(n => classHas(n, 'data-block'))
  const actionCards = extractActionCards(nodes)
  const uncategorized = nodes.filter((n) => (
    !classHas(n, 'ai-text')
    && !classHas(n, 'insight-callout')
    && !classHas(n, 'data-block')
    && !classHas(n, 'action-cards')
    && !classIncludes(n, 'response-section-title')
    && !classHas(n, 'suggestions')
  ))

  const prompts = extractSuggestedPrompts(actionCards)
  const promptsKey = prompts.join('\0')

  useEffect(() => {
    if (!onSuggestedPromptsChange) return
    onSuggestedPromptsChange(prompts)
    return () => {
      onSuggestedPromptsChange([])
    }
  }, [promptsKey, onSuggestedPromptsChange])

  const taken = []
  const needsPermission = []

  for (const card of actionCards) {
    const badge = findFirstTextByClass(card, 'platform-badge') ?? ''
    if (!shouldTreatAsExternalAction(badge)) continue

    const sources = normalizeSources(badge)

    let allowed = false
    if (badge.trim() === 'Ads') {
      allowed = sources.some(s => canWrite(s))
    } else if (sources.length > 0) {
      allowed = sources.every(s => canWrite(s))
    } else {
      allowed = false
    }

    if (allowed) taken.push(reclassActionCard(card, 'done'))
    else needsPermission.push(reclassActionCard(card, 'pending'))
  }

  const analysisBlock = analysis.length > 0 ? analysis : uncategorized.length > 0 ? uncategorized : null

  return (
    <div className="agent-response-sections">
      {analysisBlock?.length ? <Section>{analysisBlock}</Section> : null}
      {data.length ? <Section>{data}</Section> : null}
      {taken.length ? (
        <Section>
          <ActionCards
            cards={taken}
            sectionPrefix="taken"
            doneKeys={doneActionKeys}
            runState={runState}
            onMarkAction={onMarkAction}
          />
        </Section>
      ) : null}
      {needsPermission.length ? (
        <Section>
          <ActionCards
            cards={needsPermission}
            sectionPrefix="needs"
            doneKeys={doneActionKeys}
            runState={runState}
            onMarkAction={onMarkAction}
          />
        </Section>
      ) : null}
    </div>
  )
}
