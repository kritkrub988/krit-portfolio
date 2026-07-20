import { cameraPackages } from "./models.ts"
import { lookRecipes } from "./recipes.ts"
import type {
  PromptBlockKey,
  WorkflowDefinition,
  WorkflowOption,
  WorkflowPhase,
  WorkflowStep,
} from "../../types/ai-portrait.ts"

type OptionInput = {
  code: string
  label: string
  description?: string
  promptValue?: string
  tags?: string[]
  metadata?: Record<string, unknown>
}

function createOptions(stepId: string, inputs: OptionInput[]): WorkflowOption[] {
  return inputs.map((input) => ({
    id: `${stepId}:${input.code.toLowerCase()}`,
    code: input.code,
    label: input.label,
    description: input.description ?? input.label,
    promptValue: input.promptValue ?? input.label,
    tags: input.tags,
    metadata: input.metadata,
  }))
}

function createStep(
  phaseId: string,
  order: number,
  code: string,
  title: string,
  promptBlock: PromptBlockKey,
  options: OptionInput[],
  config: Partial<WorkflowStep> = {},
): WorkflowStep {
  const id = `step-${code.replace(".", "-")}`
  return {
    id,
    phaseId,
    code,
    title,
    inputType: "select",
    required: true,
    order,
    options: createOptions(id, options),
    promptBlock,
    ...config,
  }
}

const sourcePhases: WorkflowPhase[] = [
  {
    id: "phase-0",
    code: "0",
    title: "Project Setup",
    description: "กำหนดเป้าหมาย ผู้ชม ช่องทาง และ Deliverables",
    order: 0,
    steps: [
      createStep("phase-0", 0, "0.1", "เลือกเป้าหมายหลัก", "projectSetup", [
        { code: "A", label: "Portfolio Hero", description: "โชว์คุณภาพภาพและฝีมือของเพจ" },
        { code: "B", label: "Social Content", description: "สร้างภาพสำหรับโพสต์ต่อเนื่อง" },
        { code: "C", label: "Fashion Editorial", description: "สร้างเรื่องแฟชั่นแบบนิตยสาร" },
        { code: "D", label: "Beauty Campaign", description: "เน้นใบหน้า ผิว Makeup และผลิตภัณฑ์ความงาม" },
        { code: "E", label: "Lookbook", description: "แสดงเสื้อผ้าหลาย Look อย่างต่อเนื่อง" },
        { code: "F", label: "Personal Branding", description: "ภาพผู้เชี่ยวชาญ เจ้าของเพจ หรือผู้บริหาร" },
        { code: "G", label: "Commercial Advertising", description: "ภาพสำหรับสินค้า แบรนด์ หรือ Campaign" },
        { code: "H", label: "Cinematic Story", description: "ภาพชุดเหมือนฉากภาพยนตร์" },
        { code: "I", label: "Japanese Photo Story", description: "ภาพชุดภาษาภาพญี่ปุ่น" },
        { code: "J", label: "Custom Brief", description: "กำหนดเป้าหมายเอง" },
      ], { allowsCustom: true }),
      createStep("phase-0", 1, "0.2", "เลือกผู้ชม", "projectSetup", [
        { code: "A", label: "ผู้ติดตามทั่วไป" },
        { code: "B", label: "กลุ่มแฟชั่นและความงาม" },
        { code: "C", label: "เจ้าของธุรกิจและคนทำงาน" },
        { code: "D", label: "ลูกค้าที่ต้องการจ้างทำ AI Portrait" },
        { code: "E", label: "แบรนด์หรือร้านค้า" },
        { code: "F", label: "Magazine / Editorial Audience" },
        { code: "G", label: "Custom Audience" },
      ], { allowsCustom: true }),
      createStep("phase-0", 2, "0.3", "เลือกช่องทางหลัก", "projectSetup", [
        { code: "A", label: "Facebook Feed" },
        { code: "B", label: "Instagram Feed" },
        { code: "C", label: "Instagram Carousel" },
        { code: "D", label: "Story / Reel Cover" },
        { code: "E", label: "Website Portfolio" },
        { code: "F", label: "Print / Poster" },
        { code: "G", label: "Multi-platform" },
        { code: "H", label: "Custom Platform" },
      ], { allowsCustom: true }),
      createStep("phase-0", 3, "0.4", "เลือก Deliverables", "outputRequirements", [
        { code: "A", label: "Hero Image 1 ภาพ" },
        { code: "B", label: "Photo Set 5 ภาพ" },
        { code: "C", label: "Editorial Set 8 ภาพ" },
        { code: "D", label: "Campaign Set 12 ภาพ" },
        { code: "E", label: "Carousel 6–10 หน้า" },
        { code: "F", label: "Cover + Supporting Set" },
        { code: "G", label: "Multi-ratio Social Package" },
        { code: "H", label: "Custom จำนวนภาพ" },
      ], { allowsCustom: true }),
    ],
  },
  {
    id: "phase-1",
    code: "1",
    title: "Creative Direction",
    description: "กำหนดแนวคิด เรื่องราว และภาษาภาพ",
    order: 1,
    steps: [
      createStep("phase-1", 0, "1.1", "เลือก Big Idea", "creativeDirection", [
        { code: "A", label: "Everyday Beauty" },
        { code: "B", label: "Modern Femininity" },
        { code: "C", label: "Youth Memory" },
        { code: "D", label: "Quiet Luxury" },
        { code: "E", label: "Power and Presence" },
        { code: "F", label: "Work and Wellness" },
        { code: "G", label: "City After Rain" },
        { code: "H", label: "Seasonal Story" },
        { code: "I", label: "Brand-led Concept" },
        { code: "J", label: "Custom Big Idea" },
      ], { allowsCustom: true }),
      createStep("phase-1", 1, "1.2", "เลือก Narrative", "creativeDirection", [
        { code: "A", label: "Moment เดียวที่ทรงพลัง" },
        { code: "B", label: "หนึ่งวันของตัวละคร" },
        { code: "C", label: "การเดินทางจากจุดหนึ่งไปอีกจุด" },
        { code: "D", label: "Fashion Transformation" },
        { code: "E", label: "Before / During / After" },
        { code: "F", label: "Portrait Study หลายอารมณ์" },
        { code: "G", label: "Product-led Story" },
        { code: "H", label: "Custom Narrative" },
      ], { allowsCustom: true }),
      createStep("phase-1", 2, "1.3", "เลือก Visual Language", "creativeDirection", [
        { code: "A", label: "Natural Documentary" },
        { code: "B", label: "Clean Editorial" },
        { code: "C", label: "Film Nostalgia" },
        { code: "D", label: "High Fashion" },
        { code: "E", label: "Cinematic" },
        { code: "F", label: "Minimal Fine Art" },
        { code: "G", label: "Direct Flash" },
        { code: "H", label: "Luxury Commercial" },
        { code: "I", label: "Raw Street" },
        { code: "J", label: "Custom Visual Language" },
      ], { allowsCustom: true }),
    ],
  },
  {
    id: "phase-2",
    code: "2",
    title: "Model Selection",
    description: "เลือกบุคคลสมมติและล็อก Identity Version",
    order: 2,
    steps: [
      createStep("phase-2", 0, "2.1", "เลือก Model", "modelIdentity", [
        { code: "A", label: "YUNA — 19 · ญี่ปุ่น · ADULT", description: "Cute / Fresh / Playful — Youth, Lifestyle, Japanese Snapshot", promptValue: "YUNA", metadata: { modelId: "MODEL_A_YUNA" } },
        { code: "B", label: "MEI — 23 · จีน · ADULT", description: "Fashion / Elegant / Clean Beauty — Beauty, Editorial, Lookbook", promptValue: "MEI", metadata: { modelId: "MODEL_B_MEI" } },
        { code: "C", label: "RIN — 28 · ญี่ปุ่น–จีน · ADULT", description: "Bold / Luxury / Dark Feminine — High Fashion, Luxury, Cinematic", promptValue: "RIN", metadata: { modelId: "MODEL_C_RIN" } },
        { code: "D", label: "HANA — 33 · เกาหลีใต้ · ADULT", description: "Professional / Fit / Modern — Branding, Corporate, Wellness", promptValue: "HANA", metadata: { modelId: "MODEL_D_HANA" } },
        { code: "E", label: "AKARI — 17 · ญี่ปุ่น · MINOR", description: "Family-safe school life / student lifestyle / cute portrait", promptValue: "AKARI", metadata: { modelId: "MODEL_E_AKARI" } },
        { code: "F", label: "HAEUN — 18 · เกาหลีใต้ · ADULT", description: "Modern campus / café / library / clean Korean casual", promptValue: "HAEUN", metadata: { modelId: "MODEL_F_HAEUN" } },
      ]),
      createStep("phase-2", 1, "2.2", "Identity Lock", "modelIdentity", [
        { code: "A", label: "ใช้ Official Identity Version", promptValue: "Official identity version approved and locked" },
        { code: "B", label: "ดูรายละเอียด Model Bible" },
        { code: "C", label: "เปลี่ยน Model" },
        { code: "D", label: "หยุดเพื่อแก้ Model Bible" },
      ], { inputType: "confirm", dependencyRuleIds: ["requires-model"] }),
    ],
  },
  {
    id: "phase-3",
    code: "3",
    title: "Look Recipe",
    description: "เลือก Recipe, Capture Medium และ Camera Package ที่เข้ากัน",
    order: 3,
    steps: [
      createStep("phase-3", 0, "3.1", "เลือก Recipe", "lookRecipe", [
        ...lookRecipes.map((recipe, index) => ({
          code: String.fromCharCode(65 + index),
          label: `${recipe.id} — ${recipe.name}`,
          description: `${recipe.narrative}; เหมาะกับ ${recipe.recommendedModels.join(", ")}`,
          promptValue: recipe.name,
          tags: recipe.tags,
          metadata: { recipeId: recipe.id },
        })),
        { code: "Q", label: "Custom Recipe", description: "สร้าง Recipe ใหม่จากข้อมูลของผู้ใช้" },
      ], { allowsCustom: true, dependencyRuleIds: ["recipe-model-compatibility"] }),
      createStep("phase-3", 1, "3.2", "ล็อก Capture Medium", "cameraPackage", [
        { code: "A", label: "Digital Full Frame" },
        { code: "B", label: "Digital Medium Format" },
        { code: "C", label: "35mm Film" },
        { code: "D", label: "Medium Format Film" },
        { code: "E", label: "Compact Film" },
        { code: "F", label: "Cinema-inspired Digital" },
        { code: "G", label: "Custom Capture Medium" },
      ], { allowsCustom: true }),
      createStep("phase-3", 2, "3.3", "ล็อก Camera Package", "cameraPackage", [
        ...cameraPackages.map((cameraPackage, index) => ({
          code: cameraPackage.id === "CAM_AKARI_SCHOOL_LIFE" ? "J" : cameraPackage.id === "CAM_HAEUN_CAMPUS" ? "K" : String.fromCharCode(65 + index),
          label: cameraPackage.name,
          description: `${cameraPackage.camera} + ${cameraPackage.lens}; ${cameraPackage.aperture}; ${cameraPackage.opticalCharacter}`,
          promptValue: `${cameraPackage.camera}, ${cameraPackage.lens}, ${cameraPackage.aperture}, ${cameraPackage.distance}, ${cameraPackage.height}`,
          metadata: { cameraPackageId: cameraPackage.id },
        })),
        { code: "I", label: "Custom Camera Package" },
      ], { allowsCustom: true, dependencyRuleIds: ["camera-model-medium-compatibility"] }),
    ],
  },
  {
    id: "phase-4",
    code: "4",
    title: "Set, Location and Atmosphere",
    description: "กำหนดสถานที่ ฤดูกาล เวลา และสภาพอากาศ",
    order: 4,
    steps: [
      createStep("phase-4", 0, "4.1", "เลือกสถานที่", "environment", [
        { code: "A", label: "Studio Seamless" }, { code: "B", label: "Interior Lifestyle" },
        { code: "C", label: "Café / Bookstore" }, { code: "D", label: "Modern Office" },
        { code: "E", label: "Urban Street" }, { code: "F", label: "Train / Station" },
        { code: "G", label: "Nature / Field" }, { code: "H", label: "Seaside" },
        { code: "I", label: "Night City" }, { code: "J", label: "Custom Location" },
      ], { allowsCustom: true }),
      createStep("phase-4", 1, "4.2", "เลือกฤดูกาล", "environment", [
        { code: "A", label: "Spring" }, { code: "B", label: "Rainy Season" },
        { code: "C", label: "Summer" }, { code: "D", label: "Autumn" },
        { code: "E", label: "Winter" }, { code: "F", label: "Season-neutral" },
      ]),
      createStep("phase-4", 2, "4.3", "เลือกเวลา", "environment", [
        { code: "A", label: "Early Morning" }, { code: "B", label: "Late Morning" },
        { code: "C", label: "Midday Hard Sun" }, { code: "D", label: "Late Afternoon" },
        { code: "E", label: "Golden Hour" }, { code: "F", label: "Blue Hour" },
        { code: "G", label: "Night" }, { code: "H", label: "Controlled Studio Time" },
      ]),
      createStep("phase-4", 3, "4.4", "เลือกสภาพอากาศ", "environment", [
        { code: "A", label: "Clear" }, { code: "B", label: "Overcast" },
        { code: "C", label: "Light Rain" }, { code: "D", label: "After Rain" },
        { code: "E", label: "Windy" }, { code: "F", label: "Snow" },
        { code: "G", label: "Indoor Controlled" }, { code: "H", label: "Custom Weather" },
      ], { allowsCustom: true }),
    ],
  },
  {
    id: "phase-5",
    code: "5",
    title: "Styling",
    description: "กำหนด Wardrobe, Material, Hair และ Makeup",
    order: 5,
    steps: [
      createStep("phase-5", 0, "5.1", "Wardrobe Direction", "styling", [
        { code: "A", label: "Casual" }, { code: "B", label: "Minimal" },
        { code: "C", label: "Tailored" }, { code: "D", label: "Editorial" },
        { code: "E", label: "Luxury" }, { code: "F", label: "Street Fashion" },
        { code: "G", label: "Wellness / Active" }, { code: "H", label: "Traditional Contemporary" },
        { code: "I", label: "Product-led Wardrobe" }, { code: "J", label: "Custom Wardrobe" },
      ], { allowsCustom: true, dependencyRuleIds: ["wardrobe-model-safety"] }),
      createStep("phase-5", 1, "5.2", "Material and Silhouette", "styling", [
        { code: "A", label: "ระบบแนะนำตาม Recipe", promptValue: "Use the recipe-approved fabric, texture, fit, layers, movement, palette, accessories, and footwear" },
        { code: "B", label: "เลือกจาก Model Wardrobe", promptValue: "Use the official model wardrobe range while preserving identity and movement" },
        { code: "C", label: "ผู้ใช้กำหนดเอง" },
        { code: "D", label: "ใช้สินค้าจริงเป็น Reference", promptValue: "Use the supplied real product reference without changing its geometry, material, logos, or color" },
      ], { allowsCustom: true }),
      createStep("phase-5", 2, "5.3", "Hair", "styling", [
        { code: "A", label: "Signature Hair" }, { code: "B", label: "Soft Wave" },
        { code: "C", label: "Sleek" }, { code: "D", label: "Ponytail / Bun" },
        { code: "E", label: "Wet Hair" }, { code: "F", label: "Wind Movement" },
        { code: "G", label: "Custom Hair" },
      ], { allowsCustom: true, dependencyRuleIds: ["hair-model-compatibility"] }),
      createStep("phase-5", 3, "5.4", "Makeup", "styling", [
        { code: "A", label: "No-makeup Makeup" }, { code: "B", label: "Clean Beauty" },
        { code: "C", label: "Soft Glam" }, { code: "D", label: "Editorial Graphic" },
        { code: "E", label: "Cinematic" }, { code: "F", label: "Corporate Natural" },
        { code: "G", label: "Custom Makeup" },
      ], { allowsCustom: true, dependencyRuleIds: ["makeup-model-safety"] }),
    ],
  },
  {
    id: "phase-6",
    code: "6",
    title: "Lighting Design",
    description: "เลือก Lighting Package และอนุมัติรายละเอียดแสง",
    order: 6,
    steps: [
      createStep("phase-6", 0, "6.1", "Lighting Package", "lightingDesign", [
        { code: "A", label: "Soft Window Daylight" }, { code: "B", label: "Overcast Open Shade" },
        { code: "C", label: "Golden Backlight" }, { code: "D", label: "Clean Beauty Clamshell" },
        { code: "E", label: "Editorial Side Light" }, { code: "F", label: "Hard Flash Fashion" },
        { code: "G", label: "Low-key Rembrandt" }, { code: "H", label: "Mixed Practical Cinema" },
        { code: "I", label: "Vending Machine / Neon" }, { code: "J", label: "Custom Lighting Plan" },
      ], { allowsCustom: true }),
      createStep("phase-6", 1, "6.2", "Lighting Detail Approval", "lightingDesign", [
        { code: "A", label: "อนุมัติ Lighting Plan", promptValue: "Lighting plan approved; lock key, modifier, direction, height, angle, distance, fill ratio, rim, background light, shadow hardness, catchlight, color temperature, and motivated source" },
        { code: "B", label: "ลด Contrast" }, { code: "C", label: "เพิ่ม Drama" },
        { code: "D", label: "เปลี่ยน Lighting Package" },
      ], { inputType: "confirm", dependencyRuleIds: ["requires-lighting-package"] }),
    ],
  },
  {
    id: "phase-7",
    code: "7",
    title: "Color Pipeline",
    description: "แยก Capture Medium, Film/Simulation และ Post Grade อย่างชัดเจน",
    order: 7,
    steps: [
      createStep("phase-7", 0, "7.1", "Capture / Film / Grade Summary", "colorPipeline", [
        { code: "A", label: "ยืนยัน Color Pipeline 3 ชั้น", promptValue: "Keep capture medium, film or in-camera simulation, and post-production grade as three distinct layers" },
      ], { inputType: "confirm", dependencyRuleIds: ["requires-capture-medium"] }),
      createStep("phase-7", 1, "7.2", "Film or Simulation", "colorPipeline", [
        { code: "A", label: "Kodak Portra 160" }, { code: "B", label: "Kodak Portra 400" },
        { code: "C", label: "Kodak Gold 200" }, { code: "D", label: "Fujifilm Pro 400H" },
        { code: "E", label: "Fujicolor Superia 400" }, { code: "F", label: "Kodak Vision3 250D" },
        { code: "G", label: "Kodak Vision3 500T" }, { code: "H", label: "Fujifilm ASTIA" },
        { code: "I", label: "Fujifilm Classic Negative" }, { code: "J", label: "Fujifilm ETERNA" },
        { code: "K", label: "ACROS / B&W" }, { code: "L", label: "Custom Film / Simulation" },
      ], { allowsCustom: true, dependencyRuleIds: ["film-medium-compatibility"] }),
      createStep("phase-7", 2, "7.3", "Post Grade", "colorPipeline", [
        { code: "A", label: "Clean Editorial" }, { code: "B", label: "Japanese Summer" },
        { code: "C", label: "Faded Album" }, { code: "D", label: "Warm Skin / Cool Shadow" },
        { code: "E", label: "Luxury Neutral" }, { code: "F", label: "High-contrast Magazine" },
        { code: "G", label: "Cinema Muted" }, { code: "H", label: "Corporate Neutral" },
        { code: "I", label: "Raw B&W" }, { code: "J", label: "Custom Post Grade" },
      ], { allowsCustom: true }),
      createStep("phase-7", 3, "7.4", "Color Parameters Approval", "colorPipeline", [
        { code: "A", label: "อนุมัติ Color Pipeline", promptValue: "Color pipeline approved; lock white balance, tint, contrast, highlight roll-off, shadow density, skin hue, saturation, grain, halation, bloom, and scanner or print character" },
        { code: "B", label: "อุ่นขึ้น" }, { code: "C", label: "เย็นขึ้น" },
        { code: "D", label: "ลด Grain / Halation" }, { code: "E", label: "เปลี่ยน Film / Grade" },
      ], { inputType: "confirm", dependencyRuleIds: ["requires-color-selection"] }),
    ],
  },
  {
    id: "phase-8",
    code: "8",
    title: "Shot Planning",
    description: "กำหนด Coverage, Shot Cards และ Continuity",
    order: 8,
    steps: [
      createStep("phase-8", 0, "8.1", "Shot Coverage", "shotPlanning", [
        { code: "A", label: "Portrait 5-shot", description: "Hero, Medium, Close-up, Profile, Detail" },
        { code: "B", label: "Editorial 8-shot", description: "Hero Full-body, Three-quarter, Medium, Beauty Close-up, Profile, Movement, Wardrobe Detail, Negative-space Cover" },
        { code: "C", label: "Campaign 12-shot", description: "Hero, Product, Detail, Horizontal, Vertical และ Copy-space" },
        { code: "D", label: "Custom Shot List" },
      ], { allowsCustom: true }),
      createStep("phase-8", 1, "8.2", "Shot Cards", "shotPlanning", [
        { code: "A", label: "สร้าง Shot Cards จาก Coverage", promptValue: "Create a unique shot card for every required frame, including purpose, framing, orientation, camera, lens, camera height and distance, aperture, pose, action, expression, eyeline, wardrobe, lighting, background, copy space, and continuity note" },
        { code: "B", label: "กำหนด Shot Cards เอง" },
      ], { allowsCustom: true }),
      createStep("phase-8", 2, "8.3", "Series Continuity", "continuity", [
        { code: "A", label: "ล็อก Continuity", promptValue: "Lock model identity, wardrobe per look, hair, makeup, accessories, held-object hand, light direction, time, weather, and color pipeline across the series" },
        { code: "B", label: "เปลี่ยน Wardrobe ต่อ Shot" },
        { code: "C", label: "เปลี่ยน Lighting อย่างมีเหตุผล" },
        { code: "D", label: "แก้ Shot List" },
      ], { inputType: "confirm" }),
    ],
  },
  {
    id: "phase-9",
    code: "9",
    title: "Final Brief",
    description: "ตรวจและอนุมัติ Production Brief ก่อนเปิด Final Prompt",
    order: 9,
    steps: [
      createStep("phase-9", 0, "9.1", "Final Brief Preview", "productionQa", [
        { code: "A", label: "ตรวจ Final Brief แล้ว", promptValue: "Final brief reviewed for goal, audience, platform, model identity, recipe, creative, environment, styling, camera, lighting, color, shots, deliverables, and restrictions" },
      ], { inputType: "confirm", dependencyRuleIds: ["requires-all-production-steps"] }),
      createStep("phase-9", 1, "9.2", "Brief Approval", "productionQa", [
        { code: "A", label: "อนุมัติ Brief", promptValue: "Production brief approved" },
        { code: "B", label: "กลับไปแก้ Creative" },
        { code: "C", label: "กลับไปแก้ Technical" },
        { code: "D", label: "เริ่มใหม่" },
      ], { inputType: "confirm", dependencyRuleIds: ["requires-final-brief-review"] }),
    ],
  },
  {
    id: "phase-10",
    code: "10",
    title: "Prompt Package",
    description: "ประกอบ Prompt Blocks, ตรวจ QA และเปิด Final Prompt",
    order: 10,
    steps: [
      createStep("phase-10", 0, "10.1", "Generate Prompt Blocks", "productionQa", [
        { code: "A", label: "สร้าง Professional Prompt Package", promptValue: "Assemble all approved production blocks into one coherent professional prompt package" },
      ], { inputType: "confirm", dependencyRuleIds: ["requires-brief-approval"] }),
      createStep("phase-10", 1, "10.2", "Prompt QA", "productionQa", [
        { code: "A", label: "อนุมัติ Prompt Package", promptValue: "Prompt package approved after checking identity, camera, lighting, color, shot uniqueness, negative constraints, and absence of real-person imitation" },
        { code: "B", label: "เพิ่มความแม่น Identity" },
        { code: "C", label: "เพิ่มความแม่นแสง/กล้อง" },
        { code: "D", label: "แก้ Prompt" },
      ], { inputType: "confirm", dependencyRuleIds: ["requires-prompt-blocks"] }),
      createStep("phase-10", 2, "10.3", "Final Prompt", "productionQa", [
        { code: "A", label: "Prompt พร้อมแล้ว", promptValue: "Prompt พร้อมแล้ว คัดลอกไปวางใน ChatGPT Project เพื่อทำงานขั้นต่อไป" },
      ], { inputType: "confirm", dependencyRuleIds: ["requires-prompt-qa"] }),
    ],
  },
]

const displayPhaseOrder = ["phase-2", "phase-0", "phase-1", "phase-3", "phase-4", "phase-5", "phase-6", "phase-7", "phase-8", "phase-9", "phase-10"]
const displayTitles: Record<string, string> = {
  "phase-2": "Model Selection",
  "phase-0": "Project Setup",
  "phase-1": "Creative Direction",
  "phase-3": "Look Recipe",
  "phase-4": "Set / Location / Atmosphere",
  "phase-5": "Styling",
  "phase-6": "Lighting",
  "phase-7": "Color",
  "phase-8": "Shot Planning",
  "phase-9": "Final Brief",
  "phase-10": "Prompt Package",
}

const phases: WorkflowPhase[] = displayPhaseOrder.map((phaseId, order) => {
  const phase = sourcePhases.find((item) => item.id === phaseId)
  if (!phase) throw new Error(`Missing workflow phase: ${phaseId}`)
  return { ...phase, order, title: displayTitles[phaseId] ?? phase.title }
})

export const portraitWorkflow: WorkflowDefinition = {
  version: "5.1-auto-models",
  phases,
}

export const workflowSteps = phases.flatMap((phase) => phase.steps)

export const workflowStepById = new Map(
  workflowSteps.map((step) => [step.id, step]),
)

export const firstWorkflowStepId = workflowSteps[0]?.id ?? "step-2-1"
