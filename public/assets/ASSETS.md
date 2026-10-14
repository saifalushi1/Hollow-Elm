# Hollow Elm asset register

All assets are bundled and require no external runtime requests. No assets, names, characters, or text were copied from the games mentioned in the brief.

| Asset | Source / creator | License | Use |
|---|---|---|---|
| `wood-albedo.jpg`, `wood-normal.jpg`, `wood-roughness.jpg` | Poly Haven, Wood Floor Deck, Dimitrios Savva — https://polyhaven.com/a/wood_floor_deck | CC0 1.0 — https://polyhaven.com/license | 1K PBR wood surfaces |
| `moonless-golf.hdr` | Poly Haven — https://polyhaven.com/a/moonless_golf | CC0 1.0 — https://polyhaven.com/license | 1K HDR environment, PMREM lighting |
| `mother-marrow-placeholder.glb` | Original generated kit, `scripts/make-assets.mjs` | Dedicated to CC0 1.0 for this deliverable | **Placeholder**, skeletal rig with idle, walk, search, chase, catch clips; EXT_meshopt_compression. Stylized block geometry, not a realistic final character. |
| `preserves-kit.glb` | Original generated kit, `scripts/make-assets.mjs` | CC0 1.0 | Meshopt-compressed desk and jars |
| Canvas plaster/brick textures, house geometry, furniture, trees, phone/HUD icons, grain | Original code in `src/world.ts` and `src/style.css` | CC0 1.0 | Procedural modular environment and UI. The house and most props remain procedural placeholders. |
| `font-1.ttf`–`font-3.ttf` | Cormorant Garamond via Google Fonts | SIL Open Font License 1.1; bundled `Cormorant-OFL.txt` | Serif title/UI |
| `font-4.ttf`–`font-7.ttf` | DM Sans via Google Fonts | SIL Open Font License 1.1; bundled `DM-Sans-OFL.txt` | Sans UI |
| All sounds | Original Web Audio synthesis in `src/audio.ts` | CC0 1.0 | No recorded audio files; synthesized oscillators, noise, reverb |
| Story, messages, evidence | Original text in `src/story/script.json` based on supplied brief | Original commissioned content | Investigation and dialogue |

Third-party code: Three.js (MIT), Vite (MIT), TypeScript (Apache 2.0), meshoptimizer (MIT), glTF Transform (MIT), tsx (MIT). See installed package license files and lockfile for exact dependency versions.

Limitations: textures use bundled JPG rather than KTX2. Lightmaps are not baked. Fog is exponential rather than a true volumetric pass. The current build does not meet the brief's final realistic asset quality requirement; the placeholder rig is explicitly permitted by the brief. Asset compression is applied to GLB geometry and animation.
