import { Eraser, RotateCcw } from "lucide-react"
import { stickerMessageSoftLimit } from "@/data/line-sticker/default-messages"

type MessageEditorProps = {
  messages: string[]
  onMessageChange: (index: number, value: string) => void
  onRestoreDefaults: () => void
  onClearAll: () => void
}

export function MessageEditor({
  messages,
  onMessageChange,
  onRestoreDefaults,
  onClearAll,
}: MessageEditorProps) {
  return (
    <section aria-labelledby="message-heading">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sky-100 text-sm font-extrabold text-sky-700">
            3
          </span>
          <div>
            <h2 id="message-heading" className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl">
              ใส่ข้อความสติกเกอร์ 16 ประโยค
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              แก้ข้อความได้ทุกช่อง แนะนำไม่เกิน {stickerMessageSoftLimit} ตัวอักษรเพื่อให้อ่านง่าย
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <button
            type="button"
            onClick={onRestoreDefaults}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500"
          >
            <RotateCcw size={15} aria-hidden="true" />
            คืนค่าเริ่มต้น
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-3 text-xs font-bold text-rose-700 transition hover:bg-rose-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500"
          >
            <Eraser size={15} aria-hidden="true" />
            ล้างทั้งหมด
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {messages.map((message, index) => {
          const count = Array.from(message).length
          const tooLong = count > stickerMessageSoftLimit
          const fieldId = `sticker-message-${index + 1}`
          return (
            <div
              key={fieldId}
              className={`rounded-2xl border bg-white p-3 shadow-sm ${tooLong ? "border-amber-300" : "border-slate-200"}`}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <label htmlFor={fieldId} className="text-xs font-extrabold text-slate-700">
                  {String(index + 1).padStart(2, "0")}
                </label>
                <span className={`text-[10px] font-bold ${tooLong ? "text-amber-700" : "text-slate-400"}`}>
                  {count}/{stickerMessageSoftLimit}
                </span>
              </div>
              <input
                id={fieldId}
                value={message}
                onChange={(event) => onMessageChange(index, event.target.value)}
                aria-describedby={tooLong ? `${fieldId}-warning` : undefined}
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-base font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                placeholder={`ข้อความที่ ${String(index + 1).padStart(2, "0")}`}
              />
              {tooLong ? (
                <p id={`${fieldId}-warning`} className="mt-2 text-[11px] leading-4 text-amber-700">
                  ข้อความอาจแน่นเกินไปบนสติกเกอร์
                </p>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}
