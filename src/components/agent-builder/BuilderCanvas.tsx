import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { LayoutTemplate } from 'lucide-react'
import { memo, useMemo } from 'react'
import type { AgentData, BuilderBlock } from '../../types/agent'
import { blockKey, BUILDER_CANVAS_ID } from '../../utils/builder'
import { cn } from '../../utils/cn'
import { LayerCard } from './LayerCard'
import { SkillCard } from './SkillCard'

type BuilderCanvasProps = {
  data: AgentData
  blocks: BuilderBlock[]
  onRemoveBlock: (sortableId: string) => void
}

function CanvasDropSurface({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: BUILDER_CANVAS_ID })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'min-h-[400px] rounded-2xl border-2 border-dashed border-slate-200/90 bg-gradient-to-b from-white via-slate-50/40 to-slate-50/80 p-4 shadow-inner transition-all duration-300 md:min-h-[480px]',
        isOver && 'border-cyan-500/60 bg-cyan-50/25 shadow-lg ring-2 ring-cyan-500/15',
      )}
    >
      {children}
    </div>
  )
}

export const BuilderCanvas = memo(function BuilderCanvas({
  data,
  blocks,
  onRemoveBlock,
}: BuilderCanvasProps) {
  const skillMap = useMemo(() => new Map(data.skills.map((s) => [s.id, s])), [data.skills])
  const layerMap = useMemo(() => new Map(data.layers.map((l) => [l.id, l])), [data.layers])

  const sortableItems = useMemo(() => blocks.map(blockKey), [blocks])

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-slate-900">Builder canvas</h2>
        <p className="mt-1 text-sm text-slate-500">
          Arrange skills and layers in sequence—order defines how your agent is composed.
        </p>
      </div>

      <CanvasDropSurface>
        <SortableContext items={sortableItems} strategy={verticalListSortingStrategy}>
          {blocks.length === 0 ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center gap-4 px-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 shadow-inner ring-1 ring-slate-200/80 transition hover:scale-105 hover:shadow-md">
                <LayoutTemplate className="h-8 w-8" aria-hidden />
              </div>
              <div className="max-w-md">
                <p className="text-base font-medium text-slate-800">Drag skills here to build your agent</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Open the library on mobile with the button above. Drop skills and personality layers here; drag cards
                  to reorder or remove them with the close control.
                </p>
              </div>
            </div>
          ) : (
            <ul className="mx-auto flex max-w-3xl flex-col gap-4">
              {blocks.map((block) => {
                const sid = blockKey(block)
                if (block.kind === 'skill') {
                  const skill = skillMap.get(block.id)
                  if (!skill) return null
                  return (
                    <li key={sid}>
                      <SkillCard
                        variant="canvas"
                        skill={skill}
                        sortableId={sid}
                        onRemove={() => onRemoveBlock(sid)}
                      />
                    </li>
                  )
                }
                const layer = layerMap.get(block.id)
                if (!layer) return null
                return (
                  <li key={sid}>
                    <LayerCard
                      variant="canvas"
                      layer={layer}
                      sortableId={sid}
                      onRemove={() => onRemoveBlock(sid)}
                    />
                  </li>
                )
              })}
            </ul>
          )}
        </SortableContext>
      </CanvasDropSurface>
    </section>
  )
})
