export type PortraitOption = {
  id: string
  label: string
  prompt: string
}

export type PortraitRatioOption = PortraitOption & {
  resolution: string
}

export type PortraitFormat = {
  id: string
  label: string
  description: string
  prompt: string
}

export type ImageCountOption = PortraitOption & {
  value: 1 | 2 | 4
  shotVariation: string
}

export type PortraitSelection = {
  formatId: string
  outfitId: string
  locationId: string
  moodId: string
  ratioId: string
  imageCountId: string
  cameraId: string
  filmId: string
}
