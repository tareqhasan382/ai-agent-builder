export interface AgentProfile {
  id: string
  name: string
  description: string
}

export interface Skill {
  id: string
  name: string
  category: string
  description: string
}

export interface Layer {
  id: string
  name: string
  type: string
  description: string
}

export interface AgentData {
  agentProfiles: AgentProfile[]
  skills: Skill[]
  layers: Layer[]
}

/** One block in the main builder canvas (order preserved when saving). */
export interface BuilderBlock {
  kind: 'skill' | 'layer'
  id: string
}

export interface SavedAgent {
  id: string
  name: string
  profileId: string
  skillIds: string[]
  layerIds: string[]
  /** Optional: full merge order for the canvas (backward compatible). */
  builderSequence?: BuilderBlock[]
  provider?: string
}

export type PaletteDragKind = 'skill' | 'layer'
