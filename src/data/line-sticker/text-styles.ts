import type { StickerTextStyle } from "@/types/line-sticker"

const roundedThai = '"Leelawadee UI", Tahoma, sans-serif'
const handwrittenThai = '"Leelawadee UI", "Segoe Print", Tahoma, sans-serif'
const monoThai = '"Leelawadee UI", Consolas, Tahoma, monospace'

export const stickerTextStyles: StickerTextStyle[] = [
  { id: "bold-rounded", nameEnglish: "Bold Rounded", nameThai: "ตัวกลมหนา", fontFamily: roundedThai, fontWeight: 900, fill: "#f43f5e", stroke: "#ffffff", strokeWidth: 7, shadow: true, shadowColor: "#fda4af", letterSpacing: 0, rotation: 0 },
  { id: "sweet-handwriting", nameEnglish: "Sweet Handwriting", nameThai: "ลายมือหวาน", fontFamily: handwrittenThai, fontWeight: 700, fill: "#ec4899", stroke: "#ffffff", strokeWidth: 5, shadow: false, shadowColor: "#f9a8d4", letterSpacing: 1, rotation: -2 },
  { id: "jelly-text", nameEnglish: "Jelly Text", nameThai: "ตัวอักษรเจลลี่", fontFamily: roundedThai, fontWeight: 900, fill: "#a855f7", stroke: "#f3e8ff", strokeWidth: 7, shadow: true, shadowColor: "#c4b5fd", letterSpacing: 0, rotation: 0, gradient: ["#e879f9", "#8b5cf6"] },
  { id: "puffy-text", nameEnglish: "Puffy Text", nameThai: "ตัวอักษรพอง", fontFamily: roundedThai, fontWeight: 900, fill: "#fb7185", stroke: "#ffffff", strokeWidth: 9, shadow: true, shadowColor: "#fecdd3", letterSpacing: 1, rotation: 0 },
  { id: "sticker-outline", nameEnglish: "Sticker Outline", nameThai: "ขอบสติกเกอร์", fontFamily: roundedThai, fontWeight: 900, fill: "#1f2937", stroke: "#ffffff", strokeWidth: 11, shadow: false, shadowColor: "#94a3b8", letterSpacing: 0, rotation: 0 },
  { id: "shadow-pop", nameEnglish: "Shadow Pop", nameThai: "เงาป๊อป", fontFamily: roundedThai, fontWeight: 900, fill: "#059669", stroke: "#ffffff", strokeWidth: 5, shadow: true, shadowColor: "#f472b6", letterSpacing: 0, rotation: -1 },
  { id: "bubble-gum", nameEnglish: "Bubble Gum", nameThai: "บับเบิลกัม", fontFamily: roundedThai, fontWeight: 900, fill: "#f472b6", stroke: "#fdf2f8", strokeWidth: 7, shadow: true, shadowColor: "#f9a8d4", letterSpacing: 1, rotation: 0 },
  { id: "neon-glow", nameEnglish: "Neon Glow", nameThai: "เรืองแสง", fontFamily: roundedThai, fontWeight: 800, fill: "#7c3aed", stroke: "#ffffff", strokeWidth: 3, shadow: true, shadowColor: "#c4b5fd", letterSpacing: 1, rotation: 0 },
  { id: "comic-fun", nameEnglish: "Comic Fun", nameThai: "การ์ตูนสนุก", fontFamily: roundedThai, fontWeight: 900, fill: "#facc15", stroke: "#1f2937", strokeWidth: 5, shadow: true, shadowColor: "#fb7185", letterSpacing: 0, rotation: -3 },
  { id: "chalk-style", nameEnglish: "Chalk Style", nameThai: "ชอล์ก", fontFamily: handwrittenThai, fontWeight: 700, fill: "#ffffff", stroke: "#64748b", strokeWidth: 3, shadow: false, shadowColor: "#94a3b8", letterSpacing: 1, rotation: -1 },
  { id: "cute-brush", nameEnglish: "Cute Brush", nameThai: "พู่กันน่ารัก", fontFamily: handwrittenThai, fontWeight: 800, fill: "#e11d48", stroke: "#fff1f2", strokeWidth: 5, shadow: false, shadowColor: "#fda4af", letterSpacing: -1, rotation: -2 },
  { id: "pastel-stroke", nameEnglish: "Pastel Stroke", nameThai: "เส้นพาสเทล", fontFamily: roundedThai, fontWeight: 900, fill: "#ffffff", stroke: "#a78bfa", strokeWidth: 8, shadow: true, shadowColor: "#f9a8d4", letterSpacing: 0, rotation: 0 },
  { id: "kawaii-outline", nameEnglish: "Kawaii Outline", nameThai: "คาวาอี้ขอบหนา", fontFamily: roundedThai, fontWeight: 900, fill: "#f472b6", stroke: "#ffffff", strokeWidth: 10, shadow: false, shadowColor: "#fbcfe8", letterSpacing: 1, rotation: 0 },
  { id: "marker-pen", nameEnglish: "Marker Pen", nameThai: "ปากกาเมจิก", fontFamily: handwrittenThai, fontWeight: 800, fill: "#334155", stroke: "#ffffff", strokeWidth: 4, shadow: false, shadowColor: "#cbd5e1", letterSpacing: 0, rotation: 1 },
  { id: "thin-minimal", nameEnglish: "Thin Minimal", nameThai: "มินิมอลเส้นบาง", fontFamily: roundedThai, fontWeight: 500, fill: "#475569", stroke: "#ffffff", strokeWidth: 2, shadow: false, shadowColor: "#cbd5e1", letterSpacing: 3, rotation: 0 },
  { id: "gradient-fill", nameEnglish: "Gradient Fill", nameThai: "ไล่สี", fontFamily: roundedThai, fontWeight: 900, fill: "#ec4899", stroke: "#ffffff", strokeWidth: 7, shadow: true, shadowColor: "#c4b5fd", letterSpacing: 0, rotation: 0, gradient: ["#ec4899", "#0ea5e9"] },
  { id: "retro-pixel", nameEnglish: "Retro Pixel", nameThai: "พิกเซลย้อนยุค", fontFamily: monoThai, fontWeight: 900, fill: "#6d28d9", stroke: "#fde68a", strokeWidth: 4, shadow: true, shadowColor: "#fb7185", letterSpacing: 2, rotation: 0 },
  { id: "cloud-text", nameEnglish: "Cloud Text", nameThai: "ตัวอักษรก้อนเมฆ", fontFamily: roundedThai, fontWeight: 900, fill: "#ffffff", stroke: "#60a5fa", strokeWidth: 9, shadow: true, shadowColor: "#bfdbfe", letterSpacing: 1, rotation: 0 },
  { id: "sparkle-text", nameEnglish: "Sparkle Text", nameThai: "ประกายดาว", fontFamily: roundedThai, fontWeight: 900, fill: "#7c3aed", stroke: "#fef3c7", strokeWidth: 6, shadow: true, shadowColor: "#fde68a", letterSpacing: 1, rotation: -1 },
  { id: "cute-3d", nameEnglish: "Cute 3D", nameThai: "ตัวอักษร 3D", fontFamily: roundedThai, fontWeight: 900, fill: "#38bdf8", stroke: "#ffffff", strokeWidth: 6, shadow: true, shadowColor: "#0369a1", letterSpacing: 0, rotation: 0 },
  { id: "hand-drawn", nameEnglish: "Hand Drawn", nameThai: "วาดมือ", fontFamily: handwrittenThai, fontWeight: 600, fill: "#475569", stroke: "#ffffff", strokeWidth: 4, shadow: false, shadowColor: "#94a3b8", letterSpacing: 1, rotation: -1 },
  { id: "doodle-outline", nameEnglish: "Doodle Outline", nameThai: "เส้น Doodle", fontFamily: handwrittenThai, fontWeight: 800, fill: "#ffffff", stroke: "#f97316", strokeWidth: 6, shadow: false, shadowColor: "#fed7aa", letterSpacing: 1, rotation: 1 },
  { id: "soft-type", nameEnglish: "Soft Type", nameThai: "ตัวอักษรนุ่ม", fontFamily: roundedThai, fontWeight: 700, fill: "#0f766e", stroke: "#f0fdfa", strokeWidth: 5, shadow: true, shadowColor: "#99f6e4", letterSpacing: 1, rotation: 0 },
  { id: "candy-text", nameEnglish: "Candy Text", nameThai: "ลูกกวาด", fontFamily: roundedThai, fontWeight: 900, fill: "#fb7185", stroke: "#ffffff", strokeWidth: 7, shadow: true, shadowColor: "#facc15", letterSpacing: 1, rotation: -1, gradient: ["#fb7185", "#a855f7"] },
]

export const defaultStickerTextStyleId = "bold-rounded"

export function getStickerTextStyle(styleId: string) {
  const style = stickerTextStyles.find((item) => item.id === styleId)
  if (!style) throw new Error(`Unknown sticker text style: ${styleId}`)
  return style
}
