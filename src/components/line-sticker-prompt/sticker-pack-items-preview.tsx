import {
  stickerPackModeNotes,
} from "@/data/line-sticker/sticker-packs"
import type { StickerPack } from "@/types/line-sticker"

export function StickerPackItemsPreview({
  selectedStickerPack,
}: {
  selectedStickerPack: StickerPack
}) {
  const modeNote = stickerPackModeNotes[selectedStickerPack.characterMode]

  return (
    <section aria-labelledby="sticker-items-heading">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-600">
        Items Preview
      </p>
      <h2
        id="sticker-items-heading"
        className="mt-1 text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl"
      >
        3. ตรวจรายการ 16 ภาพ
      </h2>
      <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">
        ตรวจข้อความและท่าทางก่อนสร้าง Prompt รายการนี้จะใช้กำหนดภาพทั้ง 16 ช่อง และใช้เป็นข้อความเริ่มต้นหลังจากตัดภาพแล้ว
      </p>

      {modeNote ? (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {modeNote}
        </p>
      ) : null}

      <ol className="mt-5 grid gap-3 md:grid-cols-2">
        {selectedStickerPack.items.map((item) => (
          <li
            key={item.id}
            className="flex min-w-0 gap-3 rounded-2xl border border-sky-100 bg-white p-4 shadow-sm"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-100 font-mono text-sm font-extrabold text-sky-700">
              {item.id.toString().padStart(2, "0")}
            </span>
            <span className="min-w-0">
              <span className="block font-extrabold text-slate-950">
                {item.text}
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-600">
                {item.action}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
