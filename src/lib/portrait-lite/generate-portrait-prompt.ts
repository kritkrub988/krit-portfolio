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

const negativeConstraints = `Avoid identity drift, a different face, a pasted-on face, mismatched head and body, an oversized or undersized head, an elongated neck, narrow or uneven shoulders, a shortened torso, stretched arms or legs, incorrect hip placement, distorted joints, floating feet, missing ground contact, incorrect foot perspective, weak or absent contact shadows, inconsistent cast shadows, mismatched lighting, mismatched sharpness, mismatched grain, incorrect environmental scale, artificial background separation, distorted anatomy, deformed hands, extra fingers, missing fingers, duplicated limbs, excessive facial beautification, plastic skin, text, logos, and watermarks.

Avoid low resolution, blurry facial features, out-of-focus eyes, muddy details, excessive softness, heavy noise, coarse grain, compression artifacts, pixelation, oversharpening, edge halos, excessive skin smoothing, waxy skin, artificial HDR, and loss of detail in highlights or shadows.`

const outputQualityBlock = `Render at the highest native resolution supported by the image generator, with high-resolution photographic detail and clean output suitable for social media and further upscaling.

Keep the eyes and facial features in precise focus. Preserve fine natural detail in the skin, eyelashes, eyebrows, individual hair strands, fabric texture, clothing seams, accessories, and environmental surfaces.

Use clean edge definition, controlled micro-contrast, smooth tonal transitions, accurate highlight detail, and detailed shadows without crushing or artificial sharpening.

Maintain realistic skin texture without excessive smoothing, waxy skin, halos, oversharpening, or an artificial HDR appearance.

Keep film grain subtle and fine so it does not reduce facial clarity or destroy important image detail.`

const headshotDetailInstruction =
  "For headshots, prioritize precise focus on the eyes, natural eyelashes, eyebrows, skin texture, lips, hairline, and individual hair strands while keeping the result photographic and naturally detailed."

const fullBodyDetailInstruction =
  "For full-body portraits, maintain clear and recognizable facial detail even when the subject occupies a smaller portion of the frame. Keep the eyes, facial structure, hair, hands, clothing, and footwear clearly resolved without making the face unnaturally sharp compared with the body and environment."

const physicalRealismBlock = `Physical realism and scene integration:

Render the subject as physically present in the location rather than composited onto the background. Maintain realistic human anatomy, a natural head-to-body ratio, correct shoulder width, proportional torso and limb lengths, and smooth anatomical transitions between the head, neck, shoulders, torso, arms, hips, and legs.

Match the subject’s scale, camera perspective, eye level, focal length, depth of field, lighting direction, color temperature, sharpness, and image grain to the surrounding environment.

Use believable posture and weight distribution. The body must respond naturally to gravity, with balanced hips, relaxed shoulders, naturally bent joints, and realistic muscle and fabric tension.

Create accurate contact and interaction with the environment, including firm foot placement, compressed footwear against the ground, natural contact shadows, correct cast shadows, realistic reflections, and proper overlap with nearby objects.

Avoid the appearance of a face pasted onto a different body, a floating subject, mismatched sharpness, inconsistent perspective, incorrect body scale, or artificial separation between the person and the background.`

const fullBodyRealism = `Show the complete body from head to toe without cropping the feet. Use a natural standing or walking posture with believable balance and weight distribution.

Both feet must make clear and physically correct contact with the ground. Preserve realistic leg length, knee position, ankle structure, foot size, shoe perspective, and spacing between the feet.

Use visible contact shadows directly beneath the shoes and cast shadows that match the direction, softness, and intensity of the environmental light.

Keep the camera at a realistic distance and approximately waist-to-chest height. Avoid extreme high or low angles, stretched legs, an oversized head, a shortened torso, or wide-angle body distortion.

Use a 50mm to 85mm equivalent lens from a realistic camera distance, with controlled perspective and minimal body distortion.`

const seatedIndoorRealism = `For seated poses, place the hips naturally on the chair with believable body weight and fabric compression. Keep the spine, shoulders, elbows, wrists, and hands anatomically connected and relaxed.

Ensure the arms rest naturally on the table, chair, or body with correct contact points, occlusion, and shadows. Match the chair height, table height, and subject scale realistically.`

function getOption<T extends PortraitOption>(options: T[], id: string, fieldName: string): T {
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
  const formatSpecificRealism = details.format.id === "full-body" ? fullBodyRealism : ""
  const formatSpecificDetail = details.format.id === "headshot"
    ? headshotDetailInstruction
    : details.format.id === "full-body"
      ? fullBodyDetailInstruction
      : ""
  const locationSpecificInteraction = ["cafe", "home", "bedroom"].includes(details.location.id)
    ? seatedIndoorRealism
    : ""

  return `${identityInstruction}

Image count:
${imageInstruction}

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

${physicalRealismBlock}

${formatSpecificRealism ? `Format-specific realism:\n${formatSpecificRealism}\n\n` : ""}${formatSpecificDetail ? `Portrait-format detail preservation:\n${formatSpecificDetail}\n\n` : ""}${locationSpecificInteraction ? `Location-specific interaction:\n${locationSpecificInteraction}\n\n` : ""}
Camera style:
${details.camera.prompt}

Color treatment:
${details.film.prompt}

Output quality:
${outputQualityBlock}

Aspect ratio:
${details.ratio.prompt}

Target output resolution:
${details.ratio.resolution} pixels or the highest supported ${details.ratio.prompt} resolution.

${identityConsistencyInstruction}

Negative prompt:
${negativeConstraints}`
}
