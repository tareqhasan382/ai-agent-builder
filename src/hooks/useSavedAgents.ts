import { useCallback, useState } from 'react'
import type { BuilderBlock, SavedAgent } from '../types/agent'

const STORAGE_KEY = 'savedAgents'

function isSavedAgentRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function parseBuilderSequence(value: unknown): BuilderBlock[] | undefined {
  if (!Array.isArray(value)) return undefined
  const out: BuilderBlock[] = []
  for (const row of value) {
    if (!isSavedAgentRecord(row)) continue
    const kind = row.kind
    const id = row.id
    if (kind === 'skill' && typeof id === 'string') out.push({ kind: 'skill', id })
    else if (kind === 'layer' && typeof id === 'string') out.push({ kind: 'layer', id })
  }
  return out.length ? out : undefined
}

function parseSavedAgents(raw: string): SavedAgent[] {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .filter(isSavedAgentRecord)
      .map((item) => {
        const id = typeof item.id === 'string' ? item.id : crypto.randomUUID()
        const name = typeof item.name === 'string' ? item.name : 'Untitled'
        const profileId = typeof item.profileId === 'string' ? item.profileId : ''
        const skillIds = Array.isArray(item.skillIds)
          ? item.skillIds.filter((x): x is string => typeof x === 'string')
          : []
        const layerIds = Array.isArray(item.layerIds)
          ? item.layerIds.filter((x): x is string => typeof x === 'string')
          : []
        const provider = typeof item.provider === 'string' ? item.provider : undefined
        const builderSequence = parseBuilderSequence(item.builderSequence)
        return { id, name, profileId, skillIds, layerIds, provider, builderSequence }
      })
  } catch (e) {
    console.error('Failed to parse saved agents', e)
    return []
  }
}

function persist(agents: SavedAgent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(agents))
}

function readStoredAgents(): SavedAgent[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? parseSavedAgents(stored) : []
  } catch {
    return []
  }
}

export function useSavedAgents() {
  const [savedAgents, setSavedAgents] = useState<SavedAgent[]>(readStoredAgents)

  const addAgent = useCallback((agent: Omit<SavedAgent, 'id'>) => {
    const withId: SavedAgent = { ...agent, id: crypto.randomUUID() }
    setSavedAgents((prev) => {
      const next = [...prev, withId]
      persist(next)
      return next
    })
    return withId
  }, [])

  const removeAgent = useCallback((id: string) => {
    setSavedAgents((prev) => {
      const next = prev.filter((a) => a.id !== id)
      persist(next)
      return next
    })
  }, [])

  const clearAll = useCallback(() => {
    setSavedAgents([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { savedAgents, addAgent, removeAgent, clearAll }
}
