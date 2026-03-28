import { useEffect, useState } from 'react'

/** Isolated timer so parent tree does not re-render every second. */
export function SessionTimer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setSeconds((s) => s + 1)
    }, 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <span className="text-sm text-slate-500">
      Session active:{' '}
      <span className="font-medium tabular-nums text-slate-700">{seconds}s</span>
    </span>
  )
}
