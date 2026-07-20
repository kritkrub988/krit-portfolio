import type { LookRecipe } from "@/types/ai-portrait"

export function RecipeDetailCard({ recipe }: { recipe: LookRecipe }) {
  const details = [
    ["Goal", recipe.goals.join(", ")],
    ["Location", recipe.location],
    ["Camera", `${recipe.camera} · ${recipe.lens} · ${recipe.aperture}`],
    ["Lighting", recipe.lightingPlan],
    ["Film / Simulation", recipe.filmOrSimulation],
    ["Post Grade", recipe.postGrade],
    ["Shot Coverage", recipe.shotCoverage.join(", ")],
    ["QA Focus", recipe.qaFocus.join(", ")],
  ]
  return (
    <section className="mt-6 rounded-3xl border border-blue-200 bg-blue-50/70 p-5" aria-label={`รายละเอียด Recipe ${recipe.name}`}>
      <p className="font-mono text-xs font-bold text-blue-700">{recipe.id}</p>
      <h3 className="mt-1 text-xl font-extrabold text-slate-950">{recipe.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{recipe.narrative}</p>
      <dl className="mt-5 grid gap-3 text-sm">
        {details.map(([label, value]) => <div key={label} className="grid gap-1 sm:grid-cols-[9rem_1fr]"><dt className="font-bold text-slate-900">{label}</dt><dd className="text-slate-600">{value}</dd></div>)}
      </dl>
    </section>
  )
}

