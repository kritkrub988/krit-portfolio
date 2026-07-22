export type StickerTheme = {
  id: string
  nameEnglish: string
  nameThai: string
  description: string
  prompt: string
  colors: [string, string, string]
  motif: "hearts" | "clouds" | "stars" | "candy" | "doodle" | "minimal" | "pop" | "kawaii" | "soft-3d"
}

export type StickerTextStyle = {
  id: string
  nameEnglish: string
  nameThai: string
  prompt: string
}

export type StickerPromptInput = {
  themeId: string
  textStyleId: string
  messages: string[]
}
