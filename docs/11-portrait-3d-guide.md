# 11 · Hero portrait — making it truly 3D

**Problem with a single PNG:** it can only slide or tilt, so it looks flat. A real "3D" feel needs the **head to turn** toward the cursor.

## ✅ READY-MADE: the 5 pose images are already prepared in `public-templates/images/portrait/` (transparent WebP, aligned on the shoulders, ~65 KB each). Copy that folder to `public/images/portrait/` — no image work needed.

## Option A (recommended): pose-blend — 5 images of the same avatar
Component: `snippets/HeroPortrait3D.tsx` (+ `snippets/usePortraitLook.ts`). Works with no extra libraries.

### Files to create (same canvas size for ALL, e.g. 1200×1500 px, transparent background, WebP or PNG ≤ 150 KB each)
```
public/images/portrait/center.webp  ← the avatar Henok already has (looking straight at the camera)
public/images/portrait/left.webp    ← head turned ~20° toward the viewer's LEFT
public/images/portrait/right.webp   ← head turned ~20° toward the viewer's RIGHT
public/images/portrait/up.webp      ← head tilted up ~12° (optional)
public/images/portrait/down.webp    ← head tilted down ~12° (optional)
```
Minimum = `center` + `left` + `right`. Missing files are skipped automatically.

### How to generate the poses (use the same AI image tool/chat that made the first avatar)
Attach the current avatar image and send one prompt per pose:
```text
Use the attached 3D cartoon character EXACTLY: same face, glasses, goatee, headphones, grey t-shirt,
same skin tone, same soft lighting, same camera distance, same framing and same body/shoulder position.
Change ONLY the head direction: turn his head about 20 degrees toward the viewer's LEFT and let his eyes
look the same way. Keep the shoulders and torso exactly where they are.
Plain flat light-grey background. Head-and-shoulders crop, same canvas size as the original.
```
Repeat with: `toward the viewer's RIGHT`, `tilted UP about 12 degrees, eyes looking up`, `tilted DOWN about 12 degrees, eyes looking down`.

### Clean-up checklist
- [ ] Remove the background from every image (remove.bg, Photopea, Photoshop) → transparent PNG
- [ ] All images the **same pixel size**, with the **shoulders in the same position** (open them stacked in Photopea at 50% opacity and nudge until the shoulders line up)
- [ ] Keep the head turns small (≤ 20°). Bigger turns look like ghosting when they cross-fade
- [ ] Export WebP/PNG, each ≤ 150 KB

### How it behaves
The centre pose is always shown. As the cursor moves left/right/up/down the matching pose fades in on top, so the head appears to turn; the whole figure also tilts slightly in 3D, the orange back-light moves the opposite way, and the shirt fades into the background at the bottom. Touch devices get a slow automatic sway. Reduced-motion = static centre pose.

## Option B (advanced, only if Henok approves new libraries): real 3D bust with Three.js
1. Make a 3D model from the avatar: upload the avatar image to an image-to-3D tool (e.g. Meshy, Tripo, Hunyuan3D) and export a **GLB** under ~3 MB.
2. `npm i three @react-three/fiber @react-three/drei` (allowed ONLY if Henok says yes — AGENTS.md rule 14).
3. Lazy-load the canvas (`React.lazy`), show Option A (or the centre PNG) while loading and on devices without WebGL.
4. Rotate the whole model toward the pointer: `group.rotation.y = x * 0.35; group.rotation.x = y * 0.2` smoothed in `useFrame`; add one orange rim light (`#FF4D1F`) behind it and a soft key light in front.
Note: image-to-3D results often have rough faces and textures; try Option A first.

## Do NOT
- Do not apply `.grain` or any vignette to the hero section (it creates a dotted oval ring).
- Do not leave the avatar small and floating: it must overlap the bottom third of the giant word and bleed off the bottom of the hero (see `pages/home.md` [5]).
