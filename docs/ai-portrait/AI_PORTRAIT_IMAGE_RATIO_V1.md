# AI Portrait Image Ratio V1

Image Ratio is a structured production decision in Shot Planning. Its stable step ID is `step-8-ratio`; existing Shot Coverage, Shot Cards, and Series Continuity IDs remain unchanged and use presentation-only numbering 8.2–8.4.

## Presets

| Ratio | Orientation | Primary use | Pixel reference |
|---|---|---|---|
| 9:16 | Portrait | Story, Reel Cover, mobile-first output | 1080x1920 |
| 16:9 | Landscape | Website hero, cinematic frame | 1920x1080 |
| 4:5 | Portrait | Instagram/Facebook feed | 1080x1350 |
| 5:4 | Landscape | Editorial, product + model | 1500x1200 |
| 2:3 | Portrait | Poster, full-body fashion | 1200x1800 |
| 3:2 | Landscape | Travel and environmental portrait | 1800x1200 |
| 1:1 | Square | Profile, social grid, product portrait | 1080x1080 |

Auto priority is Platform, Deliverables, Shot Coverage, Goal, Narrative/Composition, then the 4:5 fallback. Manual and Custom answers are never overwritten by Auto recalculation.

Custom ratios require positive integers. The system reduces them with the greatest common divisor before Prompt, Brief, and export use; for example, `1080:1920` resolves to `9:16`.

Multi-ratio packages require one Primary Ratio and at least one distinct Secondary Ratio. When orientations differ, the prompt requires composition-specific masters instead of destructive crop-only delivery.

Each Shot Card carries `aspect_ratio`, `orientation`, `pixel_reference`, `safe_zone`, `crop_strategy`, and `copy_space`. A per-shot override is marked `SHOT RATIO OVERRIDE`.

IndexedDB schema V3 adds an Auto ratio answer to legacy drafts without modifying immutable Prompt Versions. JSON export schema V3 includes structured `imageRatio` data. Filename tokens replace `:` with `x`, such as `4x5` and `9x16`.
