import Response1 from './responses/Response1'
import Response2 from './responses/Response2'
import Response3 from './responses/Response3'
import Response4 from './responses/Response4'
import { getResponseStep } from './responses/roleResponses'
import AgentResponseLayout from './AgentResponseLayout'

export default function AIResponse({ templateId, roleCategory, roleStepIndex, text, onExpandChart, onSuggestedPrompt }) {
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
      <AgentResponseLayout onSuggestedPrompt={onSuggestedPrompt}>
        {renderRaw()}
      </AgentResponseLayout>
    </div>
  )
}
