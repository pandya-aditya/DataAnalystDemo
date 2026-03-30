import { createContext, useContext, useMemo } from 'react'

const SourceAccessContext = createContext(null)

export function SourceAccessProvider({ sourceAccess, children }) {
  const value = useMemo(() => {
    const normalized = sourceAccess && typeof sourceAccess === 'object' ? sourceAccess : {}
    const getLevel = (sourceName) => normalized?.[sourceName] ?? 'read'
    const canWrite = (sourceName) => getLevel(sourceName) === 'write'
    return { sourceAccess: normalized, getLevel, canWrite }
  }, [sourceAccess])

  return (
    <SourceAccessContext.Provider value={value}>
      {children}
    </SourceAccessContext.Provider>
  )
}

export function useSourceAccess() {
  const ctx = useContext(SourceAccessContext)
  if (!ctx) return { sourceAccess: {}, getLevel: () => 'read', canWrite: () => false }
  return ctx
}

