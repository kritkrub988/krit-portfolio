export type InputType =
  | "select"
  | "multiselect"
  | "text"
  | "textarea"
  | "confirm"

export type PromptBlockKey =
  | "projectSetup"
  | "creativeDirection"
  | "modelIdentity"
  | "lookRecipe"
  | "environment"
  | "styling"
  | "cameraPackage"
  | "lightingDesign"
  | "colorPipeline"
  | "imageFormat"
  | "shotPlanning"
  | "continuity"
  | "negativeConstraints"
  | "outputRequirements"
  | "productionQa"

export type ProjectStatus =
  | "draft"
  | "brief-approved"
  | "prompt-ready"
  | "archived"

export type WorkflowStepStatus =
  | "not-started"
  | "current"
  | "completed"
  | "needs-attention"
  | "locked"

export type StepValidationRule = {
  type: "minSelections" | "maxSelections" | "minLength" | "maxLength"
  value: number
  message: string
}

export type WorkflowOption = {
  id: string
  code: string
  label: string
  description: string
  promptValue: string
  tags?: string[]
  recommendedForModels?: string[]
  recommendedForGoals?: string[]
  blockedForModels?: string[]
  metadata?: Record<string, unknown>
}

export type WorkflowStep = {
  id: string
  phaseId: string
  code: string
  /** Presentation-only numbering used when stable step IDs must remain unchanged. */
  displayCode?: string
  title: string
  description?: string
  inputType: InputType
  required: boolean
  order: number
  options?: WorkflowOption[]
  allowsCustom?: boolean
  promptBlock: PromptBlockKey
  validation?: StepValidationRule[]
  dependencyRuleIds?: string[]
}

export type WorkflowPhase = {
  id: string
  code: string
  title: string
  description?: string
  order: number
  steps: WorkflowStep[]
}

export type WorkflowDefinition = {
  version: string
  phases: WorkflowPhase[]
}

export type SelectionMode = "auto" | "manual" | "custom"
export type AutoConfidence = "high" | "medium" | "low"

export type ImageRatioId =
  | "auto"
  | "9:16"
  | "16:9"
  | "4:5"
  | "5:4"
  | "2:3"
  | "3:2"
  | "1:1"
  | "custom"

export type ImageRatioPresetId = Exclude<ImageRatioId, "auto" | "custom">

export type ImageRatioOption = {
  id: ImageRatioId
  label: string
  orientation: "portrait" | "landscape" | "square" | "custom"
  widthRatio?: number
  heightRatio?: number
  description: string
  recommendedPlatforms: string[]
  compositionGuidance: string[]
  promptValue: string
  pixelReference?: string
  safeZone: string
  cropStrategy: string
  copySpace: string
}

export type ImageRatioSelection = {
  primary?: ImageRatioPresetId | string
  secondary: ImageRatioPresetId[]
  customWidthRatio?: number
  customHeightRatio?: number
  shotOverrides?: Record<string, ImageRatioPresetId>
}

export type ProjectAnswer = {
  stepId: string
  selectionMode: SelectionMode
  selectedOptionIds: string[]
  resolvedOptionIds: string[]
  /** Kept only so V1 snapshots can be read without rewriting history. */
  optionIds?: string[]
  customValue?: string
  autoReason?: string
  autoConfidence?: AutoConfidence
  imageRatio?: ImageRatioSelection
  updatedAt: string
}

export type AutoDecisionLog = {
  id: string
  projectId: string
  stepId: string
  previousOptionIds: string[]
  resolvedOptionIds: string[]
  reason: string
  confidence: AutoConfidence
  warnings: string[]
  triggeredBy?: string
  createdAt: string
}

export type CameraPackage = {
  id: string
  name: string
  camera: string
  lens: string
  focalLength: string
  aperture: string
  distance: string
  height: string
  opticalCharacter: string
  captureMedia: string[]
  recommendedModels: string[]
}

export type PortraitModel = {
  id: string
  stageName: string
  identityVersion: string
  age: number
  nationality: string
  ageStatus: "MINOR" | "ADULT"
  role: string
  background: string
  promptIdentity: string
  character: string[]
  primaryWork: string[]
  facialIdentity: string[]
  hairIdentity: string[]
  bodySilhouette: string
  uniqueMarker: string
  signatureExpression: string
  approvedStyles: string[]
  restrictedDirections: string[]
  wardrobeRange: string[]
  cameraPackageIds: string[]
  signatureColor: string[]
}

export type LookRecipe = {
  id: string
  name: string
  recommendedModels: string[]
  goals: string[]
  narrative: string
  location: string
  season?: string
  time?: string
  captureMedium: string
  camera: string
  lens: string
  aperture: string
  cameraDistance?: string
  cameraHeight?: string
  lightingPlan: string
  wardrobe: string
  hair: string
  makeup: string
  filmOrSimulation: string
  postGrade: string
  grain: string
  halation: string
  shotCoverage: string[]
  negativeConstraints: string[]
  qaFocus: string[]
  tags: string[]
}

export type QaRule = {
  id: string
  category: string
  label: string
  severity: "critical" | "quality"
  promptInstruction: string
}

export type ExportProfile = {
  id: string
  name: string
  description: string
  formats: string[]
  ratios: string[]
  requirements: string[]
}

export type PortraitProjectSnapshot = {
  name: string
  status: ProjectStatus
  currentStepId: string
  answers: Record<string, ProjectAnswer>
  selectedModelId?: string
  selectedRecipeId?: string
  briefApprovedAt?: string
}

export type PromptVersion = {
  id: string
  projectId: string
  versionNumber: number
  promptText: string
  briefText: string
  snapshot: PortraitProjectSnapshot
  createdAt: string
}

export type PortraitProject = PortraitProjectSnapshot & {
  id: string
  createdAt: string
  updatedAt: string
}

export type PromptBlock = {
  key: PromptBlockKey
  title: string
  content: string
  sourceStepIds: string[]
}

export type PromptWarning = {
  code: string
  message: string
  stepId?: string
  severity: "info" | "warning" | "error"
}

export type PortraitPromptExport = {
  schemaVersion: 3
  generatedAt: string
  project: PortraitProjectSnapshot
  model: PortraitModel | null
  recipe: LookRecipe | null
  imageRatio: ImageRatioExport
  promptBlocks: PromptBlock[]
  finalPrompt: string
  warnings: PromptWarning[]
}

export type ImageRatioExport = {
  selectionMode: SelectionMode
  primary: string
  secondary: ImageRatioPresetId[]
  orientation: "portrait" | "landscape" | "square" | "custom"
  pixelReference: string
  platformFit: string[]
  compositionGuidance: string[]
  safeZone: string
  cropStrategy: string
  copySpace: string
  shotOverrides: Record<string, ImageRatioPresetId>
  filenameToken: string
  shotFilenameTemplate: string
}

export type BuiltPrompt = {
  fullPrompt: string
  blocks: PromptBlock[]
  brief: string
  json: PortraitPromptExport
  warnings: PromptWarning[]
}

export type CreateProjectInput = {
  name?: string
  currentStepId: string
}

export type ExportHistoryRecord = {
  id: string
  projectId: string
  versionId?: string
  format: "txt" | "md" | "json"
  filename: string
  createdAt: string
}

export type CustomRecipe = LookRecipe & {
  projectId?: string
  createdAt: string
  updatedAt: string
}

export interface PortraitProjectRepository {
  createProject(input: CreateProjectInput): Promise<PortraitProject>
  getProject(id: string): Promise<PortraitProject | null>
  listProjects(): Promise<PortraitProject[]>
  updateProject(
    id: string,
    patch: Partial<PortraitProject>,
  ): Promise<PortraitProject>
  deleteProject(id: string): Promise<void>
  saveAnswer(projectId: string, answer: ProjectAnswer): Promise<void>
  savePromptVersion(projectId: string, version: PromptVersion): Promise<void>
  listPromptVersions(projectId: string): Promise<PromptVersion[]>
  deletePromptVersion(versionId: string): Promise<void>
  saveAutoDecisionLogs?(logs: AutoDecisionLog[]): Promise<void>
  listAutoDecisionLogs?(projectId: string): Promise<AutoDecisionLog[]>
}
