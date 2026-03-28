import { SessionTimer } from '../SessionTimer'

type AppHeaderProps = {
  loading: boolean
  onReload: () => void
}

export function AppHeader({ loading, onReload }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <div className='flex items-center gap-5 justify-between'>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Builder</p>
            
              <a href='https://drive.google.com/file/d/1ocY0AjzKkumFxi9I_HRvWqG5g3XXcyin/view'
              className="text-xs font-semibold uppercase tracking-wider text-brand-600 cursor-pointer "
              >RESUME</a>
            
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            AI Agent Builder
          </h1>
          <p className="mt-2 max-w-xl text-slate-600">
            Drag skills and personality layers onto your agent, pick a base profile, then save presets.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SessionTimer />
          <button
            type="button"
            onClick={onReload}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Loading…' : 'Reload configuration'}
          </button>
        </div>
      </div>
    </header>
  )
}
