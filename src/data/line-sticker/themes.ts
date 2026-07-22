import type { StickerTheme } from "@/types/line-sticker"

export const stickerThemes: StickerTheme[] = [
  { id: "pastel-cute", nameEnglish: "Pastel Cute", nameThai: "พาสเทลน่ารัก", description: "ชมพู มิ้นต์ ฟ้า และครีม สีอ่อนสดใส", promptText: "ภาพการ์ตูนเส้นกลมนุ่ม โทนชมพู มิ้นต์ ฟ้า และครีมแบบพาสเทล สดใส เป็นมิตร", colors: ["#f9a8d4", "#86efac", "#93c5fd"], motif: "stars" },
  { id: "soft-pink", nameEnglish: "Soft Pink", nameThai: "ชมพูหวาน", description: "ชมพูอ่อน หัวใจ และบรรยากาศอบอุ่น", promptText: "ภาพการ์ตูนน่ารักโทนชมพูบลัชอ่อน มีรายละเอียดหัวใจเล็ก ๆ และบรรยากาศอบอุ่น", colors: ["#fbcfe8", "#f9a8d4", "#fff1f2"], motif: "hearts" },
  { id: "mint-fresh", nameEnglish: "Mint Fresh", nameThai: "มิ้นต์สดใส", description: "เขียวมิ้นต์ ขาว และฟ้าอ่อน", promptText: "ภาพการ์ตูนสะอาดสดชื่น ใช้เขียวมิ้นต์ ขาว และฟ้าอ่อน เส้นคมแต่ดูนุ่ม", colors: ["#a7f3d0", "#f8fafc", "#bae6fd"], motif: "clouds" },
  { id: "sky-blue", nameEnglish: "Sky Blue", nameThai: "ฟ้าใส", description: "ฟ้าอ่อน เมฆ ดาว และประกาย", promptText: "ภาพการ์ตูนโทนฟ้าใส มีเมฆนุ่ม ดาวเล็ก และประกายละเอียด", colors: ["#bae6fd", "#dbeafe", "#fef3c7"], motif: "clouds" },
  { id: "lemon-cream", nameEnglish: "Lemon Cream", nameThai: "เลมอนครีม", description: "เหลืองอ่อน ครีม และส้มพีช", promptText: "ภาพการ์ตูนโทนเหลืองเลมอนอ่อน ครีม และพีช ให้ความรู้สึกอบอุ่นสดใส", colors: ["#fef08a", "#fefce8", "#fed7aa"], motif: "candy" },
  { id: "lavender", nameEnglish: "Lavender", nameThai: "ลาเวนเดอร์", description: "ม่วงพาสเทล ชมพู และประกายดาว", promptText: "ภาพการ์ตูนโทนลาเวนเดอร์และชมพูอ่อน มีประกายดาวนุ่ม ๆ", colors: ["#c4b5fd", "#fbcfe8", "#fef3c7"], motif: "stars" },
  { id: "peach-candy", nameEnglish: "Peach Candy", nameThai: "พีชแคนดี้", description: "พีช คอรัล ชมพูอ่อน และครีม", promptText: "ภาพการ์ตูนหวานสดใสแบบลูกกวาด ใช้พีช คอรัล ชมพูอ่อน และครีม", colors: ["#fdba74", "#fda4af", "#ffedd5"], motif: "candy" },
  { id: "minimal-white", nameEnglish: "Minimal White", nameThai: "มินิมอลขาว", description: "เรียบ สะอาด ใช้สีแต่งเล็กน้อย", promptText: "ภาพการ์ตูนมินิมอล เส้นสะอาด รายละเอียดพอดี และใช้สีพาสเทลแต่งเพียงเล็กน้อย", colors: ["#f8fafc", "#e2e8f0", "#a7f3d0"], motif: "minimal" },
  { id: "colorful-pop", nameEnglish: "Colorful Pop", nameThai: "สีสันป๊อป", description: "สดใส สนุก เหมาะกับอารมณ์ตื่นเต้น", promptText: "ภาพการ์ตูนสีสันป๊อปสดใส สนุก มีคอนทราสต์ชัดแต่ยังดูเป็นชุดเดียวกัน", colors: ["#fb7185", "#38bdf8", "#facc15"], motif: "pop" },
  { id: "japanese-kawaii", nameEnglish: "Japanese Kawaii", nameThai: "คาวาอี้ญี่ปุ่น", description: "น่ารักแบบญี่ปุ่น เส้นนุ่มและสีอ่อน", promptText: "ภาพการ์ตูนคาวาอี้ญี่ปุ่น เส้นกลมนุ่ม สีอ่อน และรายละเอียดจิ๋วน่ารัก", colors: ["#f9a8d4", "#fde68a", "#bfdbfe"], motif: "kawaii" },
  { id: "hand-drawn-doodle", nameEnglish: "Hand-drawn Doodle", nameThai: "ลายเส้นวาดมือ", description: "เส้นดินสอ หัวใจ ดาว และ Doodle", promptText: "ภาพการ์ตูนลายเส้นวาดมืออบอุ่น มีหัวใจ ดาว และ doodle เล็กน้อย", colors: ["#fed7aa", "#fecdd3", "#d9f99d"], motif: "doodle" },
  { id: "soft-3d", nameEnglish: "Soft 3D", nameThai: "การ์ตูน 3D นุ่มนิ่ม", description: "ตัวละครมีมิติ แสงนุ่ม และรูปทรงกลม", promptText: "ภาพการ์ตูน 3D นุ่มนิ่ม รูปทรงกลม แสงสตูดิโอนุ่ม และผิวสัมผัสคล้ายของเล่น", colors: ["#d8b4fe", "#a7f3d0", "#fbcfe8"], motif: "soft-3d" },
]

export const defaultStickerThemeId = "pastel-cute"
