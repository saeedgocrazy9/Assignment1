# DESIGN.md: Verdant Crest Residences
### Luxury Real Estate Homepage: Design System & Implementation Spec

> Stack: semantic HTML5, CSS3 (custom properties, Grid, Flexbox), vanilla JavaScript.
> No frameworks. Mobile-first. Production-ready.

---

## 1. Project Overview

| Item | Detail |
|---|---|
| Brand | **Verdant Crest Residences** (alt: The Grand Solitaire) |
| Tagline | *Where Nature Meets Nobility* |
| Product | Premium 2 BHK & 3 BHK residences in a low-density, landscaped development |
| Goal | Convert visitors into qualified leads (tour bookings, brochure downloads, enquiries) |
| Tone | Quiet luxury. Calm, confident, spacious. No clutter, no loud promotions. |
| Primary conversions | 1) Schedule a Tour, 2) Enquire Now form, 3) Download Brochure |

### Design Principles
1. **Restraint:** generous whitespace, few colors, gold used sparingly.
2. **Imagery leads:** the renders are the hero; the UI frames them.
3. **Hierarchy:** serif for emotion, sans-serif for information.
4. **Conversion always in reach:** a CTA is visible in the header, hero, residences, and enquiry sections.
5. **Accessible luxury:** WCAG AA contrast, keyboard navigation, reduced-motion support.

---

## 2. Design Tokens

### 2.1 Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--forest-900` | `#12281E` | Footer base, deep overlays |
| `--forest-700` | `#1A382B` | **Primary brand**: header, buttons, dark sections |
| `--forest-500` | `#2D5A45` | Hover states, secondary accents |
| `--gold-500` | `#D4AF37` | Highlights, icons, active indicators |
| `--gold-400` | `#C5A059` | Borders, badges, button outlines (softer champagne) |
| `--ivory-50` | `#FBF9F5` | Primary page background |
| `--ivory-100` | `#F4EFE6` | Alternate section background, cards |
| `--charcoal-900` | `#1F2421` | Body text, headings on light |
| `--charcoal-600` | `#4A524D` | Secondary text |
| `--white` | `#FFFFFF` | Text on dark, form fields |
| `--error` | `#B3412F` | Form validation errors |
| `--success` | `#2E7D4F` | Form success states |

**Contrast checks (target AA, 4.5:1 for body text):**
- Charcoal `#1F2421` on Ivory `#FBF9F5`: passes (>14:1)
- Ivory on Forest `#1A382B`: passes (>11:1)
- Gold `#D4AF37` on Forest `#1A382B`: passes for large text and UI (~5.5:1)
- **Do not** use gold text on ivory for body copy (fails). Use gold only as borders, icons, or on dark backgrounds.

```css
:root {
  --forest-900:#12281E; --forest-700:#1A382B; --forest-500:#2D5A45;
  --gold-500:#D4AF37;  --gold-400:#C5A059;
  --ivory-50:#FBF9F5;  --ivory-100:#F4EFE6;
  --charcoal-900:#1F2421; --charcoal-600:#4A524D;
  --white:#fff; --error:#B3412F; --success:#2E7D4F;
}
```

### 2.2 Typography

| Role | Font | Fallback | Weights |
|---|---|---|---|
| Display / Headings | **Cormorant Garamond** (alt: Playfair Display) | `Georgia, 'Times New Roman', serif` | 500, 600, 700 |
| Body / UI | **Jost** (alt: Inter) | `system-ui, -apple-system, 'Segoe UI', sans-serif` | 300, 400, 500, 600 |

Load via Google Fonts with `display=swap` and `preconnect`. Self-host as WOFF2 if possible for performance.

**Fluid type scale** (using `clamp()`):

| Token | Size | Use |
|---|---|---|
| `--fs-hero` | `clamp(2.5rem, 6vw + 1rem, 5.5rem)` | Hero H1 |
| `--fs-h2` | `clamp(2rem, 3.5vw + 0.5rem, 3.5rem)` | Section titles |
| `--fs-h3` | `clamp(1.375rem, 1.5vw + 0.75rem, 1.875rem)` | Card titles |
| `--fs-body` | `clamp(1rem, 0.3vw + 0.95rem, 1.125rem)` | Paragraphs |
| `--fs-small` | `0.875rem` | Captions, legal |
| `--fs-eyebrow` | `0.8125rem` + `letter-spacing: 0.22em` + uppercase | Section eyebrows |

- Heading line-height: `1.1–1.2`. Body line-height: `1.7`. Max paragraph width: `65ch`.
- Eyebrows (e.g., "THE RESIDENCES") sit above each H2 in gold-400 on dark, forest-500 on light.

### 2.3 Spacing, Radius, Shadow

```css
--space-1:.25rem; --space-2:.5rem; --space-3:1rem; --space-4:1.5rem;
--space-5:2rem;  --space-6:3rem;  --space-7:5rem; --space-8:8rem;
--section-pad: clamp(4rem, 8vw, 8rem);   /* vertical section padding */
--container: 1240px;                      /* max content width */
--gutter: clamp(1.25rem, 4vw, 3rem);
--radius-sm:2px; --radius-md:6px; --radius-lg:12px;   /* keep sharp & refined */
--shadow-soft: 0 10px 30px rgba(18,40,30,.08);
--shadow-lift: 0 20px 50px rgba(18,40,30,.18);
--ease: cubic-bezier(.22,.61,.36,1);
```

### 2.4 Breakpoints (mobile-first)

| Name | Min width | Target |
|---|---|---|
| base | 0 | Mobile (360–599) |
| `--bp-sm` | 600px | Large phones |
| `--bp-md` | 768px | Tablet |
| `--bp-lg` | 1024px | Laptop |
| `--bp-xl` | 1280px | Desktop |
| `--bp-2xl` | 1600px | Large desktop (cap container, scale hero) |

---

## 3. Global Components

### 3.1 Buttons

| Variant | Style | Use |
|---|---|---|
| `.btn--primary` | Gold-500 background, forest-900 text, uppercase, `letter-spacing:.12em` | Main CTAs on dark |
| `.btn--solid` | Forest-700 background, ivory text | Main CTAs on light |
| `.btn--ghost` | Transparent, 1px gold-400 border, ivory text | Secondary CTA on dark |
| `.btn--link` | Text + animated gold underline | Inline links |

- Min height 48px (touch-friendly), padding `0.95rem 2rem`.
- Hover: translateY(-2px), shadow-lift, 250ms ease. Ghost fills gold on hover.
- Focus: 2px gold outline, 3px offset. Never remove focus styles.

### 3.2 Section Heading Pattern
```
EYEBROW (gold/forest, tracked caps)
Section Title (serif, fs-h2)
── short gold rule (48px × 1px) ──
Intro paragraph (max 60ch, charcoal-600)
```

### 3.3 Cards
Ivory-100 or white background, 1px `rgba(197,160,89,.35)` border, radius-sm, shadow-soft. On hover: lift 6px, border becomes gold-500.

### 3.4 Motion
- Reveal-on-scroll via `IntersectionObserver`: fade + 24px translate-up, 700ms, staggered 80ms.
- Hero image: slow scale 1.08 → 1.0 over 12s (Ken Burns, subtle).
- **`prefers-reduced-motion: reduce`** disables all transforms and animations.

---

## 4. Page Layout: Section by Section

Section order and background rhythm (alternating for contrast):

| # | Section | `id` | Background |
|---|---|---|---|
| 1 | Header / Nav | n/a | Transparent → forest-700 on scroll |
| 2 | Hero | `#top` | Full-bleed render + dark gradient |
| 3 | Overview & Highlights | `#overview`, `#highlights` | Ivory-50 |
| 4 | Residences | `#residences` | Forest-700 (dark) |
| 5 | Amenities | `#amenities` | Ivory-100 |
| 6 | Gallery | `#gallery` | Ivory-50 |
| 7 | Location | `#location` | Forest-900 (dark) |
| 8 | Enquiry & Contact | `#contact` | Ivory-100 |
| 9 | Footer | n/a | Forest-900 |

### 4.1 Header & Navigation (`<header>`)

**Layout:** sticky, height 84px (64px when scrolled). Logo left, nav center/right, CTA far right.

- **Logo:** wordmark in serif caps with a gold crest/leaf monogram (inline SVG). `VERDANT CREST` over smaller tracked `RESIDENCES`.
- **Links:** Overview · Highlights · Residences · Amenities · Gallery · Location. Uppercase, `0.8125rem`, tracked `0.14em`. Gold underline slides in on hover and on the active section (scroll-spy).
- **CTA:** `Schedule a Tour` (`.btn--primary`, compact).
- **States:**
  - Top of page: transparent, ivory text.
  - Scrolled: forest-700 at 95% opacity with `backdrop-filter: blur(8px)`, soft shadow.
- **Mobile (<1024px):** hamburger (animated to X) opens a full-height slide-in panel from the right on forest-900. Links are stacked in large serif type (1.75rem), CTA at the bottom, and contact phone below it. Body scroll locks while open, `Esc` closes, focus is trapped.
- Smooth scroll: `html { scroll-behavior: smooth; scroll-padding-top: 90px; }`.

### 4.2 Hero Banner (`<section class="hero">`)

- **Background:** twilight facade render, `object-fit: cover`, full viewport (`min-height: 100svh`, max 1000px on huge screens).
- **Overlay:** `linear-gradient(180deg, rgba(18,40,30,.55) 0%, rgba(18,40,30,.25) 40%, rgba(18,40,30,.85) 100%)`.
- **Content (left-aligned desktop, centered mobile):**
  - Eyebrow: `PREMIUM RESIDENCES · 2 & 3 BHK`
  - H1: *"Elevated Living, Rooted in Nature."* (use `--fs-hero`)
  - Subtext (max 52ch): "Low-density luxury residences with Italian marble interiors, landscaped courtyards and a lifestyle clubhouse, designed for those who expect more."
  - CTAs: **Explore Residences** (`.btn--primary` → `#residences`) and **Download Brochure** (`.btn--ghost` → opens the brochure PDF, or a lead modal in future).
- **Key Metrics Strip:** bottom of the hero, glass bar (`rgba(18,40,30,.7)` + blur, gold top border).
  4 items separated by thin gold dividers:
  | Metric | Placeholder value |
  |---|---|
  | Land Parcel | `[X] Acres` |
  | Green Open Space | `[XX]%` |
  | Possession | `[Month Year]` |
  | RERA Approved | `[RERA No.]` |
  Number in serif gold (2rem), label in small tracked caps. 2×2 grid on mobile, 4 across from 768px.
- A subtle animated "scroll" chevron appears on desktop.

### 4.3 Overview & Highlights (`#overview`)

**Overview (2-column, 1 on mobile):**
- Left: eyebrow, H2 *"An Architectural Vision in Green"*, 2–3 paragraphs covering architectural vision, landscaped open areas, and sustainable luxury living.
- Right: stacked image composition (one render large, a second smaller, offset with a gold-bordered frame behind) using the courtyard/aerial renders.
- Below the paragraphs: a row of 3 stat callouts (e.g., "Low-density towers", "Landscaped acres", "Sustainable design").

**Highlights (`#highlights`): 4 feature cards in a grid** (1 col → 2 col at 600px → 4 col at 1024px):
| Card | Icon | Copy gist |
|---|---|---|
| Low-Density Living | tower/space | Fewer homes per acre, more privacy and openness |
| Prime Connectivity | route/pin | Quick access to business hubs, airport, metro |
| Italian Marble Finishes | marble/diamond | Imported marble flooring and refined interiors |
| 3-Tier Security | shield | Perimeter, tower and apartment-level security |

Icons: inline SVG, 1.5px stroke, gold-400, inside a 64px circle outlined in gold. Card hover: icon circle fills gold, and the icon turns forest.

### 4.4 Residences (`#residences`): Interactive Switcher

**Dark section (forest-700) with ivory text and gold accents.**

- **Tabs:** `2 BHK Luxury` | `3 BHK Ultra-Luxury`. Segmented control, centered, gold underline slider on the active tab. Implement with `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, and arrow-key navigation.
- **Panel layout (2-col desktop, stacked mobile):**
  - **Left:** floor plan / render image in an ivory frame with a gold corner accent. Optional "View larger" opens the lightbox.
  - **Right:**
    - Badge (gold): `2 BHK LUXURY`
    - Title: *"The Signature Two"* / *"The Grand Three"*
    - **Specs table** (key/value rows with thin gold dividers):
      | Spec | 2 BHK | 3 BHK |
      |---|---|---|
      | Carpet Area | `[~XXX sq.ft]` | `[~XXXX sq.ft]` |
      | Super Built-up Area | `[~XXXX sq.ft]` | `[~XXXX sq.ft]` |
      | Deck / Balcony | `[XX sq.ft]` | `[XX sq.ft]` |
      | Bedrooms / Baths | 2 / 2 | 3 / 3 |
    - **Key specifications** list (4–6 checked bullets): Italian marble flooring, premium modular kitchen, branded sanitaryware, smart-home ready, large decks with garden views, etc.
    - **Price line:** "Price on request" + `Enquire About Pricing` button (scrolls to `#contact` and pre-selects the matching configuration in the form).
- **Transition:** panel cross-fades (opacity + 12px translate), 350ms. Preselect via URL hash (`#residences-3bhk`).
- All area values are **placeholders**. Replace them with the figures from the source document.

### 4.5 Amenities (`#amenities`)

Ivory-100 background. Title *"A Lifestyle Beyond the Doorstep"*.

**Interactive grid of 8 amenities** (2 cols mobile, 3 tablet, 4 desktop):
1. Grand Clubhouse
2. Reflexology Garden & Landscaped Courtyards
3. Swimming Pool
4. Wellness Fitness Centre
5. Children's Play Arena
6. EV Charging
7. 24/7 Smart Surveillance
8. *(optional)* Party lawn / senior seating

**Interaction:** each tile is a button-like card with icon, name, and a one-line description.
- **Hover/focus (desktop):** card flips/slides up to reveal a longer description over a forest overlay with a gold border.
- **Tap (mobile):** expands in place (accordion style), `aria-expanded` toggled.
- Optional filter chips above the grid (All · Wellness · Leisure · Family · Security) that filter with a fade.

### 4.6 Photo Gallery (`#gallery`)

**All 7 renders**, from `assets/images/`:

| # | Suggested filename | Subject |
|---|---|---|
| 1 | `hero-twilight-facade.webp` | Dramatic twilight facade (also hero) |
| 2 | `dusk-street-view.webp` | Dusk street view |
| 3 | `illuminated-facade-01.webp` | Illuminated facade |
| 4 | `illuminated-facade-02.webp` | Illuminated facade, alternate angle |
| 5 | `central-courtyard.webp` | Central courtyard |
| 6 | `aerial-masterplan.webp` | Aerial masterplan |
| 7 | `internal-boulevard.webp` | Internal paved boulevard |

*(Rename to match the actual renders once extracted.)*

- **Grid:** CSS Grid with a mosaic (desktop 4 columns, `grid-auto-rows: 220px`; hero image spans 2×2, the aerial spans 2×1). Tablet: 2 columns. Mobile: 1 column, or a horizontal snap-scroll carousel.
- **Tile:** `object-fit: cover`, hover zoom 1.06, gradient overlay at the bottom with caption and a "+" expand icon.
- **Lightbox (modal):**
  - Dark backdrop (`rgba(18,40,30,.96)`), centered image, caption and counter (`3 / 7`).
  - Prev/Next buttons, keyboard arrows, `Esc` to close, click-outside to close, swipe on touch.
  - `role="dialog"`, `aria-modal="true"`, focus trapped, focus restored on close.
  - Preload adjacent images.

### 4.7 Location & Connectivity (`#location`)

Dark section (forest-900). Two-column: **map** + **connectivity matrix**.

- **Map:** embedded Google Maps iframe (`loading="lazy"`) or a stylized static map with a gold pin. Frame with a gold border.
- **Connectivity matrix: 5 category cards**, each with icon, category, and a list of places with distance/time:
  | Category | Examples (fill in real values) |
  |---|---|
  | Business & IT Hubs | `[Hub name]` · `[XX min]` |
  | International Airport | `[Airport]` · `[XX km]` |
  | Metro Transit | `[Station]` · `[XX min]` |
  | Premier Education | `[Schools/Colleges]` · `[XX min]` |
  | Healthcare | `[Hospitals]` · `[XX min]` |
- Distances are shown in gold serif numerals, names in ivory. Rows are separated by hairline dividers.
- Optional: category toggle buttons that highlight corresponding map pins.

### 4.8 Enquiry & Contact (`#contact`)

**2-column desktop** (form 60% / contact info 40%), stacked on mobile (form first).

**Form fields** (`<form novalidate>`):
| Field | Type | Rules |
|---|---|---|
| Full Name | text | required, min 2 chars, `autocomplete="name"` |
| Phone | tel | required, regex for 10-digit Indian mobile (`^[6-9]\d{9}$`, allow +91), `autocomplete="tel"` |
| Email | email | required, standard email pattern |
| Preferred Configuration | radio-cards or select | `2 BHK` / `3 BHK` (required) |
| Message | textarea | optional, 500 char limit |
| Consent | checkbox | required: "I agree to be contacted…" |

- Floating labels or top-aligned labels. Inputs are white with a 1px charcoal 20% border, and the focus state is a gold-400 border plus a soft gold ring.
- **Validation:** inline errors beneath the field (error color + icon), live on blur, summary announced via `aria-live="polite"`.
- **Submit:** `Request a Callback` (`.btn--solid`, full width on mobile). On success, swap the form for a thank-you panel. Backend hookup is out of scope, so use a `fetch` placeholder or `mailto:`/Formspree-style endpoint and document it.
- **Honeypot** hidden field for basic spam reduction.

**Contact panel (forest-700 card, ivory text):**
- Site address (with "Get Directions" link)
- Sales gallery timings (e.g., `Mon–Sun · 10:00 AM – 7:00 PM`)
- Phone: `tel:` link
- WhatsApp: `https://wa.me/<number>?text=...` button (green accent kept subtle or monochrome gold)
- Email: `mailto:` link

### 4.9 Footer (`<footer>`)

Forest-900, ivory/60% text, gold headings.
- **Col 1:** logo, a short brand blurb.
- **Col 2:** Quick links (same as nav).
- **Col 3:** Contact snapshot.
- **Col 4:** Social icons (Instagram, Facebook, LinkedIn, YouTube), 40px circles with gold borders and a gold fill on hover.
- **RERA block:** "RERA Reg. No. `[XXXX]` · Available at `[rera website]`" plus a disclaimer: *"The information, images and renders on this website are indicative and for illustration only and do not constitute a legal offer. Specifications and areas are subject to change as per approvals."*
- **Bottom bar:** © 2026 Verdant Crest Residences. All rights reserved. · Privacy Policy · Terms.
- Floating **"Back to top"** button appears after 600px scroll.

---

## 5. Responsive Behavior Summary

| Element | Mobile (<600) | Tablet (768) | Laptop (1024) | Desktop (1280+) |
|---|---|---|---|---|
| Nav | Hamburger drawer | Hamburger | Inline links + CTA | Inline links + CTA |
| Hero metrics | 2×2 | 4×1 | 4×1 | 4×1 |
| Highlights | 1 col | 2 col | 4 col | 4 col |
| Residences panel | Stacked | Stacked | 2 col | 2 col |
| Amenities | 2 col | 3 col | 4 col | 4 col |
| Gallery | 1 col / snap carousel | 2 col | 4-col mosaic | 4-col mosaic |
| Location | Stacked | Stacked | 2 col | 2 col |
| Contact | Stacked | Stacked | 2 col | 2 col |
| Footer | 1 col | 2 col | 4 col | 4 col |

Test at: **360, 390, 768, 1024, 1280, 1440, 1920** px. No horizontal scroll at any width.

---

## 6. JavaScript Behaviors (vanilla, `assets/js/main.js`)

1. **Sticky header state:** toggles `.is-scrolled` after 40px.
2. **Mobile menu:** open/close, focus trap, `Esc`, scroll lock, closes on link click.
3. **Scroll-spy:** `IntersectionObserver` marks the active nav link.
4. **Reveal on scroll:** adds `.is-visible` to `[data-reveal]` elements.
5. **Residences tabs:** ARIA-compliant tab switching, arrow keys, hash support.
6. **Amenities:** hover/tap reveal, optional filter.
7. **Lightbox:** open/close/prev/next/swipe/keyboard, preloading.
8. **Form:** validation, error rendering, success state, honeypot, config preselect from the Residences CTA.
9. **Utilities:** back-to-top button, current year in the footer.

Rules: no jQuery, no inline event handlers, progressive enhancement (the page should be readable with JS off, and the tabs should degrade to stacked panels).

---

## 7. Accessibility Checklist

- [ ] Semantic landmarks: `header`, `nav`, `main`, `section` (each with a heading), `footer`
- [ ] One `<h1>` (hero), logical `h2`/`h3` hierarchy
- [ ] "Skip to content" link as the first focusable element
- [ ] All images have meaningful `alt` text (decorative = `alt=""`)
- [ ] Visible focus rings on every interactive element
- [ ] Color contrast ≥ AA (see 2.1)
- [ ] Touch targets ≥ 44×44px
- [ ] Form labels linked via `for`/`id`; errors tied via `aria-describedby`
- [ ] Modal and drawer: focus trap, `Esc`, restore focus
- [ ] `prefers-reduced-motion` respected
- [ ] `lang="en"` on `<html>`

---

## 8. Performance & SEO

**Images**
- Convert renders to **WebP** (JPEG fallback via `<picture>`); generate sizes of 480 / 800 / 1200 / 1920 px and use `srcset` + `sizes`.
- Hero image: `fetchpriority="high"`, preloaded. All others: `loading="lazy"`, `decoding="async"`.
- Always set `width`/`height` to prevent layout shift (CLS < 0.1).
- Target: hero ≤ 250 KB, gallery images ≤ 150 KB each at display size.

**Code**
- One CSS file, one JS file, deferred (`<script defer>`). Minified for production.
- Font `preconnect` and `display=swap`; subset to Latin.

**SEO / meta**
- `<title>`: "Verdant Crest Residences | Luxury 2 & 3 BHK Apartments in [City]"
- Meta description (~155 chars), canonical URL, Open Graph + Twitter card (use the hero render as the share image).
- JSON-LD: `ResidentialComplex` / `RealEstateListing` with address and contact.
- Targets: Lighthouse **90+** on Performance, Accessibility, Best Practices, SEO.

---

## 9. File & Folder Structure

```
verdant-crest/
├── index.html
├── DESIGN.md
├── assets/
│   ├── css/
│   │   └── styles.css          # tokens → base → components → sections → utilities → responsive
│   ├── js/
│   │   └── main.js
│   ├── images/
│   │   ├── hero-twilight-facade.webp
│   │   ├── dusk-street-view.webp
│   │   ├── illuminated-facade-01.webp
│   │   ├── illuminated-facade-02.webp
│   │   ├── central-courtyard.webp
│   │   ├── aerial-masterplan.webp
│   │   ├── internal-boulevard.webp
│   │   └── (floor plans, og-image.jpg)
│   ├── icons/                   # inline SVG sprite or individual SVGs
│   └── docs/
│       └── brochure.pdf
└── README.md
```

**CSS organization (in `styles.css`):** 1) tokens, 2) reset/base, 3) typography, 4) layout utilities, 5) buttons & cards, 6) section styles in page order, 7) media queries grouped per component (mobile-first), 8) reduced-motion overrides.

**Naming:** BEM-style classes (`.residence-card__title--active`), lowercase-hyphen filenames.

---

## 10. Content Placeholders to Replace

| Placeholder | Source |
|---|---|
| Land parcel, green %, possession date, RERA no. | Provided document |
| Carpet / super built-up / deck areas | Provided document |
| Pricing (if disclosed) | Client |
| Address, sales gallery timings, phone, WhatsApp, email | Client |
| Connectivity places & distances | Provided document / map |
| Brochure PDF | Client |
| Social links | Client |

---

## 11. Definition of Done

- [ ] All 9 sections implemented in the specified order with the specified palette and fonts
- [ ] All 7 renders extracted, optimized, and used in the gallery with a working lightbox
- [ ] 2 BHK / 3 BHK switcher works with mouse, touch, and keyboard
- [ ] Nav is smooth-scrolling, with scroll-spy and a working mobile drawer
- [ ] Form validates, shows a success state, and preselects the configuration
- [ ] Verified at all target viewports with no horizontal overflow
- [ ] HTML passes the W3C validator; Lighthouse ≥ 90 across the board
- [ ] No console errors; the page works with no framework dependencies
