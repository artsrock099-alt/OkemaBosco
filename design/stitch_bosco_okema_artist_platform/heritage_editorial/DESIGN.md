---
name: Heritage Editorial
colors:
  surface: '#fdf9f0'
  surface-dim: '#dddad1'
  surface-bright: '#fdf9f0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3ea'
  surface-container: '#f1eee5'
  surface-container-high: '#ece8df'
  surface-container-highest: '#e6e2d9'
  on-surface: '#1c1c16'
  on-surface-variant: '#494640'
  inverse-surface: '#31302b'
  inverse-on-surface: '#f4f0e7'
  outline: '#7a776f'
  outline-variant: '#cbc6bd'
  surface-tint: '#605e5b'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b19'
  on-primary-container: '#868380'
  inverse-primary: '#cac6c2'
  secondary: '#795740'
  on-secondary: '#ffffff'
  secondary-container: '#fed1b4'
  on-secondary-container: '#795841'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#281900'
  on-tertiary-container: '#a87c2e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e6e2de'
  primary-fixed-dim: '#cac6c2'
  on-primary-fixed: '#1c1b19'
  on-primary-fixed-variant: '#484644'
  secondary-fixed: '#ffdcc6'
  secondary-fixed-dim: '#eabea2'
  on-secondary-fixed: '#2d1605'
  on-secondary-fixed-variant: '#5e402b'
  tertiary-fixed: '#ffdead'
  tertiary-fixed-dim: '#f2be69'
  on-tertiary-fixed: '#281900'
  on-tertiary-fixed-variant: '#604100'
  background: '#fdf9f0'
  on-background: '#1c1c16'
  surface-variant: '#e6e2d9'
  warm-ivory: '#F5F1E8'
  deep-charcoal: '#171614'
  earth-brown: '#6B4B35'
  muted-ochre: '#B88A3B'
  paper-white: '#FFFFFF'
  accent-orange: '#E24C11'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 84px
    fontWeight: '400'
    lineHeight: 92px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 52px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
  headline-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 40px
  headline-md:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  body-lg:
    fontFamily: DM Sans
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  section-gap: 120px
---

## Brand & Style

This design system is built around the intersection of traditional artistry and high-end editorial aesthetics. It celebrates the cultural richness of Ugandan music through a lens of modern sophistication. The brand personality is **Artistic, Authentic, and Warm**, prioritizing storytelling and human connection over pure utility.

The design style follows a **Modern Editorial** movement:
- **Generous Whitespace:** Utilizing negative space to give "breathing room" to complex musical narratives.
- **Asymmetry:** Breaking the standard grid for a more dynamic, rhythmic visual flow that mirrors musical composition.
- **Photography-Centric:** Using large-scale imagery and high-contrast layouts to establish an immediate emotional resonance.
- **Dual-Nature UI:** The public-facing experience is immersive and cinematic, while the administrative experience is a refined, high-productivity version of the same aesthetic—maintaining brand warmth while increasing information density.

## Colors

The palette is rooted in an earthy, organic foundation. **Deep Charcoal** provides the primary structural contrast, functioning as the main text color and deep background for immersive sections. **Warm Ivory** serves as the primary canvas, replacing the harshness of pure white with a softer, "paper-like" quality.

**Earth Brown** and **Muted Ochre** are used for secondary accents, icons, and subtle interactive elements, evoking traditional Ugandan craft and sunlight. For administrative contexts, the **Accent Orange** is used sparingly for high-visibility status indicators or urgent calls to action.

## Typography

The typography strategy relies on the contrast between the graceful, classical **EB Garamond** and the functional, low-contrast **DM Sans**. 

- **Headlines:** Use EB Garamond in large sizes for a cinematic effect. Optical sizing is crucial; for display headings, use tight letter spacing.
- **Body Text:** DM Sans provides a clean, neutral balance to the expressive headings. Ensure generous line-height (1.6x or higher) to maintain a comfortable reading experience on the Ivory background.
- **Admin UI:** Prioritize DM Sans for data tables and labels to ensure maximum clarity, using EB Garamond only for page headers.

## Layout & Spacing

This design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **Public Site:** Employs wide margins (64px+) and large vertical section gaps (120px) to create an editorial feel. Content should frequently offset from the grid (e.g., an image occupying 7 columns and text occupying 4 columns with a 1-column gap).
- **Admin Portal:** Uses a **fixed sidebar** (280px) and a more traditional, dense 12-column grid. Vertical gaps are reduced to 32px-48px to optimize for information density and task completion.
- **Responsive Behavior:** On mobile, all staggered editorial elements collapse into a single-column stack, maintaining the large headline typography as the primary visual anchor.

## Elevation & Depth

To maintain a sophisticated, "flat-ink-on-paper" feel, the design system avoids heavy drop shadows.

- **Tonal Layers:** Depth is created by layering different color values. For example, a card might be **Deep Charcoal** sitting on a **Warm Ivory** background, or **White** sitting on **Warm Ivory**.
- **Low-Contrast Outlines:** Instead of shadows, use 1px borders in **Earth Brown** (at 15-20% opacity) to define boundaries for input fields or cards.
- **Admin Depth:** In the management interface, use subtle, extra-diffused ambient shadows (40px blur, 4% opacity) to distinguish between the sidebar and the main content area.

## Shapes

The shape language is **Soft (0.25rem)**. This provides just enough softness to feel approachable and premium without appearing "bubbly" or overly tech-focused.

- **Image Masks:** Use occasional organic or asymmetrical corner radii (e.g., top-left and bottom-right rounded, others sharp) for hero images to mirror the uniqueness of the music.
- **Buttons:** Maintain a consistent 4px radius for primary actions. Use pill-shaped buttons only for small tags or chips.

## Components

### Public Components
- **Navbar:** Minimal and transparent. Links use `label-sm` with a subtle underline transition.
- **Music Player:** Fixed to the bottom. Uses a minimal "Deep Charcoal" bar with "Muted Ochre" progress indicators.
- **Event Cards:** Image-heavy with "EB Garamond" headings overlapping the imagery.
- **Booking Forms:** Multi-step layout using large typography for questions, making the process feel like a conversation rather than a data entry task.

### Admin Components
- **Sidebar:** A clean "Deep Charcoal" column with "Warm Ivory" text.
- **Data Tables:** High-density, utilizing "DM Sans" at 14px. Status badges use low-saturation fills of "Earth Brown" or "Muted Ochre" to indicate states.
- **Visual Page Builder:** A drag-and-drop interface that uses the same "Warm Ivory" canvas to ensure "What You See Is What You Get" accuracy for the public site.
- **Media Library:** A clean grid of thumbnails with minimal metadata, using hover-activated actions to keep the interface clean.