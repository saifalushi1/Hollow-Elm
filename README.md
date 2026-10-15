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

Prologue contact replies and a 10-second drive, three connected night chapters, hearing-based AI, LOS and waypoint routing, hiding risk, two candle lives, catch checkpoints with retained items, six inventory slots, locks, repair and code puzzles, noise traps, flashlight battery, all four phone apps, eight evidence cards, linked deductions, rescue, a timed woods escape, three final dialogue prompts and three endings, settings, subtitles, synthesized audio, and save/continue.

Story data: `src/story/script.json`. Core mechanics: `src/core/`. World kit: `src/world.ts`. Audio: `src/audio.ts`. Asset register: `public/assets/ASSETS.md`.

## Local play and sprint scares

Run `npm run dev` and open the printed localhost URL in your browser. No ChatGPT hosting or account is needed for local play.

Furniture has solid collision and Marrow routes around it. Press E at a wardrobe to enter; movement locks to its interior until you press E again to leave. A narrow slit limits your view. Sprinting lasts roughly 20 seconds from full stamina, with recovery while walking and faster recovery while standing. Breaking line of sight for about two seconds lets a chase become a search.

A compact tutorial appears on first house entry. Settings save immediately and again on Save & return; film grain can be disabled and stays off after reload. Original synthesized music plays quietly in the background. Marrow's face distorts as she approaches, and a catch shows a brief close-up before checkpoint recovery. Reduced flashing/shake mode uses a steady close-up without the lunge.

After the initial 30-second safety period, Marrow has a 22% chance every eight seconds to rush when she can see you from 3.5–14 metres away. Her synthesized shriek intensifies with proximity. She disappears 1.4 metres before contact and relocates to a clear, reachable position at least 10 metres away, then resumes investigating and can walk back through doors. Scares have a 75–120 second cooldown and a limit of four per saved game. They do not run during the woods finale or begin while you are hidden. Camera height stays steady during movement and scares.

## Status

This is a playable first build, with placeholder environment and character art. See `VALIDATION.md` for verified mechanics and remaining requirements. The 45–55 minute playtime, 60 fps laptop target, realistic environment pass, baked lightmaps, KTX2 textures, and complete full-run acceptance have not been certified. Chapters can currently be completed faster than the target. No claim is made that the full final brief is complete.
