import { memo } from 'react'
import type { AgentData } from '../../types/agent'
import { cn } from '../../utils/cn'

type ProfilePickerProps = {
  data: AgentData
  value: string
  onChange: (profileId: string) => void
}

export const ProfilePicker = memo(function ProfilePicker({ data, value, onChange }: ProfilePickerProps) {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Base profile</h2>
          <p className="mt-1 text-xs text-slate-500">Choose the foundation for your agent.</p>
        </div>
        {value ? (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-xs font-medium text-brand-700 underline-offset-2 hover:underline"
          >
            Clear profile
          </button>
        ) : null}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {data.agentProfiles.map((p) => {
          const selected = p.id === value
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id)}
              className={cn(
                'rounded-xl border bg-white p-4 text-left shadow-md transition duration-200',
                'hover:scale-[1.02] hover:border-cyan-400/60 hover:shadow-lg',
                selected
                  ? 'scale-[1.01] border-cyan-500 ring-2 ring-cyan-500/25 shadow-lg'
                  : 'border-slate-200',
              )}
            >
              <p className="font-medium text-slate-900">{p.name}</p>
              <p className="mt-1 line-clamp-2 text-xs text-slate-600">{p.description}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
})
