import { useEffect, useRef } from 'react'

/** Demo analytics: stable interval; always reads latest name via ref (no stale closure). */
export function useAnalyticsHeartbeat(agentName: string) {
  const nameRef = useRef(agentName)

  useEffect(() => {
    nameRef.current = agentName
  }, [agentName])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const n = nameRef.current
      if (n !== '') {
        console.log(`[Analytics Heartbeat] User is working on agent named: "${n}"`)
      } else {
        console.log('[Analytics Heartbeat] User is working on an unnamed agent draft...')
      }
    }, 8000)

    return () => window.clearInterval(intervalId)
  }, [])
}
