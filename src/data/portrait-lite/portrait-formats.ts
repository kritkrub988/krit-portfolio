import type { PortraitFormat } from "../../types/portrait-lite.ts"

export const portraitFormats: PortraitFormat[] = [
  {
    id: "headshot",
    label: "Headshot",
    description: "เน้นใบหน้าและช่วงไหล่",
    prompt:
      "a close head-and-shoulders travel portrait, with the face clearly visible, natural facial proportions, sharp eyes, and enough environmental detail to establish the destination",
  },
  {
    id: "half-body",
    label: "Half-body",
    description: "ตั้งแต่ศีรษะถึงช่วงเอว",
    prompt:
      "a half-body travel portrait framed from the head to around the waist, showing the subject’s expression, wardrobe, natural posture, and part of the surrounding destination",
  },
  {
    id: "three-quarter",
    label: "3/4 Portrait",
    description: "ตั้งแต่ศีรษะถึงเหนือเข่า",
    prompt:
      "a three-quarter travel portrait framed from the head to above the knees, balancing clear facial identity, natural body language, wardrobe details, and a recognizable travel environment",
  },
  {
    id: "full-body",
    label: "Full-body",
    description: "เห็นตัวแบบเต็มตัวและสถานที่",
    prompt:
      "a full-body environmental travel portrait showing the subject from head to toe, with natural body proportions, realistic posture, and enough surrounding scenery to clearly communicate the destination",
  },
]
