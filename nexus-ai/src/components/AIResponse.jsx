import { useMemo, useState } from 'react'
import Response1 from './responses/Response1'
import Response2 from './responses/Response2'
import Response3 from './responses/Response3'
import Response4 from './responses/Response4'
import { getResponseStep } from './responses/roleResponses'
import AgentResponseLayout from './AgentResponseLayout'
import BrainDisclosure from './BrainDisclosure'

export default function AIResponse({
  templateId,
  roleCategory,
  roleStepIndex,
  text,
  onExpandChart,
  onAgentActionCompleted,
  traceLines,
  suggestedPrompts,
  onSelectSuggestedPrompt,
}) {
  const [layoutSuggestedPrompts, setLayoutSuggestedPrompts] = useState([])

  const resolvedSuggestedPrompts = useMemo(() => {
    const explicit = Array.isArray(suggestedPrompts) ? suggestedPrompts : []
    const fallback = Array.isArray(layoutSuggestedPrompts) ? layoutSuggestedPrompts : []
    const base = explicit.length ? explicit : fallback
    return Array.from(new Set(base.map(s => String(s || '').trim()).filter(Boolean))).slice(0, 6)
  }, [suggestedPrompts, layoutSuggestedPrompts])

  const renderRaw = () => {
    if (roleCategory && Number.isFinite(roleStepIndex)) {
      const RoleComponent = getResponseStep(roleCategory, roleStepIndex)
      if (RoleComponent) return RoleComponent({ onExpandChart })
    }
    if (templateId === 1) return Response1({})
    if (templateId === 2) return Response2({ onExpandChart })
    if (templateId === 3) return Response3({ onExpandChart })
    if (templateId === 4) return Response4({})
    return (
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {text}
      </div>
    )
  }

  return (
    <div className="ai-response">
      <div className="ai-label">Nexus &nbsp;·&nbsp; just now</div>
      <AgentResponseLayout
        onSuggestedPromptsChange={setLayoutSuggestedPrompts}
        onAgentActionCompleted={onAgentActionCompleted}
      >
        {renderRaw()}
      </AgentResponseLayout>
      <BrainDisclosure
        traceLines={traceLines}
        suggestedPrompts={resolvedSuggestedPrompts}
        onSelectSuggestedPrompt={onSelectSuggestedPrompt}
      />
    </div>
  )
}
