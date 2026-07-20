import assert from "node:assert/strict"
import test from "node:test"

import {
  defaultPortraitSelection,
  moodOptions,
} from "../src/data/portrait-lite/portrait-options.ts"
import {
  createPortraitExportFilename,
  createPortraitExportText,
} from "../src/lib/portrait-lite/export-prompt.ts"
import {
  generatePortraitPrompt,
  getPortraitSelectionDetails,
} from "../src/lib/portrait-lite/generate-portrait-prompt.ts"

test("default Lite selection matches the product specification", () => {
  const details = getPortraitSelectionDetails(defaultPortraitSelection)
  assert.equal(details.model.name, "AKIRA")
  assert.equal(details.outfit.label, "Minimal")
  assert.equal(details.location.label, "Studio")
  assert.equal(details.mood.label, "Soft Natural")
  assert.equal(details.ratio.prompt, "4:5")
  assert.equal(details.imageCount.value, 1)
  assert.equal(details.camera.label, "Sony A7 IV + 50mm")
  assert.equal(details.film.label, "Clean Natural")
})

test("all four models and required Lite options produce an English prompt", () => {
  for (const modelId of ["akira", "haeun", "yuna", "mei"]) {
    const prompt = generatePortraitPrompt({
      ...defaultPortraitSelection,
      modelId,
      outfitId: "sleepwear",
      locationId: "bedroom",
    })
    assert.match(prompt, /adult woman aged 20 or older/)
    assert.match(prompt, /tasteful modern sleepwear/)
    assert.match(prompt, /clean modern bedroom/)
  }
})

test("image counts 1, 2, and 4 create distinct shot instructions", () => {
  const prompts = ["1", "2", "4"].map((imageCountId) =>
    generatePortraitPrompt({ ...defaultPortraitSelection, imageCountId }),
  )
  assert.match(prompts[0], /Create one polished portrait composition/)
  assert.match(prompts[1], /cohesive set of 2 portrait photographs/)
  assert.match(prompts[2], /cohesive set of 4 portrait photographs/)
  assert.equal(new Set(prompts).size, 3)
})

test("Confident Allure stays tasteful and controls automatic lighting", () => {
  const option = moodOptions.find((item) => item.id === "confident-allure")
  assert.ok(option)
  assert.doesNotMatch(option.prompt, /\b(sexy|seductive|provocative|erotic)\b/i)
  const prompt = generatePortraitPrompt({
    ...defaultPortraitSelection,
    moodId: "confident-allure",
  })
  assert.match(prompt, /sophisticated editorial atmosphere/)
  assert.match(prompt, /soft directional light with elegant shadows/)
})

test("TXT export uses filename-safe ratio and includes the selected summary", () => {
  const selection = {
    ...defaultPortraitSelection,
    modelId: "yuna",
    locationId: "bedroom",
    imageCountId: "4",
    filmId: "portra",
  }
  const prompt = generatePortraitPrompt(selection)
  const filename = createPortraitExportFilename(selection, new Date(2026, 6, 20, 10, 30, 0))
  assert.equal(filename, "AI_PORTRAIT_YUNA_4x5_20260720_103000.txt")
  const text = createPortraitExportText(selection, prompt)
  assert.match(text, /Model: YUNA/)
  assert.match(text, /Location: Bedroom/)
  assert.match(text, /Images: 4/)
  assert.match(text, /Film Filter: Portra-inspired/)
  assert.match(text, /PROMPT\n-{40}/)
})
