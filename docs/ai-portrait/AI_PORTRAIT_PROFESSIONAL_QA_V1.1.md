# AI Portrait Professional QA V1.1

Required release checks:

1. Model Selection is first and shows Auto plus six fictional models with nationality and MINOR/ADULT status.
2. Auto resolves deterministically and exposes value, reason, confidence, and decision details.
3. Switching an Auto answer to Manual preserves the suggested value; later recalculation does not overwrite it.
4. Approval controls require an explicit user action and never default to approved.
5. Brief, live prompt, prompt snapshot, and exports use effective resolved values.
6. IndexedDB upgrades from V1 to V2 without deleting projects or immutable prompt versions. Populated V1 answers migrate to Manual; empty V1 answers migrate to Auto. Decision logs use their own store.
7. JSON import and version restore reject critical safety violations.
8. Critical blocks cover minor sexualization, age-up bypass, inappropriate HAEUN age-down, body exaggeration/extreme thinness, and artificial whitening.
9. Desktop, tablet, mobile, keyboard navigation, autosave, version history, export, migration, lint, typecheck, tests, build, browser console, preview, and production URL are verified before release.

Auto decision logs are operational metadata and are excluded from exports by default. They may only be included by an explicit future export option.
