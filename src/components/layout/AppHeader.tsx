import { CV_CANDIDATE_NAME, CV_CANDIDATE_ROLE } from '../../config/cv'
import { SessionTimer } from '../SessionTimer'
import { CvSpotlight } from './CvSpotlight'

type AppHeaderProps = {
  loading: boolean
  onReload: () => void
}

export function AppHeader({ loading, onReload }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-4 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-6">
        <div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">Builder</p>
            <span className="hidden h-4 w-px bg-slate-200 sm:block" aria-hidden />
            <p className="text-xs text-slate-600">
              <span className="font-medium text-slate-800">{CV_CANDIDATE_NAME}</span>
              <span className="text-slate-400"> · </span>
              <span>{CV_CANDIDATE_ROLE}</span>
            </p>
            <CvSpotlight />
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
