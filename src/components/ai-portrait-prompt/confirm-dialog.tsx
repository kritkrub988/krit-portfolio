"use client"

import { useEffect, useRef } from "react"

type ConfirmDialogProps = {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "ยืนยัน",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const previousFocus = document.activeElement as HTMLElement | null
    cancelRef.current?.focus()
    return () => previousFocus?.focus()
  }, [open])

  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onCancel()
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onCancel()
        if (event.key === "Tab") {
          const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
            "button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
          )
          if (!focusable?.length) return
          const first = focusable[0]
          const last = focusable[focusable.length - 1]
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault()
            last.focus()
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault()
            first.focus()
          }
        }
      }}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="portrait-confirm-title"
        aria-describedby="portrait-confirm-description"
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <h2 id="portrait-confirm-title" className="text-xl font-extrabold text-slate-950">{title}</h2>
        <p id="portrait-confirm-description" className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button ref={cancelRef} type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            ยกเลิก
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white ${danger ? "bg-rose-600 hover:bg-rose-700" : "bg-blue-600 hover:bg-blue-700"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
