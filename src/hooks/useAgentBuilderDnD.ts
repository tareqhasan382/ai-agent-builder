import {
  type DragEndEvent,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { useCallback, useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import type { AgentData, BuilderBlock } from '../types/agent'
import { blockKey, BUILDER_CANVAS_ID, isPalettePayload, parseCanvasBlockId } from '../utils/builder'

export type DragOverlayState = {
  title: string
  subtitle: string
  kind: 'skill' | 'layer'
}

export function useAgentBuilderDnD(
  data: AgentData | null,
  setBlocks: Dispatch<SetStateAction<BuilderBlock[]>>,
) {
  const [overlay, setOverlay] = useState<DragOverlayState | null>(null)

  const skillMap = useMemo(
    () => new Map((data?.skills ?? []).map((s) => [s.id, s])),
    [data?.skills],
  )
  const layerMap = useMemo(
    () => new Map((data?.layers ?? []).map((l) => [l.id, l])),
    [data?.layers],
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  )

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      const raw = event.active.data.current
      if (isPalettePayload(raw)) {
        if (raw.kind === 'skill') {
          const s = skillMap.get(raw.entityId)
          setOverlay(s ? { title: s.name, subtitle: s.category, kind: 'skill' } : null)
        } else {
          const l = layerMap.get(raw.entityId)
          setOverlay(l ? { title: l.name, subtitle: l.type, kind: 'layer' } : null)
        }
        return
      }

      const parsed = parseCanvasBlockId(String(event.active.id))
      if (!parsed) {
        setOverlay(null)
        return
      }
      if (parsed.kind === 'skill') {
        const s = skillMap.get(parsed.id)
        setOverlay(s ? { title: s.name, subtitle: s.category, kind: 'skill' } : null)
      } else {
        const l = layerMap.get(parsed.id)
        setOverlay(l ? { title: l.name, subtitle: l.type, kind: 'layer' } : null)
      }
    },
    [skillMap, layerMap],
  )

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      setOverlay(null)
      const { active, over } = event
      if (!over) return

      const activeId = String(active.id)
      const overId = String(over.id)

      setBlocks((prev) => {
        const ids = prev.map(blockKey)

        if (ids.includes(activeId) && ids.includes(overId)) {
          const oldIndex = prev.findIndex((b) => blockKey(b) === activeId)
          const newIndex = prev.findIndex((b) => blockKey(b) === overId)
          if (oldIndex < 0 || newIndex < 0) return prev
          return arrayMove(prev, oldIndex, newIndex)
        }

        const payload = active.data.current
        if (!isPalettePayload(payload)) return prev

        if (prev.some((b) => b.kind === payload.kind && b.id === payload.entityId)) {
          return prev
        }

        const nextBlock: BuilderBlock = { kind: payload.kind, id: payload.entityId }

        if (overId === BUILDER_CANVAS_ID) {
          return [...prev, nextBlock]
        }

        const overIndex = prev.findIndex((b) => blockKey(b) === overId)
        if (overIndex < 0) return [...prev, nextBlock]
        const next = [...prev]
        next.splice(overIndex, 0, nextBlock)
        return next
      })
    },
    [setBlocks],
  )

  const onDragCancel = useCallback(() => setOverlay(null), [])

  return { sensors, onDragStart, onDragEnd, onDragCancel, overlay }
}
