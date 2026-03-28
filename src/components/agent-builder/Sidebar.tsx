import { BookOpen, PanelLeftClose } from 'lucide-react'
import { memo } from 'react'
import type { AgentData } from '../../types/agent'
import { cn } from '../../utils/cn'
import { LayerCard } from './LayerCard'
import { SkillCard } from './SkillCard'

type SidebarProps = {
  data: AgentData
  mobileOpen: boolean
  onMobileClose: () => void
}

export const Sidebar = memo(function Sidebar({ data, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      <button
        type="button"
        className={cn(
          'fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity lg:hidden',
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        aria-label="Close library"
        onClick={onMobileClose}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[min(100vw,20rem)] flex-col border-r border-slate-200/90 bg-white shadow-2xl transition-transform duration-300 ease-out lg:static lg:z-10 lg:h-auto lg:min-h-[560px] lg:w-72 lg:shrink-0 lg:translate-x-0 lg:rounded-2xl lg:border lg:bg-white/90 lg:shadow-lg',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
        aria-label="Skill and layer library"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 lg:hidden">
          <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <BookOpen className="h-4 w-4 text-brand-600" aria-hidden />
            Library
          </span>
          <button
            type="button"
            onClick={onMobileClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Close library panel"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-8 overflow-y-auto overscroll-contain p-4 lg:p-5">
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Skills</h3>
            <p className="mt-1 text-xs text-slate-500">Tools and actions your agent can use.</p>
            <ul className="mt-4 flex flex-col gap-3">
              {data.skills.map((skill) => (
                <li key={skill.id}>
                  <SkillCard variant="palette" skill={skill} />
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Personality layers</h3>
            <p className="mt-1 text-xs text-slate-500">Tone, reasoning, and output behavior.</p>
            <ul className="mt-4 flex flex-col gap-3">
              {data.layers.map((layer) => (
                <li key={layer.id}>
                  <LayerCard variant="palette" layer={layer} />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </aside>
    </>
  )
})
