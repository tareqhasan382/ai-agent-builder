import type { BuilderBlock, PaletteDragKind } from '../types/agent'

/** Droppable id for the main canvas (empty area / container). */
export const BUILDER_CANVAS_ID = 'builder-canvas-drop'

/** Stable id for dnd-kit sortable items on the canvas. */
export function blockKey(block: BuilderBlock): string {
  return `${block.kind}:${block.id}`
}

export function parseCanvasBlockId(id: string): BuilderBlock | null {
  const m = /^(skill|layer):(.+)$/.exec(id)
  if (!m || (m[1] !== 'skill' && m[1] !== 'layer')) return null
  return { kind: m[1], id: m[2] }
}

type PalettePayload = {
  source: 'palette'
  kind: PaletteDragKind
  entityId: string
}

export function isPalettePayload(value: unknown): value is PalettePayload {
  if (typeof value !== 'object' || value === null) return false
  const o = value as Record<string, unknown>
  return (
    o.source === 'palette' &&
    (o.kind === 'skill' || o.kind === 'layer') &&
    typeof o.entityId === 'string'
  )
}

/** Derive legacy arrays from ordered canvas (order preserved per kind in sequence order). */
export function blocksToSkillLayerIds(blocks: BuilderBlock[]) {
  const skillIds: string[] = []
  const layerIds: string[] = []
  for (const b of blocks) {
    if (b.kind === 'skill') skillIds.push(b.id)
    else layerIds.push(b.id)
  }
  return { skillIds, layerIds }
}
