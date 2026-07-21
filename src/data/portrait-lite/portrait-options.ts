import type {
  ImageCountOption,
  PortraitOption,
  PortraitSelection,
} from "../../types/portrait-lite.ts"

export const outfitOptions: PortraitOption[] = [
  { id: "minimal", label: "Minimal", prompt: "a clean minimal contemporary outfit with simple shapes, neutral colors, subtle accessories, and natural styling" },
  { id: "casual", label: "Casual", prompt: "a relaxed contemporary casual outfit with comfortable layers, balanced colors, and effortless everyday styling" },
  { id: "smart-casual", label: "Smart Casual", prompt: "a polished smart-casual outfit with refined separates, clean tailoring, understated accessories, and approachable styling" },
  { id: "street-fashion", label: "Street Fashion", prompt: "a contemporary street-fashion outfit with layered proportions, tasteful statement details, and confident urban styling" },
  { id: "editorial", label: "Editorial", prompt: "a fashion-editorial outfit with sculptural lines, controlled statement details, refined styling, and elegant coverage" },
  { id: "elegant", label: "Elegant", prompt: "an elegant sophisticated outfit with graceful tailoring, premium fabric, subtle accessories, and timeless styling" },
  { id: "sleepwear", label: "Sleepwear", prompt: "tasteful modern sleepwear with a relaxed silhouette, soft fabric, elegant coverage, subtle styling, and a refined lifestyle fashion appearance" },
]

export const locationOptions: PortraitOption[] = [
  { id: "studio", label: "Studio", prompt: "a clean professional portrait studio with a simple textured backdrop, uncluttered styling, and controlled depth" },
  { id: "cafe", label: "Café", prompt: "a modern welcoming café with warm interior textures, soft background activity, and natural window light" },
  { id: "city-street", label: "City Street", prompt: "a contemporary city street with layered architecture, subtle urban movement, and realistic environmental depth" },
  { id: "nature", label: "Nature", prompt: "a calm natural setting with soft greenery, organic textures, gentle depth, and an uncluttered background" },
  { id: "home", label: "Home", prompt: "a bright modern home interior with comfortable details, clean styling, and a relaxed lived-in atmosphere" },
  { id: "beach", label: "Beach", prompt: "a quiet beach with soft sand, open sky, gentle coastal tones, and a clean natural horizon" },
  { id: "bedroom", label: "Bedroom", prompt: "a clean modern bedroom with soft bedding, warm interior details, an uncluttered background, and natural light entering through a nearby window" },
]

export const moodOptions: PortraitOption[] = [
  { id: "soft-natural", label: "Soft Natural", prompt: "soft and natural, with a relaxed expression, gentle body language, calm visual rhythm, and an authentic lifestyle atmosphere" },
  { id: "candid", label: "Candid", prompt: "candid and unstaged, with a spontaneous expression, natural movement, relaxed posture, and an observant lifestyle atmosphere" },
  { id: "warm", label: "Warm", prompt: "warm and approachable, with a friendly expression, open body language, softly glowing light, and an inviting atmosphere" },
  { id: "cool", label: "Cool", prompt: "cool and composed, with a calm expression, controlled body language, clean directional light, and a modern restrained atmosphere" },
  { id: "elegant", label: "Elegant", prompt: "elegant and refined, with a poised expression, graceful posture, flattering controlled light, and a sophisticated atmosphere" },
  { id: "cinematic", label: "Cinematic", prompt: "cinematic and expressive, with focused emotion, dimensional body language, directional light, and a rich narrative atmosphere" },
  { id: "confident-allure", label: "Confident Allure", prompt: "confident and captivating, with graceful body language, calm eye contact, a self-assured expression, sophisticated glamour, and a tasteful editorial atmosphere" },
]

export const lightingByMood: Record<string, string> = {
  "soft-natural": "soft natural daylight with gentle facial shadows and realistic skin texture",
  candid: "realistic available light with natural shadows and an unstaged lifestyle appearance",
  warm: "warm late-afternoon light with soft highlights and gentle golden tones",
  cool: "soft cool directional light with clean shadows and balanced contrast",
  elegant: "controlled soft studio-style lighting with flattering facial definition",
  cinematic: "cinematic directional lighting with dimensional shadows and controlled highlight roll-off",
  "confident-allure": "soft directional light with elegant shadows, refined contrast, and a sophisticated editorial atmosphere",
}

export const ratioOptions: PortraitOption[] = [
  { id: "1:1", label: "1:1 — Profile / Square Post", prompt: "1:1" },
  { id: "4:5", label: "4:5 — Social Feed", prompt: "4:5" },
  { id: "9:16", label: "9:16 — Story / Reels", prompt: "9:16" },
  { id: "16:9", label: "16:9 — Landscape", prompt: "16:9" },
]

export const imageCountOptions: ImageCountOption[] = [
  {
    id: "1",
    label: "1 ภาพ",
    value: 1,
    prompt: "Create one polished travel portrait using the selected portrait format.",
    shotVariation: "",
  },
  {
    id: "2",
    label: "2 ภาพ",
    value: 2,
    prompt: "Create a cohesive set of 2 travel portraits using the selected portrait format:",
    shotVariation: "1. A composed portrait looking toward the camera.\n2. A more candid portrait using a different camera angle and natural body movement.\n\nKeep the same person, facial identity, wardrobe, destination, mood, lighting, and color treatment consistent.",
  },
  {
    id: "4",
    label: "4 ภาพ",
    value: 4,
    prompt: "Create a cohesive set of 4 travel portraits using the selected portrait format:",
    shotVariation: "1. Looking toward the camera with a natural expression.\n2. A candid three-quarter or side angle.\n3. Interacting naturally with the travel environment.\n4. A different composition showing more environmental depth.\n\nKeep the same person, facial identity, wardrobe, destination, mood, lighting, and color treatment consistent. Avoid duplicated poses, expressions, and camera angles.",
  },
]

export const cameraOptions: PortraitOption[] = [
  { id: "sony-a7iv-50", label: "Sony A7 IV + 50mm", prompt: "photographed with a Sony A7 IV and a 50mm lens, natural perspective, realistic depth of field, sharp eyes, and gentle background separation" },
  { id: "sony-a7iv-85", label: "Sony A7 IV + 85mm", prompt: "photographed with a Sony A7 IV and an 85mm portrait lens, flattering facial perspective, shallow depth of field, sharp eyes, and soft background compression" },
  { id: "fuji-gfx-80", label: "Fujifilm GFX 100S + 80mm", prompt: "photographed with a Fujifilm GFX 100S and an 80mm lens, medium-format detail, smooth tonal transitions, controlled perspective, and refined editorial depth" },
  { id: "fuji-xt5-35", label: "Fujifilm X-T5 + 35mm", prompt: "photographed with a Fujifilm X-T5 and a 35mm lens, natural lifestyle perspective, subtle depth of field, candid framing, and realistic environmental detail" },
  { id: "film-35-50", label: "35mm Film Camera + 50mm", prompt: "photographed with a classic 35mm film camera and a 50mm lens, organic texture, natural perspective, subtle softness, and authentic film character" },
]

export const filmOptions: PortraitOption[] = [
  { id: "clean-natural", label: "Clean Natural", prompt: "clean natural colors, realistic skin tones, balanced contrast, soft highlights, and minimal color grading" },
  { id: "portra", label: "Portra-inspired", prompt: "Portra-inspired film tones, natural warm skin tones, soft contrast, gentle highlights, and subtle fine film grain" },
  { id: "fuji-400h", label: "Fuji 400H-inspired", prompt: "Fuji 400H-inspired tones, soft pastel colors, airy highlights, gentle greens, natural skin tones, and subtle film grain" },
  { id: "classic-chrome", label: "Classic Chrome-inspired", prompt: "Classic Chrome-inspired colors, muted saturation, controlled contrast, soft highlights, and a refined documentary feel" },
  { id: "warm-vintage", label: "Warm Vintage", prompt: "warm vintage color treatment, soft contrast, faded highlights, gentle shadows, and subtle analog film texture" },
  { id: "black-white", label: "Black & White", prompt: "timeless black-and-white treatment, natural skin texture, controlled contrast, soft highlight roll-off, and subtle monochrome film grain" },
]

export const defaultPortraitSelection: PortraitSelection = {
  formatId: "three-quarter",
  outfitId: "minimal",
  locationId: "studio",
  moodId: "soft-natural",
  ratioId: "4:5",
  imageCountId: "1",
  cameraId: "sony-a7iv-50",
  filmId: "clean-natural",
}
