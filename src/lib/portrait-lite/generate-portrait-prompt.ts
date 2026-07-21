import { portraitFormats } from "../../data/portrait-lite/portrait-formats.ts"
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

const identityInstruction = `Use the attached reference photo as the primary identity source for the subject.

Create a realistic travel portrait featuring the same person shown in the reference image. Preserve the person’s original facial identity as closely as possible, including facial structure, face shape, eyes, eyebrows, nose, lips, jawline, skin tone, hairstyle, hairline, age appearance, and recognizable characteristics.

The generated person must remain clearly recognizable as the same individual from the reference photo. Do not replace the subject with a different person, create a look-alike, beautify the face excessively, change ethnicity, alter age, or redesign the facial features.`

const identityConsistencyInstruction =
  "Keep the facial identity consistent with the attached reference image in every generated image."

const negativeConstraints =
  "Avoid identity drift, a different face, altered facial proportions, excessive facial beautification, artificial skin, distorted anatomy, unnatural body proportions, deformed hands, extra fingers, missing fingers, duplicated body parts, incorrect perspective, inconsistent lighting, text, logos, and watermarks."

function getOption(options: PortraitOption[], id: string, fieldName: string) {
  const option = options.find((item) => item.id === id)
  if (!option) throw new Error(`Unknown portrait ${fieldName}: ${id}`)
  return option
}

export function getPortraitSelectionDetails(selection: PortraitSelection) {
  const format = portraitFormats.find((item) => item.id === selection.formatId)
  if (!format) throw new Error(`Unknown portrait format: ${selection.formatId}`)

  const mood = getOption(moodOptions, selection.moodId, "mood")
  const imageCount = imageCountOptions.find((item) => item.id === selection.imageCountId)
  if (!imageCount) throw new Error(`Unknown portrait image count: ${selection.imageCountId}`)

  return {
    format,
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
  const imageInstruction = [
    details.imageCount.prompt,
    details.imageCount.shotVariation,
  ].filter(Boolean).join("\n\n")

  return `${identityInstruction}

Portrait format:
${details.format.prompt}

Wardrobe:
${details.outfit.prompt}

Travel location:
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

${imageInstruction}

${identityConsistencyInstruction}

${negativeConstraints}`
}
