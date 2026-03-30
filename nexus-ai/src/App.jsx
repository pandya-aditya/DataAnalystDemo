import { useState, useRef, useEffect, useCallback } from 'react'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import CanvasArea from './components/CanvasArea'
import ContextPanel from './components/ContextPanel'
import SettingsOverlay from './components/SettingsOverlay'
import ChartOverlay from './components/ChartOverlay'
import LoginPage from './components/Loginpage'
import OnboardingPage from './components/OnboardingPage'
import { CONVERSATIONS } from './constants/data'
import { buildRoleSession } from './constants/roleSessions'

export default function App() {
  const THEME_STORAGE_KEY = 'nexus-theme'
  const CHAT_SESSIONS_STORAGE_KEY = 'nexus-chat-sessions-v1'
  const ACTIVE_CHAT_SESSION_STORAGE_KEY = 'nexus-active-chat-session-v1'
  const [appStep, setAppStep] = useState('login')
  const [userProfile, setUserProfile] = useState(null)

  const [activeConversationId, setActiveConversationId] = useState(null)
  const [activeChatSessionId, setActiveChatSessionId]  = useState(() => {
    if (typeof window === 'undefined') return null
    const stored = window.localStorage.getItem(ACTIVE_CHAT_SESSION_STORAGE_KEY)
    return stored ? stored : null
  })
  const [sessionName, setSessionName]              = useState('New conversation')
  const [messages, setMessages]                    = useState([])
  const [completedActions, setCompletedActions]    = useState([])
  const [inputValue, setInputValue]                = useState('')
  const [agentResponding, setAgentResponding]      = useState(false)
  const agentRespondingRef                         = useRef(false)
  const [guidedPrompt, setGuidedPrompt]            = useState(null)
  const [showConversation, setShowConversation]    = useState(false)
  const [contextPanelOpen, setContextPanelOpen]   = useState(false)
  const [settingsOpen, setSettingsOpen]            = useState(false)
  const [chartOverlayOpen, setChartOverlayOpen]   = useState(false)
  const [chartOverlayKey, setChartOverlayKey]     = useState(null)
  const [themeMode, setThemeMode]                 = useState(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'dark' || stored === 'light' || stored === 'system' ? stored : 'light'
  })

  const [chatSessions, setChatSessions] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const raw = window.localStorage.getItem(CHAT_SESSIONS_STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const suppressContextPanelAutoOpenRef = useRef(false)
  const activeConversationIdRef = useRef(activeConversationId)
  const activeChatSessionIdRef = useRef(activeChatSessionId)

  useEffect(() => { activeConversationIdRef.current = activeConversationId }, [activeConversationId])
  useEffect(() => { activeChatSessionIdRef.current = activeChatSessionId }, [activeChatSessionId])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(CHAT_SESSIONS_STORAGE_KEY, JSON.stringify(chatSessions))
    } catch {
      // ignore storage failures (private mode, quotas, etc.)
    }
  }, [chatSessions])

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      if (activeChatSessionId) window.localStorage.setItem(ACTIVE_CHAT_SESSION_STORAGE_KEY, activeChatSessionId)
      else window.localStorage.removeItem(ACTIVE_CHAT_SESSION_STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [activeChatSessionId])

  useEffect(() => {
    if (!activeChatSessionId) return
    const exists = chatSessions.some(s => s?.id === activeChatSessionId)
    if (exists) return
    setActiveChatSessionId(null)
  }, [activeChatSessionId, chatSessions])

  const openContextPanel = useCallback(() => {
    suppressContextPanelAutoOpenRef.current = false
    setContextPanelOpen(true)
  }, [])

  const closeContextPanel = useCallback(() => {
    suppressContextPanelAutoOpenRef.current = true
    setContextPanelOpen(false)
  }, [])

  const toggleContextPanel = useCallback(() => {
    setContextPanelOpen(prev => {
      const next = !prev
      suppressContextPanelAutoOpenRef.current = !next
      return next
    })
  }, [])

  // ── Timer management ─────────────────────────────────────────
  const timersRef = useRef([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(id => {
      if (typeof id === 'object') clearInterval(id)
      else clearTimeout(id)
    })
    timersRef.current = []
  }, [])

  const delay = useCallback((fn, ms) => {
    const t = setTimeout(fn, ms)
    timersRef.current.push(t)
    return t
  }, [])

  const guidedSubmittedRef = useRef(false)
  const guidedSessionRef = useRef(null)
  const guidedStepIndexRef = useRef(0)
  const actionIdRef = useRef(0)

  const getTimeLabel = useCallback(() => {
    const now = new Date()
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
  }, [])

  const getSessionTitle = useCallback((text) => {
    const compact = String(text || '').trim().replace(/\s+/g, ' ')
    if (!compact) return 'New conversation'
    return compact.length <= 38 ? compact : `${compact.slice(0, 38)}…`
  }, [])

  const createChatSessionId = useCallback(() => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`
  }, [])

  const addCompletedAction = useCallback((text) => {
    const trimmed = String(text || '').trim()
    if (!trimmed) return
    actionIdRef.current += 1
    const next = { id: actionIdRef.current, text: trimmed, time: getTimeLabel() }
    setCompletedActions(prev => [...prev, next])
  }, [getTimeLabel])

  const queueCompletedActions = useCallback((lines, startDelayMs = 0) => {
    const list = Array.isArray(lines) ? lines : []
    list.forEach((line, i) => {
      delay(() => addCompletedAction(line), startDelayMs + i * 280)
    })
  }, [addCompletedAction, delay])

  const handleInputValueChange = useCallback((nextRawValue) => {
    if (!guidedPrompt) {
      setInputValue(nextRawValue)
      return
    }
    const nextLen = Math.min(nextRawValue.length, guidedPrompt.length)
    setInputValue(guidedPrompt.slice(0, nextLen))
  }, [guidedPrompt])

  const primeRoleSession = useCallback(() => {
    if (!userProfile?.role) {
      guidedSessionRef.current = null
      guidedStepIndexRef.current = 0
      guidedSubmittedRef.current = false
      setGuidedPrompt(null)
      return
    }
    const session = buildRoleSession(userProfile)
    guidedSessionRef.current = session
    guidedStepIndexRef.current = 0
    guidedSubmittedRef.current = false
    setGuidedPrompt(session?.steps?.[0]?.prompt || null)
  }, [userProfile])

  const startConversation = useCallback((id) => {
    clearTimers()
    agentRespondingRef.current = false
    setAgentResponding(false)
    setActiveConversationId(id)
    setActiveChatSessionId(null)
    const c = CONVERSATIONS[id]
    setSessionName(c?.name || 'Conversation')
    setMessages([
      { type: 'user', text: c?.prompt || '', time: getTimeLabel() },
      { type: 'ai', templateId: id },
    ])
    setShowConversation(true)
    suppressContextPanelAutoOpenRef.current = false
    setContextPanelOpen(false)

    guidedSubmittedRef.current = false
    guidedSessionRef.current = null
    guidedStepIndexRef.current = 0
    setGuidedPrompt(null)
    setInputValue('')
  }, [clearTimers, getTimeLabel])

  const openChatSession = useCallback((sessionId) => {
    const session = chatSessions.find(s => s?.id === sessionId)
    if (!session) return

    clearTimers()
    agentRespondingRef.current = false
    setAgentResponding(false)
    setActiveConversationId(null)
    setActiveChatSessionId(sessionId)
    setSessionName(session?.title || 'Conversation')
    setMessages(Array.isArray(session?.messages) ? session.messages : [])
    setShowConversation(true)
    suppressContextPanelAutoOpenRef.current = false
    setContextPanelOpen(false)

    guidedSubmittedRef.current = false
    guidedSessionRef.current = null
    guidedStepIndexRef.current = 0
    setGuidedPrompt(null)
    setInputValue('')
  }, [chatSessions, clearTimers])

  useEffect(() => {
    if (!guidedPrompt) return
    if (guidedSubmittedRef.current) return
    if (inputValue.length < guidedPrompt.length) return

    guidedSubmittedRef.current = true
    const session = guidedSessionRef.current
    const stepIndex = guidedStepIndexRef.current
    const step = session?.steps?.[stepIndex]
    setGuidedPrompt(null)

    if (!step) return

    clearTimers()
    setActiveConversationId(null)
    suppressContextPanelAutoOpenRef.current = false
    setShowConversation(true)

    if (messages.length === 0) setSessionName(session?.title || getSessionTitle(step.prompt))
    agentRespondingRef.current = true
    setAgentResponding(true)
    setInputValue('')
    setMessages(prev => [...prev, { type: 'user', text: step.prompt, time: getTimeLabel() }])

    delay(() => {
      const traces = Array.isArray(step.traces) ? step.traces : []
      if (traces.length > 0) {
        setMessages(prev => [...prev, { type: 'trace', lines: traces, collapsing: false }])
        queueCompletedActions(traces)
      }

      const perLine = 280
      const totalTrace = traces.length * perLine + 600
      delay(() => {
        setMessages(prev => prev.map(m => m.type === 'trace' ? { ...m, collapsing: true } : m))
        delay(() => {
          setMessages(prev => [
            ...prev.filter(m => m.type !== 'trace'),
            session?.category
              ? { type: 'ai', roleCategory: session.category, roleStepIndex: stepIndex, text: step.ai?.text }
              : (
                step.ai?.templateId != null
                  ? { type: 'ai', templateId: step.ai.templateId }
                  : { type: 'ai', text: step.ai?.text || "Got it — I’m pulling the latest across your connected sources and will summarize what matters." }
              ),
          ])
          agentRespondingRef.current = false
          setAgentResponding(false)
          delay(() => {
            if (!suppressContextPanelAutoOpenRef.current) openContextPanel()
          }, 800)

          delay(() => {
            const nextIndex = stepIndex + 1
            const nextStep = session?.steps?.[nextIndex]
            guidedStepIndexRef.current = nextIndex
            guidedSubmittedRef.current = false
            if (nextStep?.prompt) setGuidedPrompt(nextStep.prompt)
            else guidedSessionRef.current = null
            setInputValue('')
          }, 900)
        }, 350)
      }, totalTrace)
    }, 400)
  }, [clearTimers, delay, getSessionTitle, getTimeLabel, guidedPrompt, inputValue.length, messages.length, openContextPanel, queueCompletedActions])

  const sendMessage = useCallback(() => {
    if (guidedPrompt) return
    const trimmed = inputValue.trim()
    if (!trimmed) return
    if (agentRespondingRef.current) return

    clearTimers()
    agentRespondingRef.current = true
    setAgentResponding(true)
    suppressContextPanelAutoOpenRef.current = false
    setShowConversation(true)

    setInputValue('')

    const now = Date.now()
    const userMessage = { type: 'user', text: trimmed, time: getTimeLabel() }

    let sessionId = activeChatSessionIdRef.current

    if (!sessionId) {
      sessionId = createChatSessionId()
      const inferredTitle = (messages.length > 0 && sessionName && sessionName !== 'New conversation')
        ? sessionName
        : getSessionTitle(trimmed)
      const seeded = [...(Array.isArray(messages) ? messages : []), userMessage]

      setActiveConversationId(null)
      setActiveChatSessionId(sessionId)
      setSessionName(inferredTitle)
      setMessages(seeded)
      setChatSessions(prev => ([
        { id: sessionId, title: inferredTitle, messages: seeded, createdAt: now, updatedAt: now },
        ...(Array.isArray(prev) ? prev : []),
      ]))
    } else {
      setActiveConversationId(null)
      setMessages(prev => [...prev, userMessage])
      setChatSessions(prev => (Array.isArray(prev) ? prev : []).map(s => (
        s?.id === sessionId
          ? { ...s, messages: [...(Array.isArray(s.messages) ? s.messages : []), userMessage], updatedAt: now }
          : s
      )))
    }

    const simulated = [
      'Interpreting request…',
      'Querying connected sources…',
      'Synthesizing results…',
      'Drafting response…',
    ]
    queueCompletedActions(simulated, 200)

    delay(() => {
      const aiMessage = {
        type: 'ai',
        text: "Got it — I’m pulling the latest across your connected sources and will summarize what matters.",
      }

      setChatSessions(prev => (Array.isArray(prev) ? prev : []).map(s => (
        s?.id === sessionId
          ? { ...s, messages: [...(Array.isArray(s.messages) ? s.messages : []), aiMessage], updatedAt: Date.now() }
          : s
      )))

      if (activeChatSessionIdRef.current === sessionId && activeConversationIdRef.current == null) {
        setMessages(prev => [...prev, aiMessage])
      }
      agentRespondingRef.current = false
      setAgentResponding(false)
    }, 450)
  }, [clearTimers, createChatSessionId, delay, getSessionTitle, getTimeLabel, guidedPrompt, inputValue, messages, queueCompletedActions, sessionName])

  const expandChart = useCallback((key) => {
    setChartOverlayKey(key)
    setChartOverlayOpen(true)
  }, [])

  // ── Reset ─────────────────────────────────────────────────────
  const resetToEmpty = useCallback(() => {
    clearTimers()
    agentRespondingRef.current = false
    setAgentResponding(false)
    setActiveConversationId(null)
    setActiveChatSessionId(null)
    setSessionName('New conversation')
    setMessages([])
    setCompletedActions([])
    setShowConversation(false)
    setInputValue('')
    guidedSessionRef.current = null
    guidedStepIndexRef.current = 0
    setGuidedPrompt(null)
    suppressContextPanelAutoOpenRef.current = true
    setContextPanelOpen(false)
    primeRoleSession()
  }, [clearTimers, primeRoleSession])

  useEffect(() => {
    if (appStep !== 'app') return
    if (showConversation) return
    if (messages.length > 0) return
    if (guidedSessionRef.current) return
    primeRoleSession()
  }, [appStep, messages.length, primeRoleSession, showConversation])

  useEffect(() => {
    if (appStep !== 'app') return
    if (showConversation) return
    if (messages.length > 0) return
    if (activeConversationId != null) return
    if (!activeChatSessionId) return
    const session = chatSessions.find(s => s?.id === activeChatSessionId)
    if (!session) return
    openChatSession(activeChatSessionId)
  }, [activeChatSessionId, activeConversationId, appStep, chatSessions, messages.length, openChatSession, showConversation])

  // ── Keyboard shortcuts ────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        closeContextPanel()
        setSettingsOpen(false)
        setChartOverlayOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [resetToEmpty, closeContextPanel])

  // ── Theme management ──────────────────────────────────────────
  useEffect(() => {
    const root = document.documentElement
    const media = window.matchMedia('(prefers-color-scheme: dark)')

    const applyTheme = () => {
      const resolvedTheme = themeMode === 'system'
        ? (media.matches ? 'dark' : 'light')
        : themeMode
      root.setAttribute('data-theme', resolvedTheme)
    }

    applyTheme()
    window.localStorage.setItem(THEME_STORAGE_KEY, themeMode)

    if (themeMode !== 'system') return undefined

    const handleSystemThemeChange = () => applyTheme()
    media.addEventListener('change', handleSystemThemeChange)
    return () => media.removeEventListener('change', handleSystemThemeChange)
  }, [themeMode])

  // ── Cleanup on unmount ────────────────────────────────────────
  useEffect(() => () => clearTimers(), [clearTimers])

  const getInitials = (value) => {
    const parts = value.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return 'NA'
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }

  if (appStep === 'login') {
    return <LoginPage onSuccess={() => setAppStep('onboarding')} />
  }

  if (appStep === 'onboarding') {
    return (
      <OnboardingPage
        onComplete={(profile) => {
          setUserProfile(profile)
          setAppStep('app')
        }}
      />
    )
  }

  const workspaceName = userProfile?.name?.trim() || 'D2C Apparel Co.'
  const profileInitials = getInitials(workspaceName)

  return (
    <>
      <Topbar
        sessionName={sessionName}
        workspaceName={workspaceName}
        profileInitials={profileInitials}
        onSettingsOpen={() => setSettingsOpen(true)}
        sourcesOpen={contextPanelOpen}
        onSourcesToggle={toggleContextPanel}
      />
      <div className="main-area">
        <Sidebar
          workspaceName={workspaceName}
          onReset={resetToEmpty}
          onSettingsOpen={() => setSettingsOpen(true)}
          onOpenConversation={startConversation}
          activeConversationId={activeConversationId}
          chatSessions={chatSessions}
          activeChatSessionId={activeChatSessionId}
          onOpenChatSession={openChatSession}
        />
        <CanvasArea
          showConversation={showConversation}
          messages={messages}
          inputValue={inputValue}
          setInputValue={handleInputValueChange}
          onStartConversation={startConversation}
          onSend={sendMessage}
          inputDisabled={agentResponding}
          userName={workspaceName}
          onExpandChart={expandChart}
        />
        <ContextPanel
          open={contextPanelOpen}
          actions={completedActions}
          onClose={closeContextPanel}
        />
      </div>
      <SettingsOverlay
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        themeMode={themeMode}
        onThemeModeChange={setThemeMode}
      />
      <ChartOverlay
        open={chartOverlayOpen}
        onClose={() => setChartOverlayOpen(false)}
        chartKey={chartOverlayKey}
      />
    </>
  )
}