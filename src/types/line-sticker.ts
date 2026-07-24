export type StickerVisualStyle = {
  id: string
  nameEnglish: string
  nameThai: string
  description: string
  promptText: string
  colors: [string, string, string]
  motif: "hearts" | "clouds" | "stars" | "candy" | "doodle" | "minimal" | "pop" | "kawaii" | "soft-3d"
}

export type StickerPackMode = "single" | "animal" | "pair"

export type StickerPackItem = {
  id: number
  text: string
  action: string
}

export type StickerPack = {
  id: string
  name: string
  description: string
  characterMode: StickerPackMode
  icon?: string
  previewTexts: string[]
  items: StickerPackItem[]
}

export type StickerTextStyle = {
  id: string
  nameEnglish: string
  nameThai: string
  fontKey: StickerFontKey
  fontWeight: number
  fill: string
  stroke: string
  strokeWidth: number
  shadowColor: string
  shadowBlur: number
  shadowOffsetX: number
  shadowOffsetY: number
  letterSpacing: number
  rotation: number
  gradient?: [string, string]
  previewClass: string
}

export type StickerFontKey =
  | "kodchasan"
  | "mali"
  | "mitr"
  | "itim"
  | "sriracha"
  | "chakra-petch"
  | "pattaya"

export type StudioStep = 1 | 2 | 3 | 4 | 5

export type RgbColor = {
  r: number
  g: number
  b: number
}

export type CropSettings = {
  marginLeft: number
  marginRight: number
  marginTop: number
  marginBottom: number
  gapX: number
  gapY: number
}

export type CropRect = {
  index: number
  row: number
  column: number
  filename: string
  x: number
  y: number
  width: number
  height: number
}

export type BrowserImageAsset = {
  id: string
  filename: string
  blob: Blob
  url: string
  width: number
  height: number
}

export type SourceGridImage = BrowserImageAsset & {
  fileType: string
  fileSize: number
}

export type BackgroundRemovalSettings = {
  color: RgbColor
  tolerance: number
  edgeConnected: boolean
  feather: number
}

export type StickerTextSettings = {
  message: string
  styleId: string
  fillColor: string
  strokeColor: string
  strokeWidth: number
  fontSize: number
  letterSpacing: number
  shadowEnabled: boolean
  shadowColor: string
  x: number
  y: number
  rotation: number
}

export type TextBounds = {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

export type StickerValidationResult = {
  stickerId: string
  filename: string
  hasTransparency: boolean
  textOverflow: boolean
  textNearEdge: boolean
}

export type ExportValidationItem = StickerValidationResult & {
  isPng: boolean
  isEmpty: boolean
}

export type ExportValidationSummary = {
  valid: boolean
  errors: string[]
  warnings: string[]
  warningFiles: string[]
}
