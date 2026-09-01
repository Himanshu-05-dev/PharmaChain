# PharmaChain – "Medicine Journey / Authenticity" Screen
### UI + Motion Spec (reverse-engineered from reference video — Tata 1mg "Track the journey of your medicine")

---

## 0. Read this first — GSAP/ScrollTrigger vs React Native

The reference is a **mobile web page** (`1mg.com`). Its scroll effects (pinning, scrub-linked crossfades, a progress bar tied to scroll position) are built with **GSAP + ScrollTrigger**, which depend on the DOM/CSS — **they do not run in native React Native** (no DOM, no CSS scroll events).

You have two honest options. Pick one per-screen, don't mix silently:

| | **Option A — Native RN (recommended)** | **Option B — WebView** |
|---|---|---|
| Stack | `react-native-reanimated` v3 + `react-native-gesture-handler` (or `ScrollView`'s native `onScroll`) + `react-native-svg` / `lottie-react-native` | Real HTML/CSS page using actual GSAP + ScrollTrigger, loaded via `react-native-webview` |
| Feel | Native scroll physics, 60fps on UI thread, matches rest of the app | Pixel-identical to the reference, but is a web page inside your app (slower load, no native gestures, harder to theme dynamically) |
| When to use | This screen is part of the normal app flow / users navigate in and out often | This is a rarely-visited, marketing-style "trust" page and dev speed matters more than native feel |
| Effort | Medium — needs Reanimated interpolation work (section 4) | Low — port the GSAP code almost as-is (section 4.5) |

**Recommendation for PharmaChain:** build it native with Reanimated (Option A). It's a core trust/verification screen users will revisit per order, so it should feel native. Section 4 gives both implementations; the team picks one.

---

## 1. Screen overview

One scrollable screen with **6 sections**, stacked vertically, plus **1 sticky floating CTA**:

1. Hero "Certificate of Authenticity" card (vertical timeline)
2. Pinned scrollytelling module — "Track the journey of your medicine" (illustration + horizontal card carousel + progress bar, all scroll-scrubbed)
3. Brand strip header ("Tata 1mg · Sawaal Uthao" + share icon)
4. 2×2 trust grid — "How does [Brand] ensure your safety?"
5. Embedded video teaser — "Check out the journey of your medicines"
6. Dark "real stories" horizontal card carousel
7. **Sticky CTA pill** — "Scan more medicines" (floats above sections 4–6, always reachable)

---

## 2. Design tokens

Sampled from the reference; treat as a starting palette, adjust to PharmaChain's brand:

```
colors:
  brand-accent:        #FF5342   # CTA pill, progress bar fill, section-6 headline accent
  badge-red:            #F9584B   # "GENUINE" stamp
  trust-green-bg:       #DFF9E8   # pill background behind eyebrow labels (Source/Storage/…)
  trust-green-text:     #2E6B4C   # eyebrow label text
  card-neutral-bg:      #F5F5F5   # 2x2 grid card background
  hero-card-bg:         #FFFFFF
  hero-page-gradient:   linear-gradient(180deg, #FBD9DC 0%, #FFFFFF 45%)
  scrollytelling-bg:    linear-gradient(180deg, #FFFFFF 0%, #FFE1E4 60%)
  progress-track:       #F3D9DB
  progress-fill:        #FF5342
  stories-bg:           #2A0E1E   # near-black maroon, section 6
  text-primary:         #17181A
  text-secondary:       #5B5F63

spacing:
  screen-padding-h: 16
  card-radius: 16
  card-padding: 16
  section-gap-vertical: 32

typography:
  heading-lg:  { size: 24, weight: 700, lineHeight: 30 }   # "Track the journey of your medicine"
  card-title:  { size: 15, weight: 700 }
  body:        { size: 13-14, weight: 400, color: text-secondary }
  eyebrow-pill:{ size: 11, weight: 600, letterSpacing: 0.2 }
```

---

## 3. Section-by-section breakdown

### 3.1 Hero — Certificate of Authenticity card

**Layout (top → bottom):**
- Full-bleed header illustration: soft dotted-pattern pink background, a "GENUINE" circular red stamp/badge overlapping a tilted "product tag" illustration.
- White rounded card (radius 16, elevated) overlapping the header, containing a **vertical stepper/timeline**:
  - Each row = `[icon in colored circle] — [dotted vertical connector] — [eyebrow pill label] + [bold detail text]`
  - 5 rows: **Source, Storage, Pharmacist Verification, Dispatch, Transit**
  - Icons: bottle, snowflake/thermometer, verified-checklist, storefront/warehouse, delivery-box — all single-color (green) line icons
- Outlined pill button, full-width: **"⊞ Scan more medicines"** (icon = QR/scan glyph, red-orange text/border, transparent fill)
- Small chevron-down affordance centered below the card, hinting "keep scrolling"

**Data shape:**
```json
{
  "certificate": {
    "badge": "GENUINE",
    "steps": [
      { "icon": "bottle", "label": "Source", "detail": "Directly sourced from **{supplierName}**" },
      { "icon": "thermometer", "label": "Storage", "detail": "Maintained at a temperature of **{tempRange}**" },
      { "icon": "verified", "label": "Pharmacist Verification", "detail": "Verified by your pharmacist: dose, strength, expiry (**{expiryDate}**) for batch (**{batchId}**)" },
      { "icon": "warehouse", "label": "Dispatch", "detail": "From **{warehouseName}** on **{dispatchDate}**" },
      { "icon": "package", "label": "Transit", "detail": "Order shipped in safe & eco-friendly package" }
    ]
  }
}
```

**RN component:** `<CertificateCard steps={...} />` — a plain `View`/`ScrollView`-free static layout, no scroll-linked animation needed here beyond a simple mount fade/slide-in.

---

### 3.2 The pinned scrollytelling module ⭐ (the hard part)

This is the centerpiece and the part actually built with ScrollTrigger on web. Behavior observed frame-by-frame:

1. Heading **"Track the journey of your medicine"** scrolls up and then **pins** (sticks) near the top of the viewport.
2. Below the pinned heading, an **illustration stage** is also pinned. As the user keeps scrolling (vertically), the illustration **crossfades through 5 states**, synced 1:1 with scroll progress:
   - State 1 — boxes moving along a conveyor belt (Sourcing)
   - State 2 — a single box with a QR code, a hand-held scanner reading it (Verified by Pharmacist) — *note: on web, "Storage" doesn't get its own illustration; it reuses the boxed-product art while its card is active. Give it a distinct one in your version if you have the asset.*
   - State 3 — a delivery rider on a scooter riding across a city-skyline backdrop (Secure Dispatch)
   - State 4 — a translucent insulated pouch/bag containing the package, on the scooter (Safe Transit)
3. Below the illustration, a **horizontal-scrolling card carousel** runs in lockstep — as you scroll down (vertically), the cards translate horizontally, one full card = one scroll "chapter". Cards: **Sourcing → Stored at 25–30°C → Verified by Pharmacist → Secure Dispatch → Safe Transit**, each with a title + one-line description.
4. A **thin horizontal progress bar** directly above the cards fills from 0% → 100% in sync with the same scroll range, one visual confirmation of "how far through the story you are."
5. Once the last card/illustration is reached, normal vertical scrolling resumes and the section un-pins.

This is the classic **"pin + horizontal scroll driven by vertical scroll, scrubbed"** pattern.

**Data shape:**
```json
{
  "journey": [
    { "id": "sourcing",  "illustration": "conveyor",  "title": "Sourcing",              "body": "Your medicine was procured directly from {supplier}" },
    { "id": "storage",   "illustration": "warehouse", "title": "Stored at 25–30°C",      "body": "Your medicine was stored in our temperature-controlled warehouse" },
    { "id": "verified",  "illustration": "scan",      "title": "Verified by Pharmacist", "body": "Your medicine was carefully verified: product, expiry, and batch details thoroughly checked" },
    { "id": "dispatch",  "illustration": "rider",     "title": "Secure Dispatch",        "body": "Your medicine was dispatched in secure eco-friendly packaging on {date}" },
    { "id": "transit",   "illustration": "bag",       "title": "Safe Transit",           "body": "Your medicine was transported safely through our trusted delivery partner" }
  ]
}
```

---

### 3.3 Brand strip
Small header row: logo lockup ("Tata 1mg" + campaign wordmark "Sawaal Uthao") on the left, a share icon on the right. → for PharmaChain: `[Logo] [Campaign/Trust badge]` + share icon, simple `flexDirection: row`, `justifyContent: space-between`.

### 3.4 Trust grid ("How does [Brand] ensure your safety?")
- Centered heading, brand name in accent color mid-sentence.
- **2×2 grid** of cards (`card-neutral-bg`, radius 16): each has a small square icon tile (light pink circle/rounded-square bg + colored icon), a bold title, and 2 bullet points.
- Cards: **Genuine Medicines, Strict Quality Checks, Proper Storage, Safe Delivery.**
- No scroll-linked motion here — just a staggered fade/slide-up as the grid enters the viewport (simple `IntersectionObserver`-equivalent / Reanimated `useAnimatedScrollHandler` threshold trigger, ~80ms stagger between the 4 cards).

### 3.5 Video teaser
Heading **"Check out the journey of your medicines 👉"**, followed by a 16:9 video thumbnail card (radius 16) with a caption burned into the lower third and a play affordance. In RN, use `expo-av` / `react-native-video` with a poster image, not an actual `<video>` embed.

### 3.6 "Real stories of spurious medicines" (dark section)
- Full-bleed dark maroon (`stories-bg`) background band.
- White heading.
- Horizontal-scrolling **snap carousel** of news-style cards (white/light card on dark bg): headline + short excerpt. Standard `FlatList horizontal pagingEnabled` in RN — no scroll-jacking needed, this is a plain swipeable carousel, not scrubbed.

### 3.7 Sticky CTA
A pill button, **"⊞ Scan more medicines"**, fixed near the bottom of the screen, visible from section 3.4 onward (fades in once the hero card scrolls out, stays fixed while sections 4–6 scroll underneath it). In RN this is an absolutely-positioned `View` outside the `ScrollView`, with opacity driven by scroll offset.

---

## 4. Motion implementation

### 4.1 Section 3.1 (hero) — simple mount animation
Reanimated, no scroll dependency:
```tsx
const opacity = useSharedValue(0);
const translateY = useSharedValue(16);
useEffect(() => {
  opacity.value = withTiming(1, { duration: 400 });
  translateY.value = withTiming(0, { duration: 400 });
}, []);
```

### 4.2 Section 3.2 — native RN implementation (Option A, recommended)

Core idea: put the pinned heading + illustration in a `View` that sits **outside/above** an inner horizontal `ScrollView`, and drive everything off **one shared value** — the vertical scroll offset of the *outer* screen `ScrollView`, remapped to a 0→1 "chapter progress" while this section is in view.

```tsx
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const SECTION_HEIGHT = 5 * SCREEN_HEIGHT * 0.6; // scroll distance the section "eats" — tune per device
const sectionScrollY = useSharedValue(0); // 0..1 across the whole pinned section

// on the OUTER page ScrollView:
const onScroll = useAnimatedScrollHandler((event) => {
  const y = event.contentOffset.y;
  sectionScrollY.value = interpolate(
    y,
    [sectionStartY, sectionStartY + SECTION_HEIGHT],
    [0, 1],
    Extrapolate.CLAMP
  );
});

// Illustration crossfade — one Animated.View per state, opacity driven by progress "windows"
const stateStyle = (index: number, total = 5) =>
  useAnimatedStyle(() => {
    const step = 1 / total;
    const start = index * step;
    const end = start + step;
    const opacity = interpolate(
      sectionScrollY.value,
      [start - step * 0.3, start, end - step * 0.3, end],
      [0, 1, 1, 0],
      Extrapolate.CLAMP
    );
    return { opacity, position: 'absolute' };
  });

// Horizontal card carousel translateX, synced to the SAME progress value
const carouselStyle = useAnimatedStyle(() => ({
  transform: [
    { translateX: -sectionScrollY.value * (CARD_WIDTH * (journey.length - 1)) },
  ],
}));

// Progress bar fill
const progressBarStyle = useAnimatedStyle(() => ({
  width: `${sectionScrollY.value * 100}%`,
}));
```

**Pinning** the heading + illustration while `sectionScrollY` goes 0→1: easiest reliable approach in RN is *not* true CSS-style "position: sticky" (unsupported cross-platform) — instead render the pinned block as an `absolute`/`sticky`-simulated header using `Animated.View` whose `translateY` is clamped to 0 once the section reaches the top, e.g. via `stickyHeaderIndices` if using a plain `ScrollView`, or a manual clamp:
```tsx
const pinStyle = useAnimatedStyle(() => ({
  transform: [{
    translateY: interpolate(
      scrollY.value,
      [sectionStartY, sectionStartY, sectionStartY + SECTION_HEIGHT],
      [0, 0, 0], // stays put; the CONTENT under it moves, not the pinned block
      Extrapolate.CLAMP
    ),
  }],
}));
```
In practice, the simplest robust pattern is: make the illustration+progress+cards a **fixed-height inner block that does NOT scroll itself**, and let it visually "hold still" simply because it's `position: absolute` at a `top` computed once, for the duration the outer scroll offset is within `[sectionStartY, sectionStartY + SECTION_HEIGHT]`; before/after that range it scrolls normally with the page. This avoids fighting RN's lack of native scroll-pinning.

> 💡 If this animated crossfade+carousel proves fiddly to tune, an easier and very robust fallback for the **illustration only** is a single **Lottie animation** (`lottie-react-native`) with 5 named markers, and driving its `progress` prop directly from `sectionScrollY` via `AnimatedLottieView`. This sidesteps building 5 separate crossfading SVG states by hand. Keep the card carousel + progress bar as Reanimated as above.

### 4.3 Section 3.4 grid — scroll-triggered stagger
```tsx
const cardStyle = (index: number) => useAnimatedStyle(() => {
  const triggerY = gridStartY + index * 20; // slight stagger
  const opacity = interpolate(scrollY.value, [triggerY - 60, triggerY], [0, 1], Extrapolate.CLAMP);
  const translateY = interpolate(scrollY.value, [triggerY - 60, triggerY], [16, 0], Extrapolate.CLAMP);
  return { opacity, transform: [{ translateY }] };
});
```

### 4.4 Sticky CTA
```tsx
const ctaStyle = useAnimatedStyle(() => ({
  opacity: interpolate(scrollY.value, [heroCardHeight - 40, heroCardHeight], [0, 1], Extrapolate.CLAMP),
}));
// render as <Animated.View style={[styles.stickyPill, ctaStyle]}> outside the ScrollView, position: 'absolute', bottom: 16
```

### 4.5 Section 3.2 — WebView / actual GSAP implementation (Option B)
If the team decides to ship this as a WebView page, this is close to what the reference site itself runs — port directly:
```js
gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.journey-section',
    start: 'top top',
    end: '+=250%',      // scroll distance the pin lasts for
    pin: true,
    scrub: 1,            // ties timeline progress directly to scroll position
  },
});

// Crossfade illustration states
gsap.utils.toArray('.journey-illustration-state').forEach((el, i) => {
  tl.to(el, { opacity: 1, duration: 0.2 }, i * 0.25)
    .to(el, { opacity: 0, duration: 0.2 }, i * 0.25 + 0.2);
});

// Horizontal card track, moved by the same scrubbed timeline
tl.to('.journey-card-track', { xPercent: -80, ease: 'none' }, 0);

// Progress bar
tl.to('.journey-progress-fill', { width: '100%', ease: 'none' }, 0);
```
Load this page in `react-native-webview`, sized to the section's height, with `scrollEnabled={false}` on the WebView itself and letting the outer RN `ScrollView`'s scroll position drive an injected JS message to the page (`postMessage`) if you want it to feel like one continuous scroll rather than a scroll-within-a-scroll. This integration detail is the main cost of Option B — budget time for it.

---

## 5. SVG / illustration asset production guide

Two distinct asset types here — treat them differently:

### 5.1 Icons (small, single-color, reusable)
Icons needed: bottle, thermometer/snowflake, verified-checklist, storefront/warehouse, delivery-package, QR/scan glyph, share, chevron-down, heart/care (safe delivery), quality-check/clipboard.

**How the design team should produce them:**
1. Design at a **24×24 or 32×32 viewBox**, single consistent stroke width (1.5–2px) OR flat single-fill style — pick one style system-wide, don't mix.
2. Use `currentColor` (or a single hex you swap at export) for all fill/stroke so the same SVG can be re-tinted per usage (green for the timeline, white on dark for section 6, etc.) without duplicate files.
3. Export from Figma as SVG, then run through **SVGO** (`npx svgo icon.svg`) to strip metadata/ids and shrink file size.
4. Name files by role, not appearance: `icon-source.svg`, `icon-storage.svg`, `icon-verified.svg`, `icon-dispatch.svg`, `icon-transit.svg` — not `bottle.svg` (roles may get reused with different art later).
5. In RN, import via `react-native-svg` + `react-native-svg-transformer` (Metro config) so each icon becomes a plain React component: `<IconSource width={24} height={24} color={colors.trustGreen} />`.
6. If the team is short on time, a maintained icon set (`phosphor-react-native` or `lucide-react-native`) covers bottle/thermometer/checklist/storefront/package reasonably well as a placeholder while custom icons are produced.

### 5.2 Illustrations (the 5 scrollytelling scenes — conveyor, scan, rider, transit bag, warehouse)
These are multi-shape, multi-color scene illustrations, not simple icons. Two viable production paths:

**Path 1 — Static SVG per state (works with the Reanimated crossfade in §4.2):**
1. Build each scene as its own **flattened SVG artboard**, consistent canvas size (e.g. 400×400) and consistent "ground line" position across all 5, so they crossfade without visibly jumping.
2. Keep each scene to ≤ ~40 path nodes if possible — RN's SVG renderer is not GPU accelerated the way web SVG is, so overly complex illustrations can cost frame time during the crossfade.
3. Export each as its own optimized SVG (`illustration-sourcing.svg`, `illustration-storage.svg`, `illustration-scan.svg`, `illustration-dispatch.svg`, `illustration-transit.svg`), import as RN components same as icons.
4. Render all 5 stacked with `position: absolute`, animate `opacity` per §4.2.

**Path 2 — One Lottie animation (recommended for a smoother result):**
1. Illustrator/designer builds the 5 scenes as **keyframed states inside a single After Effects composition** (or directly in a tool like Rive), with named markers at each state boundary (`sourcing`, `storage`, `scan`, `dispatch`, `transit`).
2. Export via **Bodymovin** to a single `journey.json` Lottie file.
3. In RN: `<LottieView source={journey.json} progress={sectionScrollY} />` — driving `progress` (0–1) directly from the same shared value used for the card carousel and progress bar means everything stays perfectly in sync with one number, and you get smooth in-between motion (the rider actually driving, the box actually sliding onto the belt) rather than a hard crossfade between static frames — closer to what the reference video shows.
4. This is more upfront design cost but noticeably less animation-engineering cost, and is the more faithful match to the reference.

**Recommendation:** if the design team has any After Effects/Rive capacity, do Path 2. If not, Path 1 (static SVG crossfade) is a fine, faster-to-ship fallback — just be explicit with design that motion will be a hard crossfade, not a fluid morph.

---

## 6. Suggested file/component structure

```
/screens/MedicineJourney/
  index.tsx
  CertificateCard.tsx          # §3.1
  JourneyScrollytelling/       # §3.2
    index.tsx
    IllustrationStage.tsx      # SVG-stack or LottieView
    CardTrack.tsx              # horizontal card carousel, Reanimated-driven
    ProgressBar.tsx
  BrandStrip.tsx                # §3.3
  TrustGrid.tsx                 # §3.4
  VideoTeaser.tsx                # §3.5
  StoriesCarousel.tsx           # §3.6, plain FlatList
  StickyCTA.tsx                  # §3.7
  assets/
    icons/                      # §5.1
    illustrations/               # §5.2 (svg/ or journey.json)
```

---

## 7. Open questions for design before build starts
- Confirm final illustration style (custom flat-vector like reference, or Lottie/Rive-based).
- Confirm whether "Storage" gets its own distinct illustration state or reuses "Sourcing" art (reference is ambiguous here).
- Confirm brand accent color, badge copy, and CTA copy for PharmaChain (currently ported 1:1 from the 1mg reference).
