# AI Portrait Production Workflow V5.1

Display order is Model Selection, Project Setup, Creative Direction, Look Recipe, Set / Location / Atmosphere, Styling, Lighting, Color, Shot Planning, Final Brief, and Prompt Package. Existing phase, step, and option IDs remain stable; display order is independent from those IDs.

Every production step supports `auto`, `manual`, or `custom` where custom input is allowed. Auto answers contain the resolved option IDs, reason, confidence, and timestamp. Manual and Custom answers are never overwritten by recalculation. Upstream changes only re-resolve Auto answers.

Model Auto rules prioritize safety, model restrictions, goal, platform, deliverables, recipe compatibility, technical compatibility, then a deterministic default. Before enough signals exist, YUNA is the provisional model. School/youth signals prefer AKARI or YUNA; Korean campus prefers HAEUN; Beauty/Lookbook prefers MEI; luxury/high-fashion/cinematic/jewelry prefers RIN; branding/corporate/wellness prefers HANA. Adult or sensual signals can never resolve to a minor.

Approval steps never Auto-approve. Before brief approval, every Auto answer must have a resolved value and all safety checks must pass. Approval freezes an immutable Prompt Version snapshot. Editing a production decision after approval returns the active project to Draft while retaining historical versions.
