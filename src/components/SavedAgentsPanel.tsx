import { lazy, Suspense } from 'react'
import type { AgentData, SavedAgent } from '../types/agent'

const SavedAgentsListLazy = lazy(() =>
  import('./SavedAgentsList').then((m) => ({ default: m.SavedAgentsList })),
)

type SavedAgentsPanelProps = {
  data: AgentData | null
  agents: SavedAgent[]
  onLoad: (agent: SavedAgent) => void
  onDelete: (id: string) => void
  onClearAll: () => void
}

export function SavedAgentsPanel({ data, agents, onLoad, onDelete, onClearAll }: SavedAgentsPanelProps) {
  if (agents.length === 0) return null

  const handleClear = () => {
    if (confirm('Clear all saved agents?')) {
      onClearAll()
    }
  }

  return (
    <section className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/90 to-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-brand-900">Saved agents</h2>
          <p className="text-sm text-brand-800/80">{agents.length} preset{agents.length === 1 ? '' : 's'}</p>
        </div>
        <button
          type="button"
          onClick={handleClear}
          className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-rose-700"
        >
          Clear all
        </button>
      </div>
      <Suspense
        fallback={<p className="mt-6 text-center text-sm text-slate-500">Loading saved agents…</p>}
      >
        <SavedAgentsListLazy data={data} agents={agents} onLoad={onLoad} onDelete={onDelete} />
      </Suspense>
    </section>
  )
}
