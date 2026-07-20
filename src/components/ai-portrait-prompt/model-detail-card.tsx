import type { PortraitModel } from "@/types/ai-portrait"

export function ModelDetailCard({ model }: { model: PortraitModel }) {
  return (
    <section className="mt-6 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50 p-5" aria-label={`รายละเอียด Model ${model.stageName}`}>
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 text-lg font-black text-white" aria-hidden="true">{model.stageName.slice(0, 1)}</div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-violet-700">{model.id}</p>
          <h3 className="mt-1 flex flex-wrap items-center gap-2 text-xl font-extrabold text-slate-950">{model.stageName} · {model.age}<span className={`rounded-full px-2 py-0.5 text-[10px] ${model.ageStatus === "MINOR" ? "bg-amber-200 text-amber-950" : "bg-emerald-200 text-emerald-950"}`}>{model.ageStatus}</span></h3>
          <p className="mt-1 text-sm text-slate-600">{model.nationality} · {model.role}</p>
        </div>
      </div>
      <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
        <div><dt className="font-bold text-slate-900">Identity Version</dt><dd className="mt-1 font-mono text-slate-600">{model.identityVersion}</dd></div>
        <div><dt className="font-bold text-slate-900">Stage / Model ID</dt><dd className="mt-1 text-slate-600">{model.stageName} / {model.id}</dd></div>
        <div className="sm:col-span-2"><dt className="font-bold text-slate-900">Official Prompt Identity</dt><dd className="mt-1 text-slate-600">{model.promptIdentity}</dd></div>
        <div><dt className="font-bold text-slate-900">Identity Anchor</dt><dd className="mt-1 text-slate-600">{model.uniqueMarker}; {model.signatureExpression}</dd></div>
        <div><dt className="font-bold text-slate-900">Recommended Styles</dt><dd className="mt-1 text-slate-600">{model.approvedStyles.slice(0, 4).join(", ")}</dd></div>
        <div><dt className="font-bold text-slate-900">Restricted Direction</dt><dd className="mt-1 text-slate-600">{model.restrictedDirections.slice(0, 2).join("; ")}</dd></div>
      </dl>
    </section>
  )
}
