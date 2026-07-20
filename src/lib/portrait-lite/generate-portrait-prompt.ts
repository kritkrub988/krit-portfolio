import { portraitModels } from "../../data/portrait-lite/portrait-models.ts"
import {
  cameraOptions,
  filmOptions,
  imageCountOptions,
  lightingByMood,
  locationOptions,
  moodOptions,
  outfitOptions,
  ratioOptions,
} from "../../data/portrait-lite/portrait-options.ts"
import type { PortraitOption, PortraitSelection } from "../../types/portrait-lite.ts"

const negativePrompt =
  "Avoid changing the model’s facial identity, facial structure, hairstyle, age appearance, skin tone, or natural body proportions. Avoid duplicated poses, distorted anatomy, deformed hands, extra fingers, missing fingers, plastic skin, excessive retouching, exaggerated body features, overly revealing clothing, text, logos, watermarks, low resolution, artificial-looking backgrounds, and inconsistent lighting."

function getOption(options: PortraitOption[], id: string, fieldName: string) {
  const option = options.find((item) => item.id === id)
  if (!option) throw new Error(`Unknown portrait ${fieldName}: ${id}`)
  return option
}

export function getPortraitSelectionDetails(selection: PortraitSelection) {
  const model = portraitModels.find((item) => item.id === selection.modelId)
  if (!model) throw new Error(`Unknown portrait model: ${selection.modelId}`)

  const mood = getOption(moodOptions, selection.moodId, "mood")
  const imageCount = imageCountOptions.find((item) => item.id === selection.imageCountId)
  if (!imageCount) throw new Error(`Unknown portrait image count: ${selection.imageCountId}`)

  return {
    model,
    outfit: getOption(outfitOptions, selection.outfitId, "outfit"),
    location: getOption(locationOptions, selection.locationId, "location"),
    mood,
    ratio: getOption(ratioOptions, selection.ratioId, "ratio"),
    imageCount,
    camera: getOption(cameraOptions, selection.cameraId, "camera"),
    film: getOption(filmOptions, selection.filmId, "film filter"),
    lighting: lightingByMood[mood.id],
  }
}

export function generatePortraitPrompt(selection: PortraitSelection): string {
  const details = getPortraitSelectionDetails(selection)

  return `${details.imageCount.prompt}

Subject:
${details.model.prompt}

Wardrobe:
${details.outfit.prompt}

Location:
${details.location.prompt}

Mood:
${details.mood.prompt}

Lighting:
${details.lighting}

Camera style:
${details.camera.prompt}

Color treatment:
${details.film.prompt}

Aspect ratio:
${details.ratio.prompt}

${details.imageCount.shotVariation}

${negativePrompt}`
}
