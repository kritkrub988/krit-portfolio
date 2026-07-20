import { portraitWorkflow, workflowSteps } from "@/data/ai-portrait"
import { ProgressBar } from "@/components/ai-portrait-prompt/progress-bar"
import { canNavigateToStep, validateStepAnswer } from "@/lib/ai-portrait/validation"
import type { PortraitProject } from "@/types/ai-portrait"

type WorkflowSidebarProps = {
  project: PortraitProject
  currentStepId: string
  onNavigate: (stepId: string) => void
}

export function WorkflowSidebar({ project, currentStepId, onNavigate }: WorkflowSidebarProps) {
  const completed = workflowSteps.filter((step) => validateStepAnswer(step, project.answers[step.id]).length === 0).length
  return (
    <aside className="h-full border-r border-slate-200 bg-white p-4 lg:overflow-y-auto lg:p-5">
      <ProgressBar completed={completed} total={workflowSteps.length} />
      <nav aria-label="AI Portrait workflow" className="mt-6 space-y-5">
        {portraitWorkflow.phases.map((phase) => (
          <section key={phase.id}>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Phase {phase.code} · {phase.title}</h2>
            <ol className="mt-2 space-y-1">
              {phase.steps.map((step) => {
                const current = step.id === currentStepId
                const complete = validateStepAnswer(step, project.answers[step.id]).length === 0
                const available = canNavigateToStep(project, step.id) || complete || current
                return (
                  <li key={step.id}>
                    <button
                      type="button"
                      disabled={!available}
                      onClick={() => onNavigate(step.id)}
                      aria-current={current ? "step" : undefined}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold transition ${current ? "bg-blue-600 text-white shadow-sm" : complete ? "bg-emerald-50 text-emerald-800 hover:bg-emerald-100" : available ? "text-slate-700 hover:bg-slate-100" : "cursor-not-allowed text-slate-400"}`}
                    >
                      <span aria-hidden="true" className="w-4 text-center">{current ? "●" : complete ? "✓" : available ? "○" : "🔒"}</span>
                      <span>{step.code} {step.title}</span>
                    </button>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </nav>
    </aside>
  )
}

