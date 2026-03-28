import { useDraggable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Sparkles, X } from 'lucide-react'
import { memo } from 'react'
import type { Skill } from '../../types/agent'
import { cn } from '../../utils/cn'

type PaletteProps = {
  variant: 'palette'
  skill: Skill
}

type CanvasProps = {
  variant: 'canvas'
  skill: Skill
  sortableId: string
  onRemove: () => void
}

export type SkillCardProps = PaletteProps | CanvasProps

function SkillPaletteCard({ skill }: { skill: Skill }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette:skill:${skill.id}`,
    data: { source: 'palette' as const, kind: 'skill' as const, entityId: skill.id },
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'group flex touch-none items-start gap-3 rounded-xl border border-slate-200/90 bg-white p-3 shadow-md transition duration-200',
        'hover:scale-[1.02] hover:border-cyan-400/50 hover:shadow-lg',
        isDragging && 'scale-95 opacity-50 shadow-xl ring-2 ring-cyan-500/30',
      )}
      {...listeners}
      {...attributes}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-sm">
        <Sparkles className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{skill.name}</p>
        <p className="mt-0.5 text-xs capitalize text-slate-500">{skill.category}</p>
      </div>
      <span
        className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-500 opacity-0 transition group-hover:opacity-100"
        aria-hidden
      >
        Drag
      </span>
    </div>
  )
}

function SkillCanvasCard({
  skill,
  sortableId,
  onRemove,
}: {
  skill: Skill
  sortableId: string
  onRemove: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: sortableId,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group flex items-stretch gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-md transition duration-200',
        'hover:scale-[1.01] hover:border-cyan-400/40 hover:shadow-lg',
        isDragging && 'z-20 scale-[1.02] opacity-90 shadow-2xl ring-2 ring-cyan-500/40',
      )}
    >
      <button
        type="button"
        className="flex cursor-grab touch-none items-center justify-center self-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-3 text-slate-400 transition hover:bg-slate-100 active:cursor-grabbing"
        aria-label="Drag to reorder"
        {...attributes}
        {...listeners}
      >
        <span className="text-xs font-bold tracking-tighter text-slate-400">⋮⋮</span>
      </button>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600 text-white shadow-md">
        <Sparkles className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1 py-0.5">
        <p className="font-semibold text-slate-900">{skill.name}</p>
        <p className="mt-1 text-xs capitalize text-slate-500">{skill.category}</p>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">{skill.description}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 opacity-70 transition hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100"
        aria-label={`Remove ${skill.name}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export const SkillCard = memo(function SkillCard(props: SkillCardProps) {
  if (props.variant === 'palette') {
    return <SkillPaletteCard skill={props.skill} />
  }
  return (
    <SkillCanvasCard
      skill={props.skill}
      sortableId={props.sortableId}
      onRemove={props.onRemove}
    />
  )
})
