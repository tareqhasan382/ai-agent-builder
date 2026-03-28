import { useCallback, useEffect, useState } from 'react'
import type { AgentData } from '../types/agent'
import { getErrorMessage } from '../utils/errors'

const DATA_URL = '/data.json'

export function useAgentData() {
  const [data, setData] = useState<AgentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async (options?: { withSimulatedDelay?: boolean }) => {
    const withDelay = options?.withSimulatedDelay ?? true
    setLoading(true)
    setError(null)
    try {
      if (withDelay) {
        await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 2000) + 1000))
      }
      const response = await fetch(DATA_URL)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const jsonData = (await response.json()) as AgentData
      setData(jsonData)
    } catch (err: unknown) {
      console.error('Error fetching data:', err)
      setError(getErrorMessage(err) || 'Failed to fetch agent data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const reload = useCallback(() => load({ withSimulatedDelay: true }), [load])

  return { data, loading, error, reload }
}
