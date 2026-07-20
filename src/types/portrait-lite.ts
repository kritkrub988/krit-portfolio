export type PortraitOption = {
  id: string
  label: string
  prompt: string
}

export type PortraitModel = PortraitOption & {
  name: string
  image?: string
}

export type ImageCountOption = PortraitOption & {
  value: 1 | 2 | 4
  shotVariation: string
}

export type PortraitSelection = {
  modelId: string
  outfitId: string
  locationId: string
  moodId: string
  ratioId: string
  imageCountId: string
  cameraId: string
  filmId: string
}
