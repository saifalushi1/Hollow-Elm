# Hollow Elm

A browser horror investigation built with TypeScript, Vite and Three.js. Desktop is the target. No backend; save data stays in localStorage.

## Run

```sh
npm install
npm run dev
npm run build
npm test
```

If Windows blocks test process spawning, use `node --import tsx --test --test-isolation=none tests/*.test.ts` with the normal execution permission available to your terminal. Static output is `dist/`; serve it over HTTP/HTTPS. Pointer Lock requires a direct player gesture and is subject to browser/iframe permissions.

## Controls

WASD move; mouse look; Shift sneak; Space run; C/Ctrl crouch; E interact/hide; hold E to open a door quietly; F flashlight; Tab phone; Escape pause. The phone leaves the world running. WASD still moves the player slowly while the phone is open. Read room labels to navigate.

## Included

Prologue contact replies and a two-minute drive, three connected night chapters, hearing-based AI, LOS and waypoint routing, hiding risk, two candle lives, catch checkpoints with retained items, six inventory slots, locks, repair and code puzzles, noise traps, flashlight battery, all four phone apps, eight evidence cards, linked deductions, rescue, a timed woods escape, three final dialogue prompts and three endings, settings, subtitles, synthesized audio, and save/continue.

Story data: `src/story/script.json`. Core mechanics: `src/core/`. World kit: `src/world.ts`. Audio: `src/audio.ts`. Asset register: `public/assets/ASSETS.md`.

## Status

This is a playable first build, with placeholder environment and character art. See `VALIDATION.md` for verified mechanics and remaining requirements. The 45–55 minute playtime, 60 fps laptop target, realistic environment pass, baked lightmaps, KTX2 textures, and complete full-run acceptance have not been certified. Chapters can currently be completed faster than the target. No claim is made that the full final brief is complete.
