import assert from "node:assert/strict"
import test from "node:test"

import { portraitFormats } from "../src/data/portrait-lite/portrait-formats.ts"
import {
  defaultPortraitSelection,
  imageCountOptions,
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

const identityOpening =
  "Use the attached reference photo as the primary identity source for the subject."

test("default travel selection uses 3/4 Portrait and preserves all existing defaults", () => {
  const details = getPortraitSelectionDetails(defaultPortraitSelection)
  assert.equal(details.format.label, "3/4 Portrait")
  assert.equal(details.outfit.label, "Minimal")
  assert.equal(details.location.label, "Studio")
  assert.equal(details.mood.label, "Soft Natural")
  assert.equal(details.ratio.prompt, "4:5")
  assert.equal(details.imageCount.value, 1)
  assert.equal(details.camera.label, "Sony A7 IV + 50mm")
  assert.equal(details.film.label, "Clean Natural")
})

test("all four portrait formats are configured and generate distinct prompt text", () => {
  assert.deepEqual(
    portraitFormats.map(({ id, label }) => ({ id, label })),
    [
      { id: "headshot", label: "Headshot" },
      { id: "half-body", label: "Half-body" },
      { id: "three-quarter", label: "3/4 Portrait" },
      { id: "full-body", label: "Full-body" },
    ],
  )

  const prompts = portraitFormats.map((format) =>
    generatePortraitPrompt({ ...defaultPortraitSelection, formatId: format.id }),
  )
  assert.equal(new Set(prompts).size, 4)
  portraitFormats.forEach((format, index) => assert.match(prompts[index], new RegExp(format.prompt)))
})

test("every prompt starts with reference identity lock and rejects replacement faces", () => {
  const prompt = generatePortraitPrompt(defaultPortraitSelection)
  assert.ok(prompt.startsWith(identityOpening))
  assert.match(prompt, /same person shown in the reference image/)
  assert.match(prompt, /remain clearly recognizable as the same individual/)
  assert.match(prompt, /Do not replace the subject with a different person, create a look-alike/)
  assert.match(prompt, /Keep the facial identity consistent with the attached reference image/)
  assert.match(prompt, /Avoid identity drift, a different face/)
})

test("generated prompt follows the required travel section order", () => {
  const prompt = generatePortraitPrompt(defaultPortraitSelection)
  const sections = [
    "Portrait format:",
    "Wardrobe:",
    "Travel location:",
    "Mood:",
    "Lighting:",
    "Camera style:",
    "Color treatment:",
    "Aspect ratio:",
    "Create one polished travel portrait using the selected portrait format.",
  ]
  let previousIndex = -1
  for (const section of sections) {
    const index = prompt.indexOf(section)
    assert.ok(index > previousIndex, `${section} must appear in the required order`)
    previousIndex = index
  }
})

test("image counts 1, 2, and 4 respect the selected portrait format", () => {
  const instructions = imageCountOptions.map((option) =>
    [option.prompt, option.shotVariation].filter(Boolean).join("\n\n"),
  )
  assert.match(instructions[0], /one polished travel portrait using the selected portrait format/)
  assert.match(instructions[1], /cohesive set of 2 travel portraits using the selected portrait format/)
  assert.match(instructions[2], /cohesive set of 4 travel portraits using the selected portrait format/)
  for (const instruction of instructions) {
    assert.doesNotMatch(instruction, /close portrait|full-body portrait/i)
  }
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

test("TXT export uses format and location tokens with travel instructions", () => {
  const selection = {
    ...defaultPortraitSelection,
    locationId: "beach",
    imageCountId: "4",
    filmId: "portra",
  }
  const prompt = generatePortraitPrompt(selection)
  const filename = createPortraitExportFilename(selection, new Date(2026, 6, 21, 13, 20, 0))
  assert.equal(filename, "AI_TRAVEL_PORTRAIT_3_QUARTER_BEACH_20260721_132000.txt")
  const text = createPortraitExportText(selection, prompt)
  assert.match(text, /^AI Portrait Prompt — เที่ยวทิพย์/)
  assert.match(text, /Portrait Format: 3\/4 Portrait/)
  assert.doesNotMatch(text, /^Model:/m)
  assert.match(text, /Location: Beach/)
  assert.match(text, /Images: 4/)
  assert.match(text, /Film Filter: Portra-inspired/)
  assert.match(text, /วิธีใช้:\nแนบรูปใบหน้าของคุณพร้อม Prompt/)
  assert.match(text, /PROMPT\n-{40}/)
})
