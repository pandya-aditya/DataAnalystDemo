import { useState, useRef, useEffect, useCallback } from 'react'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import CanvasArea from './components/CanvasArea'
import ContextPanel from './components/ContextPanel'
import SettingsOverlay from './components/SettingsOverlay'
import ChartOverlay from './components/ChartOverlay'
import LoginPage from './components/Loginpage'
import OnboardingPage from './components/OnboardingPage'
import { INTEGRATIONS } from './constants/data'

export default function App() {
  const THEME_STORAGE_KEY = 'nexus-theme'
  const [appStep, setAppStep] = useState('login')
  const [userProfile, setUserProfile] = useState(null)

  // ── Core state ──────────────────────────────────────────────
  const [sessionName, setSessionName]              = useState('New conversation')
  const [messages, setMessages]                    = useState([])      // array of { type, ...props }
  const [inputValue, setInputValue]                = useState('')
  const [contextPanelOpen, setContextPanelOpen]   = useState(false)
  const [settingsOpen, setSettingsOpen]            = useState(false)
  const [chartOverlayOpen, setChartOverlayOpen]   = useState(false)
  const [themeMode, setThemeMode]                 = useState(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'dark' || stored === 'light' || stored === 'system' ? stored : 'light'
  })

  // When true, the panel will NOT be auto-opened by assistant updates.
  // (So user toggling it closed won't get overridden mid-run.)
  const suppressContextPanelAutoOpenRef = useRef(false)

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

  const getTimeLabel = () => {
    const now = new Date()
    return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
  }

  const getSessionTitle = (text) => {
    const compact = String(text || '').trim().replace(/\s+/g, ' ')
    if (!compact) return 'New conversation'
    return compact.length <= 38 ? compact : `${compact.slice(0, 38)}…`
  }

  const connectedSources = INTEGRATIONS.filter(i => i.connected).map(i => i.name)

  const sendMessage = useCallback(() => {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    clearTimers()
    suppressContextPanelAutoOpenRef.current = false

    if (messages.length === 0) setSessionName(getSessionTitle(trimmed))
    setMessages(prev => [...prev, { type: 'user', text: trimmed, time: getTimeLabel() }])
    setInputValue('')

    delay(() => {
      setMessages(prev => [
        ...prev,
        {
          type: 'ai',
          text: "Got it — I’m pulling the latest across your connected sources and will summarize what matters.",
        },
      ])

      delay(() => {
        if (!suppressContextPanelAutoOpenRef.current) openContextPanel()
      }, 500)
    }, 500)
  }, [clearTimers, delay, inputValue, messages.length, openContextPanel])

  // ── Reset ─────────────────────────────────────────────────────
  const resetToEmpty = useCallback(() => {
    clearTimers()
    setSessionName('New conversation')
    setMessages([])
    setInputValue('')
    suppressContextPanelAutoOpenRef.current = true
    setContextPanelOpen(false)
  }, [clearTimers])

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
  const showConversation = messages.length > 0

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
        />
        <CanvasArea
          showConversation={showConversation}
          messages={messages}
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSend={sendMessage}
          userName={workspaceName}
        />
        <ContextPanel
          open={contextPanelOpen}
          sources={connectedSources}
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
      />
    </>
  )
}
