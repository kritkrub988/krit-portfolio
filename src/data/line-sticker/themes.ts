import type { StickerVisualStyle } from "@/types/line-sticker"

export const stickerVisualStyles: StickerVisualStyle[] = [
  { id: "pastel-cute", nameEnglish: "Pastel Cute", nameThai: "พาสเทลน่ารัก", description: "ชมพู มิ้นต์ ฟ้า และครีม สีอ่อนสดใส", promptText: "cute pastel cartoon sticker, soft pink, mint, sky blue and cream color palette, clean rounded line art, soft natural shading, cheerful and friendly appearance", colors: ["#f9a8d4", "#86efac", "#93c5fd"], motif: "stars" },
  { id: "soft-pink", nameEnglish: "Soft Pink", nameThai: "ชมพูหวาน", description: "ชมพูอ่อน หัวใจ และบรรยากาศอบอุ่น", promptText: "sweet soft-pink cartoon sticker, blush pink and cream colors, gentle heart details, smooth rounded shapes, warm lighting and soft shading", colors: ["#fbcfe8", "#f9a8d4", "#fff1f2"], motif: "hearts" },
  { id: "mint-fresh", nameEnglish: "Mint Fresh", nameThai: "มิ้นต์สดใส", description: "เขียวมิ้นต์ ขาว และฟ้าอ่อน", promptText: "fresh mint cartoon sticker, mint green, white and light aqua colors, clean line art, bright friendly mood and soft lightweight shading", colors: ["#a7f3d0", "#f8fafc", "#bae6fd"], motif: "clouds" },
  { id: "sky-blue", nameEnglish: "Sky Blue", nameThai: "ฟ้าใส", description: "ฟ้าอ่อน เมฆ ดาว และประกาย", promptText: "soft sky-blue cartoon sticker, light blue and white palette, small cloud and sparkle details, clean outlines and bright airy appearance", colors: ["#bae6fd", "#dbeafe", "#fef3c7"], motif: "clouds" },
  { id: "lemon-cream", nameEnglish: "Lemon Cream", nameThai: "เลมอนครีม", description: "เหลืองอ่อน ครีม และส้มพีช", promptText: "lemon-cream cartoon sticker, pale yellow, cream and soft peach colors, warm cheerful mood, rounded shapes and gentle shading", colors: ["#fef08a", "#fefce8", "#fed7aa"], motif: "candy" },
  { id: "lavender", nameEnglish: "Lavender", nameThai: "ลาเวนเดอร์", description: "ม่วงพาสเทล ชมพู และประกายดาว", promptText: "lavender pastel cartoon sticker, soft purple, pink and cream palette, dreamy sparkles, smooth clean lines and gentle soft lighting", colors: ["#c4b5fd", "#fbcfe8", "#fef3c7"], motif: "stars" },
  { id: "peach-candy", nameEnglish: "Peach Candy", nameThai: "พีชแคนดี้", description: "พีช คอรัล ชมพูอ่อน และครีม", promptText: "peach-candy cartoon sticker, peach, coral, soft pink and cream colors, cute rounded forms, sweet playful mood and polished shading", colors: ["#fdba74", "#fda4af", "#ffedd5"], motif: "candy" },
  { id: "minimal-white", nameEnglish: "Minimal White", nameThai: "มินิมอลขาว", description: "เรียบ สะอาด ใช้สีแต่งเล็กน้อย", promptText: "minimal clean cartoon sticker, mostly white and neutral colors with small pastel accents, simple line art, light shadows and uncluttered design", colors: ["#f8fafc", "#e2e8f0", "#a7f3d0"], motif: "minimal" },
  { id: "colorful-pop", nameEnglish: "Colorful Pop", nameThai: "สีสันป๊อป", description: "สดใส สนุก เหมาะกับอารมณ์ตื่นเต้น", promptText: "colorful pop cartoon sticker, bright playful colors, bold clean outlines, lively expressions, energetic decorative accents and strong visual contrast", colors: ["#fb7185", "#38bdf8", "#facc15"], motif: "pop" },
  { id: "japanese-kawaii", nameEnglish: "Japanese Kawaii", nameThai: "คาวาอี้ญี่ปุ่น", description: "น่ารักแบบญี่ปุ่น เส้นนุ่มและสีอ่อน", promptText: "Japanese kawaii cartoon sticker, soft pastel palette, cute rounded proportions, clean expressive line art, tiny sparkles and charming playful details", colors: ["#f9a8d4", "#fde68a", "#bfdbfe"], motif: "kawaii" },
  { id: "hand-drawn-doodle", nameEnglish: "Hand-drawn Doodle", nameThai: "ลายเส้นวาดมือ", description: "เส้นดินสอ หัวใจ ดาว และ Doodle", promptText: "cute hand-drawn doodle sticker, slightly imperfect pencil-like outlines, small hearts, stars and playful marks, soft pastel coloring and handmade feeling", colors: ["#fed7aa", "#fecdd3", "#d9f99d"], motif: "doodle" },
  { id: "soft-3d", nameEnglish: "Soft 3D", nameThai: "การ์ตูน 3D นุ่มนิ่ม", description: "ตัวละครมีมิติ แสงนุ่ม และรูปทรงกลม", promptText: "soft 3D cartoon sticker, rounded dimensional shapes, smooth materials, gentle studio lighting, soft shadows and polished cute character rendering", colors: ["#d8b4fe", "#a7f3d0", "#fbcfe8"], motif: "soft-3d" },
]

export const defaultStickerVisualStyleId = "pastel-cute"

export function getStickerVisualStyle(visualStyleId: string) {
  const visualStyle = stickerVisualStyles.find((item) => item.id === visualStyleId)
  if (!visualStyle) throw new Error(`Unknown sticker visual style: ${visualStyleId}`)
  return visualStyle
}
