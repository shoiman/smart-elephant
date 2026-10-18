# Smart Elephant — UI Redesign Prompt

> Paste everything below the line into Claude Code (or another coding agent) opened in the
> `smart-elephant` repository root.

---

## Role

You are a senior frontend engineer and product designer specialized in premium children's
apps (think Sago Mini, Toca Boca, Khan Academy Kids). You are redesigning the UI of
**Smart Elephant**, a speech and language development game for preschool children aged 2–5.

The current UI looks cheap and unprofessional: it is still largely the default Vite/React
template (purple `#aa3bff` accent, system fonts, dark-mode media query, a plain "Go" button,
inline styles, `window.prompt` for answers). Replace it with a cohesive, premium,
playful design system that matches our existing artwork.

## Read first (before writing any code)

1. `docs/Smart_Elephant_Art_Style_Guide_EN.txt` — the art direction. Follow it strictly.
2. `docs/Smart_Elephant_Vision_Update_Hebrew_Speech_Platform.txt` and
   `docs/Smart_Elephant_Project_Blueprint_2.2_Multilingual.txt` — product vision,
   learning flow (Look → Listen → Identify → Repeat → Build → Play), languages.
3. The whole `frontend/src` tree: pages, components, `services/` (API layer + hooks),
   `shared/i18n`, `data/animals/animals.ts`, `modules/animal-game/gameCopy.ts`.
4. Look at the actual image assets listed below (open them) so the UI matches their style.

## Existing characters and assets (reuse them — do not invent new characters)

Art style of all assets: high-quality 3D-animated-film look, soft rounded shapes, big
expressive eyes, warm cinematic lighting, vibrant but natural colors.

- **Host character — Eitan**, a boy with messy brown hair, yellow T-shirt, blue denim
  overalls, brown shoes. He is the child's friendly guide.
  - `frontend/src/assets/characters/boy_shows.png` — pointing (transparent PNG). Use when
    presenting a question / pointing at the animal.
  - `frontend/src/assets/characters/Eitan1_3_radie.png` — cheering with both fists up.
    Use for correct answers / rewards.
  - `frontend/src/assets/characters/Eitan1_1_na_kolinkax.png` — kneeling.
  - `frontend/src/assets/characters/Eitan1_2_pokasue_shlyach.png` — showing the way.
    Use for navigation / "let's go".
  - ⚠️ The three `Eitan1_*` files are RGB with a **white background** (no transparency)
    and ~1 MB each. Do not place them on colored backgrounds as-is. Either remove the
    background (produce transparent WebP/PNG versions), or present them inside a
    white/cream rounded "portrait" card. Tell me which approach you took.
- **Animals** — `frontend/src/assets/animals/*.png`: 48 transparent PNGs (elephant, lion,
  giraffe, hippo, zebra, leopard, cow, pig, sheep, chicken, foal, goat, crocodile, frog,
  duck, swan, heron, catfish, moose, hedgehog, squirrel, rabbit, wolf, boar, dolphin,
  shark, whale, crab, tuna, octopus, owl, parrot, raven, bird, butterfly, bee, …).
  These are the stars of every screen. The elephant is our mascot.
- **Habitat backgrounds** — `frontend/src/assets/animal-library/backgrounds/`:
  `farm_bg.jpg`, `forest_bg.jpg`, `river_lake_bg.jpg`, `savanna_bg.jpg`, `sea_bg.jpg`,
  `sky_bg.jpg`.
- **Meadow background** — `frontend/src/assets/backgrounds/meadow-desktop.png` /
  `meadow-mobile.png` (~1.5 MB each). This is the CURRENT main background, but it is
  **not mandatory** — see "Backgrounds" below.
- `frontend/src/assets/animal-library/animals/*.jpg` — the same animals on white
  backgrounds, grouped by habitat (`savanna_1_lion.jpg`, …). Prefer the transparent PNGs.
- Remove unused template leftovers (`react.svg`, `vite.svg`, `hero.png`) if nothing uses them.

## Design direction

- **Feel:** "entering a magical animated movie world", not "a website". UI elements
  (buttons, cards, bubbles, popups) should look like they belong to the artwork:
  soft, rounded, tactile, slightly glossy/3D, warm shadows — never flat gray web forms.
- **Palette:** derive it from the artwork — sky blue, meadow green, sunshine yellow
  (Eitan's shirt), denim blue (Eitan's overalls), warm cream/white for surfaces,
  soft coral for highlights. Define everything as CSS custom properties (design tokens).
  Force a light theme (remove `color-scheme: light dark` and the dark-mode block — kids'
  artwork is designed for light).
- **Typography:** one rounded, friendly display font + one readable body font, both
  supporting **Hebrew and Cyrillic** (e.g. "Rubik" or "Varela Round" — verify glyph
  coverage for he/ru/uk). Load via Google Fonts or self-host.
- **Kids-first UX (ages 2–5, most can't read):**
  - Touch targets at least 72×72 px; the main action on each screen is huge and obvious.
  - Every instruction is spoken (audio) and shown visually; text is secondary.
    Keep text short and large.
  - No small links, no dense menus, no scrolling during gameplay.
  - Positive feedback only: a wrong answer gets a gentle "try again" from Eitan
    (shake/wobble), never a red error screen.
  - Rewards: Eitan cheering + animated stars/confetti + a happy animal animation.
- **Backgrounds (open question — propose options):** the meadow is not a requirement.
  In the planning step, propose **3 distinct background concepts** for the Home screen
  and the general app shell, for example:
  - a "world map" with small islands for each habitat (reuses the habitat art),
  - a cozy illustrated place for Eitan and the elephant (e.g. a treehouse or playroom),
  - a light, mostly CSS-based sky scene (gradient + soft parallax clouds + ground),
    which is fast on phones and never distracts from the content.
  For each concept: a short description, pros/cons (look, load speed on mobile,
  distraction for a 2–5 year old), and whether it needs NEW artwork. If new artwork is
  needed, write a ready-to-use image-generation prompt that matches the existing style
  (3D animated-film look, soft rounded shapes, warm cinematic light, no characters baked
  into the background, empty center area for gameplay, 16:9 desktop and 9:16 mobile).
  Gameplay screens should use the habitat background of the current animal.
  I will choose before you implement. Do not delete the meadow files yourself.
- **Motion:** subtle idle animations (breathing/bobbing animals, Eitan's gentle sway),
  springy press states on buttons, smooth scene transitions. Respect
  `prefers-reduced-motion`. Prefer CSS animations; add a motion library (e.g.
  `motion`/framer-motion) only if it clearly pays off — justify it.
- **Layout:** works on phone portrait, tablet landscape (main target — parents hand a
  tablet to the child), and desktop. Gameplay must fit one screen without scrolling.
- **RTL:** Hebrew (`he`) is RTL. The i18n layer already exposes `direction` per language
  (`shared/i18n/types.ts`). Set `dir` on the app root and use CSS logical properties
  (`margin-inline-start`, `inset-inline-end`, …) so layouts mirror correctly. Characters
  and animals should NOT be mirrored.

## Screens to redesign

1. **Welcome / Home** (`HomePage`) — full-screen scene (background concept chosen by me), Smart Elephant logo
   (wordmark + the elephant), Eitan waving/inviting, one giant "Play" button
   (icon + short word). Language switcher as three friendly flag/label pills in a corner.
   A small, discreet "For parents" entry (lock icon) leading to Progress.
2. **Habitat / world selection** (`AnimalsPage` today) — large illustrated cards for
   habitats (savanna, farm, forest, river/lake, sea, sky) using the habitat backgrounds,
   each with 2–3 of its animals peeking out. Tap → enters that world.
3. **Game screen** (`GamesPage`) — habitat background (slightly blurred/dimmed so it
   doesn't distract), Eitan on one side with a speech bubble, the animal big in the
   center, progress as 5 friendly dots/stars at the top (replace the inline-styled
   "Question 1/5" div), a big "listen again" 🔊 button.
   - **Replace `window.prompt`** with a picture-choice answer: 2–3 big animal cards
     (correct animal + distractors from `data/animals/animals.ts`). Tapping a card
     submits the answer through the existing `useSubmitAnswer` hook. Leave a clear
     extension point (a component/prop) for future voice input (microphone button).
   - States: loading (animated elephant, not "Loading game..."), question, checking,
     correct (reward), try again, game complete (summary with stars, "Play again").
4. **Reward overlay** (`RewardStar`, `Popup`) — Eitan cheering, stars burst, animal
   happy animation, auto-advance after a short delay.
5. **Parents area / Progress** (`ProgressPage`) — this one is for adults: calm, clean,
   professional dashboard style but in the same palette and fonts. Stats cards, recent
   games, the "analyze progress" action. Readable, not childish.

Also refresh shared pieces: `Header` (minimal or hidden during gameplay),
`LanguageSwitcher`, `SpeechBubble`, `Button`, `Animal`, `Host`, `Background`,
`MainLayout`.

## Technical constraints (must follow)

- Stack stays: React 19 + TypeScript + Vite + React Router. No UI kit (MUI/Chakra/…);
  plain CSS (or CSS Modules) with design tokens. Keep the feature-first structure.
- **Do not change** the API layer contract (`services/*`, `api-types.ts`, endpoints) or
  the backend. Reuse the existing hooks (`useStartGame`, `useNextQuestion`,
  `useSubmitAnswer`, `useEndGame`, `useProgress`, …). If a hook must change, explain why.
- Keep all three languages (he/ru/uk) working. Every new user-facing string goes into
  `shared/i18n/translations.ts` (update the `TranslationMessages` interface and all three
  languages). No hard-coded English strings in the UI.
- TypeScript rules of this repo: `import type { … }` for type-only imports
  (`verbatimModuleSyntax`), no `enum` and no constructor parameter properties
  (`erasableSyntaxOnly`), no unused variables. Use `import.meta.env`, never `process.env`.
- Hooks: never pass inline lambdas into `useAsync`; wrap in `useCallback` with primitive
  dependencies (see the comment in `services/useApi.ts`) — it caused an infinite render
  loop before.
- No inline `style={{…}}` objects for layout — use classes.
- Accessibility: meaningful `alt` text (localized), `aria-label` on icon buttons,
  visible focus states, color contrast AA for any text.
- Performance: convert large PNG/JPG to WebP (keep originals), lazy-load habitat
  images, set image `width`/`height` to avoid layout shift.
- **All code comments in English.**
- `npm run build` in `frontend/` must pass (it runs `tsc -b` — strict). Also run
  `npm run lint`. The production build runs in Docker (`frontend/Dockerfile`), so the
  build must not depend on anything outside `frontend/`.

## How to work

1. **Plan first, no code yet.** Give me: the design tokens (colors, fonts, radii,
   shadows, spacing), the 3 background concepts, a short description/ASCII wireframe of each screen for phone and
   tablet, the component list, and the asset processing plan (background removal,
   WebP). Wait for my approval.
2. Then implement in small steps, one step per commit-sized chunk:
   1) design tokens + fonts + global styles + RTL root,
   2) shared components (Button, SpeechBubble, Host, Animal, LanguageSwitcher),
   3) Home, 4) Game screen + picture-choice answers + reward, 5) Habitat selection,
   6) Parents/Progress.
   After each step: run `npm run build`, tell me what changed and how to see it
   (`npm run dev` → which URL/route), and wait for my feedback.
3. Explain your design decisions briefly — I'm learning, so tell me *why*, not just *what*.
