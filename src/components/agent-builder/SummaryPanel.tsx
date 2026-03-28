import { Brain, Cpu, LayoutDashboard, Sparkles } from 'lucide-react'
import { memo, useMemo } from 'react'
import type { AgentData, BuilderBlock } from '../../types/agent'
import { cn } from '../../utils/cn'

type SummaryPanelProps = {
  data: AgentData
  selectedProfile: string
  selectedProvider: string
  blocks: BuilderBlock[]
  agentName: string
  onAgentNameChange: (value: string) => void
  onSave: () => void
}

type ChipTone = 'skill' | 'layer' | 'neutral'

function SummaryChip({
  children,
  tone,
  icon,
}: {
  children: React.ReactNode
  tone: ChipTone
  icon: React.ReactNode
}) {
  const tones: Record<ChipTone, string> = {
    skill: 'border-cyan-200/90 bg-cyan-50 text-cyan-950 shadow-sm',
    layer: 'border-violet-200/90 bg-violet-50 text-violet-950 shadow-sm',
    neutral: 'border-slate-200/90 bg-slate-100 text-slate-800 shadow-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition hover:shadow-md',
        tones[tone],
      )}
    >
      <span className="shrink-0 opacity-80" aria-hidden>
        {icon}
      </span>
      <span className="truncate">{children}</span>
    </span>
  )
}

export const SummaryPanel = memo(function SummaryPanel({
  data,
  selectedProfile,
  selectedProvider,
  blocks,
  agentName,
  onAgentNameChange,
  onSave,
}: SummaryPanelProps) {
  const profile = useMemo(
    () => data.agentProfiles.find((p) => p.id === selectedProfile),
    [data.agentProfiles, selectedProfile],
  )

  const skillMap = useMemo(() => new Map(data.skills.map((s) => [s.id, s])), [data.skills])
  const layerMap = useMemo(() => new Map(data.layers.map((l) => [l.id, l])), [data.layers])

  const chips = useMemo(() => {
    return blocks.map((b) => {
      if (b.kind === 'skill') {
        const s = skillMap.get(b.id)
        return { key: `skill:${b.id}`, label: s?.name ?? b.id, tone: 'skill' as const }
      }
      const l = layerMap.get(b.id)
      return { key: `layer:${b.id}`, label: l?.name ?? b.id, tone: 'layer' as const }
    })
  }, [blocks, skillMap, layerMap])

  return (
    <aside className="sticky top-6 flex h-fit max-h-[calc(100vh-4rem)] flex-col gap-6 overflow-y-auto rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-lg ring-1 ring-slate-200/60 backdrop-blur-md">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-600 text-white shadow-md">
          <LayoutDashboard className="h-5 w-5" aria-hidden />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Live summary</h2>
          <p className="text-xs text-slate-500">Sticky preview of your configuration</p>
        </div>
      </div>

      <section className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Profile</p>
        {profile ? (
          <div className="rounded-xl border border-brand-200/80 bg-brand-50/50 p-3 shadow-sm ring-1 ring-brand-100/80">
            <p className="font-semibold text-brand-950">{profile.name}</p>
            <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-brand-900/80">{profile.description}</p>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-4 text-center text-xs text-slate-500">
            Select a base profile in the center column
          </p>
        )}
      </section>

      <section className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Provider</p>
        <div className="flex flex-wrap gap-2">
          {selectedProvider ? (
            <SummaryChip tone="neutral" icon={<Cpu className="h-3.5 w-3.5" />}>
              {selectedProvider}
            </SummaryChip>
          ) : (
            <span className="text-xs text-slate-400">No provider selected</span>
          )}
        </div>
      </section>

      <section className="space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Stack</p>
        {chips.length === 0 ? (
          <p className="text-xs text-slate-400">Canvas is empty—drag blocks to see them here.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {chips.map((c) =>
              c.tone === 'skill' ? (
                <SummaryChip key={c.key} tone="skill" icon={<Sparkles className="h-3.5 w-3.5" />}>
                  {c.label}
                </SummaryChip>
              ) : (
                <SummaryChip key={c.key} tone="layer" icon={<Brain className="h-3.5 w-3.5" />}>
                  {c.label}
                </SummaryChip>
              ),
            )}
          </div>
        )}
      </section>

      <div className="mt-auto border-t border-slate-200 pt-6">
        <label htmlFor="summary-agent-name" className="text-sm font-semibold text-slate-900">
          Agent name
        </label>
        <input
          id="summary-agent-name"
          type="text"
          placeholder="e.g. Support bot"
          value={agentName}
          onChange={(e) => onAgentNameChange(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm transition focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
        />
        <button
          type="button"
          onClick={onSave}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 py-3 text-sm font-semibold text-white shadow-md transition hover:from-cyan-500 hover:to-teal-500 hover:shadow-lg"
        >
          Save agent
        </button>
      </div>
    </aside>
  )
})
