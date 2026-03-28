import { memo } from 'react'

const PROVIDERS = ['Gemini', 'ChatGPT', 'Kimi', 'Claude', 'DeepSeek'] as const

type ProviderSelectProps = {
  value: string
  onChange: (provider: string) => void
}

export const ProviderSelect = memo(function ProviderSelect({ value, onChange }: ProviderSelectProps) {
  return (
    <div className="max-w-md">
      <label htmlFor="provider-select" className="text-sm font-semibold text-slate-900">
        AI provider
      </label>
      <p className="mt-1 text-xs text-slate-500">Runtime target for this configuration.</p>
      <select
        id="provider-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm shadow-md transition hover:border-slate-300 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
      >
        <option value="">Select a provider</option>
        {PROVIDERS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
    </div>
  )
})
