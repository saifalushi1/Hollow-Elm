# Validation and known limits

## Verified

- TypeScript strict type checking.
- Acceptance tests cover movement noise values, hearing range, escaping a chase into search, hiding risk escalation, lives and item retention, phone ring/vibration ranges, Night 1/2 dependency gates, shelf-code deduction, all three ending rules, and story evidence integrity.
- Browser title, settings, prologue contacts and replies, save/continue, and drive transition inspected in the Codex browser.
- A loaded WebGL scene renders, HDR and PBR assets load locally, the GLB character and prop kit use meshopt compression.

## Remaining acceptance work

- Full 45–55 minute measured playthrough, repeated catch runs under 60 minutes, and all three endings through an actual first-person playthrough are not yet verified. Current exploration is more compact than the requested final campaign.
- A measured 60 fps result on a specified mid-range laptop is not available. Presets change resolution, shadows, bloom and SSAO (High). Medium favors performance and disables SSAO.
- The connected 3×3 modular room kit has nine hiding spots and multiple loops per floor. The complete final detailed farmhouse, exterior barn/shed, realistic glTF environment, realistic character art, physically rearranged furniture, and proper occlusion culling still need an art/gameplay pass.
- Room partitions and furniture have collision. World routing uses a furniture-aware navigation grid with exact segment collision checks; Marrow opens doors along her route. Stair/exit transitions rebuild the next floor.
- Story and hints are JSON. A field reminder appears after three minutes without puzzle progress; the in-world hints are displayed with evidence and chapter notes. Timings need playtest tuning.
- No baked lightmaps or KTX2 texture pipeline. Fog and CSS grain/vignette approximate the requested atmosphere. Random sprint-and-vanish scares are capped at four per game, with no flashing or camera bob. There are no graphic injuries.
- Assist Mode currently slows Marrow and extends starting safety, rather than adding extra checkpoint locations.
- Catches return to the same night checkpoint and retain items. Night reset counters do not yet distinguish consecutive failed nights from successful chapters.

This document intentionally separates implemented mechanics from final production acceptance.
