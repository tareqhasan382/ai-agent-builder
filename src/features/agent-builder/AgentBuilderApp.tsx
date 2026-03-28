import { closestCenter, DndContext, DragOverlay, type DropAnimation } from '@dnd-kit/core'
import { Brain, Menu, Sparkles } from 'lucide-react'
import { useCallback, useState } from 'react'
import { BuilderCanvas } from '../../components/agent-builder/BuilderCanvas'
import { Sidebar } from '../../components/agent-builder/Sidebar'
import { SummaryPanel } from '../../components/agent-builder/SummaryPanel'
import { ProfilePicker } from '../../components/builder/ProfilePicker'
import { ProviderSelect } from '../../components/builder/ProviderSelect'
import { SavedAgentsPanel } from '../../components/SavedAgentsPanel'
import { AppHeader } from '../../components/layout/AppHeader'
import { useAgentData } from '../../hooks/useAgentData'
import { useAgentBuilderDnD } from '../../hooks/useAgentBuilderDnD'
import { useAnalyticsHeartbeat } from '../../hooks/useAnalyticsHeartbeat'
import { useSavedAgents } from '../../hooks/useSavedAgents'
import type { BuilderBlock, SavedAgent } from '../../types/agent'
import { blockKey, blocksToSkillLayerIds } from '../../utils/builder'
import { cn } from '../../utils/cn'

const dropAnimation: DropAnimation = {
  duration: 220,
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
}

export function AgentBuilderApp() {
  const { data, loading, error, reload } = useAgentData()
  const { savedAgents, addAgent, removeAgent, clearAll } = useSavedAgents()

  const [builderBlocks, setBuilderBlocks] = useState<BuilderBlock[]>([])
  const [selectedProfile, setSelectedProfile] = useState('')
  const [agentName, setAgentName] = useState('')
  const [selectedProvider, setSelectedProvider] = useState('')
  const [libraryOpen, setLibraryOpen] = useState(false)

  const { sensors, onDragStart, onDragEnd, onDragCancel, overlay } = useAgentBuilderDnD(
    data,
    setBuilderBlocks,
  )

  useAnalyticsHeartbeat(agentName)

  const removeBlock = useCallback((sortableId: string) => {
    setBuilderBlocks((prev) => prev.filter((b) => blockKey(b) !== sortableId))
  }, [])

  const handleSaveAgent = useCallback(() => {
    const name = agentName.trim()
    if (!name) {
      alert('Please enter a name for your agent.')
      return
    }
    const { skillIds, layerIds } = blocksToSkillLayerIds(builderBlocks)
    addAgent({
      name,
      profileId: selectedProfile,
      skillIds,
      layerIds,
      builderSequence: builderBlocks,
      provider: selectedProvider || undefined,
    })
    setAgentName('')
    alert(`Agent "${name}" saved successfully!`)
  }, [addAgent, agentName, builderBlocks, selectedProfile, selectedProvider])

  const handleLoadAgent = useCallback((agent: SavedAgent) => {
    setSelectedProfile(agent.profileId || '')
    if (agent.builderSequence && agent.builderSequence.length > 0) {
      setBuilderBlocks(agent.builderSequence)
    } else {
      setBuilderBlocks([
        ...agent.skillIds.map((id) => ({ kind: 'skill' as const, id })),
        ...agent.layerIds.map((id) => ({ kind: 'layer' as const, id })),
      ])
    }
    setAgentName(agent.name)
    setSelectedProvider(agent.provider || '')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50/90">
      <AppHeader loading={loading} onReload={reload} />

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-14 pt-6 sm:px-6">
        {error ? (
          <div
            className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 shadow-sm"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {loading && !data ? (
          <div className="rounded-2xl border border-dashed border-cyan-300/60 bg-cyan-50/40 px-6 py-16 text-center text-sm font-medium text-cyan-900 shadow-inner">
            Loading configuration…
          </div>
        ) : null}

        {!loading && !data && !error ? (
          <p className="text-center text-slate-500">No data loaded.</p>
        ) : null}

        {data ? (
          <>
            <DndContext
              collisionDetection={closestCenter}
              sensors={sensors}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragCancel={onDragCancel}
            >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6">
                  <Sidebar
                    data={data}
                    mobileOpen={libraryOpen}
                    onMobileClose={() => setLibraryOpen(false)}
                  />

                  <div className="min-w-0 flex-1 space-y-8 lg:min-w-[280px]">
                    <button
                      type="button"
                      onClick={() => setLibraryOpen(true)}
                      className={cn(
                        'inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-md transition hover:border-cyan-300 hover:shadow-lg lg:hidden',
                      )}
                    >
                      <Menu className="h-4 w-4 shrink-0" aria-hidden />
                      Open skill &amp; layer library
                    </button>

                    <ProfilePicker data={data} value={selectedProfile} onChange={setSelectedProfile} />
                    <ProviderSelect value={selectedProvider} onChange={setSelectedProvider} />
                    <BuilderCanvas data={data} blocks={builderBlocks} onRemoveBlock={removeBlock} />
                  </div>

                  <SummaryPanel
                    data={data}
                    selectedProfile={selectedProfile}
                    selectedProvider={selectedProvider}
                    blocks={builderBlocks}
                    agentName={agentName}
                    onAgentNameChange={setAgentName}
                    onSave={handleSaveAgent}
                  />
                </div>

                <DragOverlay dropAnimation={dropAnimation}>
                  {overlay ? (
                    <div
                      className={cn(
                        'flex min-w-[220px] items-start gap-3 rounded-2xl border bg-white/95 px-4 py-3 shadow-2xl backdrop-blur-sm',
                        overlay.kind === 'skill'
                          ? 'border-cyan-200 ring-2 ring-cyan-500/25'
                          : 'border-violet-200 ring-2 ring-violet-500/25',
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-md',
                          overlay.kind === 'skill'
                            ? 'bg-gradient-to-br from-cyan-500 to-teal-600'
                            : 'bg-gradient-to-br from-violet-500 to-indigo-600',
                        )}
                      >
                        {overlay.kind === 'skill' ? (
                          <Sparkles className="h-5 w-5" aria-hidden />
                        ) : (
                          <Brain className="h-5 w-5" aria-hidden />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900">{overlay.title}</p>
                        <p className="text-xs capitalize text-slate-500">{overlay.subtitle}</p>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
            </DndContext>

            <div className="mt-12">
              <SavedAgentsPanel
                data={data}
                agents={savedAgents}
                onLoad={handleLoadAgent}
                onDelete={removeAgent}
                onClearAll={clearAll}
              />
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}
