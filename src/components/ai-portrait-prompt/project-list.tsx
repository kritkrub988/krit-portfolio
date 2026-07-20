import { workflowStepById } from "@/data/ai-portrait/workflow"
import type { PortraitProject } from "@/types/ai-portrait"

type ProjectListProps = {
  projects: PortraitProject[]
  query: string
  onQueryChange: (value: string) => void
  onBack: () => void
  onNew: () => void
  onOpen: (project: PortraitProject) => void
  onRename: (project: PortraitProject) => void
  onDuplicate: (project: PortraitProject) => void
  onArchive: (project: PortraitProject) => void
  onDelete: (project: PortraitProject) => void
}

export function ProjectList({ projects, query, onQueryChange, onBack, onNew, onOpen, onRename, onDuplicate, onArchive, onDelete }: ProjectListProps) {
  const filtered = projects.filter((project) => project.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <button type="button" onClick={onBack} className="text-sm font-bold text-blue-700 hover:text-blue-900">← กลับหน้าเริ่มต้น</button>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-bold uppercase tracking-wider text-violet-600">Saved locally in your browser</p><h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950">Portrait Projects</h1></div>
          <button type="button" onClick={onNew} className="rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-bold text-white">+ New Project</button>
        </div>
        <label className="mt-8 block max-w-xl text-sm font-bold text-slate-800">ค้นหา Project
          <input type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 font-normal outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" placeholder="ค้นหาจากชื่อ..." />
        </label>
        {filtered.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><p className="font-bold text-slate-900">ยังไม่มี Project ที่ตรงกับการค้นหา</p><p className="mt-2 text-sm text-slate-500">เริ่ม Project ใหม่ แล้วระบบจะบันทึก Draft ใน IndexedDB</p></div>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => (
              <article key={project.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-wider text-blue-600">{project.status}</p><h2 className="mt-2 text-xl font-extrabold text-slate-950">{project.name}</h2></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{workflowStepById.get(project.currentStepId)?.code ?? "0.1"}</span></div>
                <dl className="mt-5 grid grid-cols-2 gap-3 text-xs"><div><dt className="font-bold text-slate-500">Model</dt><dd className="mt-1 font-semibold text-slate-800">{project.selectedModelId ?? "ยังไม่เลือก"}</dd></div><div><dt className="font-bold text-slate-500">Recipe</dt><dd className="mt-1 font-semibold text-slate-800">{project.selectedRecipeId ?? "ยังไม่เลือก"}</dd></div></dl>
                <p className="mt-4 text-xs text-slate-500">อัปเดต {new Date(project.updatedAt).toLocaleString("th-TH")}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button type="button" onClick={() => onOpen(project)} className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white">เปิด</button>
                  <button type="button" onClick={() => onRename(project)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">Rename</button>
                  <button type="button" onClick={() => onDuplicate(project)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">Duplicate</button>
                  <button type="button" onClick={() => onArchive(project)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700">{project.status === "archived" ? "Unarchive" : "Archive"}</button>
                  <button type="button" onClick={() => onDelete(project)} className="rounded-xl border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700">Delete</button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
