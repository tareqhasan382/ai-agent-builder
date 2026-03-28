import type { AgentData, SavedAgent } from '../types/agent'

type SavedAgentsListProps = {
  data: AgentData | null
  agents: SavedAgent[]
  onLoad: (agent: SavedAgent) => void
  onDelete: (id: string) => void
}

export function SavedAgentsList({ data, agents, onLoad, onDelete }: SavedAgentsListProps) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <article
          key={agent.id}
          className="flex flex-col rounded-xl border border-brand-100 bg-white/95 p-4 shadow-sm transition hover:shadow-md"
        >
          <h3 className="font-semibold text-brand-950">{agent.name}</h3>
          <dl className="mt-3 space-y-1 text-xs text-slate-600">
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Profile</dt>
              <dd className="text-right font-medium text-slate-800">
                {data?.agentProfiles.find((p) => p.id === agent.profileId)?.name ?? '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Skills</dt>
              <dd className="text-right">{agent.skillIds.length}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Layers</dt>
              <dd className="text-right">{agent.layerIds.length}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500">Provider</dt>
              <dd className="text-right">{agent.provider ?? '—'}</dd>
            </div>
          </dl>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => onLoad(agent)}
              className="flex-1 rounded-lg bg-brand-600 py-2 text-xs font-medium text-white transition hover:bg-brand-700"
            >
              Load
            </button>
            <button
              type="button"
              onClick={() => onDelete(agent.id)}
              className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
