import {
  Download,
  ExternalLink,
  FileText,
  Sparkles,
  X,
} from 'lucide-react'
import { memo, useCallback, useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  CV_CANDIDATE_NAME,
  CV_CANDIDATE_ROLE,
  CV_DOWNLOAD_NAME,
  CV_PATH,
  CV_PUBLIC_FILENAME,
} from '../../config/cv'
import { cn } from '../../utils/cn'

/** Above dnd-kit DragOverlay (~999), sidebar (50), summary sticky (50). */
const PORTAL_Z = 10050

export const CvSpotlight = memo(function CvSpotlight() {
  const [open, setOpen] = useState(false)
  const titleId = useId()

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, close])

  const modal =
    open &&
    createPortal(
      <div
        className="fixed inset-0 flex items-end justify-center p-4 sm:items-center sm:p-6"
        style={{ zIndex: PORTAL_Z }}
        role="presentation"
      >
        <button
          type="button"
          className="absolute inset-0 bg-slate-900/55 backdrop-blur-[2px]"
          style={{ zIndex: 0 }}
          aria-label="Close CV preview"
          onClick={close}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={cn(
            'relative flex max-h-[min(92vh,880px)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl motion-safe:transition motion-safe:duration-200 motion-safe:ease-out sm:rounded-3xl',
          )}
          style={{ zIndex: 1 }}
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900 px-5 py-4 text-white">
            <div
              className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 rounded-full bg-cyan-400/20 blur-2xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-violet-400/20 blur-2xl"
              aria-hidden
            />
            <div className="relative flex flex-wrap items-start justify-between gap-3">
              <div>
                <p id={titleId} className="text-lg font-bold tracking-tight">
                  {CV_CANDIDATE_NAME}
                </p>
                <p className="mt-0.5 text-sm font-medium text-cyan-200/90">{CV_CANDIDATE_ROLE}</p>
                <p className="mt-2 max-w-md text-xs text-white/75">
                  Served from{' '}
                  <code className="rounded bg-white/10 px-1 py-0.5 text-[10px]">
                    public/{CV_PUBLIC_FILENAME}
                  </code>{' '}
                  for reviewers — preview, open in a new tab, or download.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={CV_PATH}
                  download={CV_DOWNLOAD_NAME}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-xs font-medium text-white ring-1 ring-white/25 transition hover:bg-white/25"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden />
                  Download
                </a>
                <a
                  href={CV_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-2 text-xs font-medium text-white ring-1 ring-white/25 transition hover:bg-white/25"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                  New tab
                </a>
                <button
                  type="button"
                  onClick={close}
                  className="rounded-lg p-2 text-white/90 transition hover:bg-white/15 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 bg-slate-100 p-3 sm:p-4">
            <div className="h-[min(70vh,640px)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-inner">
              <iframe
                title={`${CV_CANDIDATE_NAME} CV PDF`}
                src={`${CV_PATH}#view=FitH`}
                className="h-full w-full"
              />
            </div>
          </div>

          <p className="border-t border-slate-100 bg-slate-50 px-5 py-2 text-center text-[11px] text-slate-500">
            Challenge requirement: CV PDF is committed under{' '}
            <span className="font-medium text-slate-700">public/{CV_PUBLIC_FILENAME}</span>.
          </p>
        </div>
      </div>,
      document.body,
    )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-cyan-200/80 bg-gradient-to-r from-cyan-50 via-white to-violet-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-900 shadow-md transition',
          'hover:border-cyan-400 hover:shadow-lg hover:ring-2 hover:ring-cyan-400/25',
        )}
        aria-label={`View ${CV_CANDIDATE_NAME} CV PDF`}
      >
        <span
          className="pointer-events-none absolute -left-6 top-0 h-full w-6 skew-x-12 bg-white/50 opacity-0 transition duration-700 group-hover:translate-x-[180%] group-hover:opacity-100"
          aria-hidden
        />
        <FileText className="h-3.5 w-3.5 text-cyan-700" aria-hidden />
        CV
        <Sparkles className="h-3 w-3 text-violet-500 opacity-80" aria-hidden />
      </button>

      {modal}
    </>
  )
})
