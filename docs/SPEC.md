# How We Work With You — UI Specification

## Overview
- **Objective:** Introduce a visually engaging, interactive section that communicates A-List Search's four-step hiring collaboration process.
- **Inspiration:** BrightHire "How it works" layout (tabs with descriptive content panel and supporting imagery).
- **Deliverable:** Responsive component ready for implementation in the marketing site hero/section stack.

## User Goals
- Understand the end-to-end collaboration process at a glance.
- Drill into each phase for details without leaving the page.
- Form a positive impression through polished visuals and confident messaging.

## Content Mapping
- Steps sourced from `docs/ALIST_SEARCH_HOW_WE_WORK_WITH_YOU.md`:
  1. Discovery Launch
  2. Source Qualify
  3. Offer Signed
  4. Delivery Review
- Each step supplies:
  - `Title` (step label for the tab)
  - `Headline` (reinforces value for the phase)
  - `Body copy` (2–3 sentences summarizing outcomes/benefits)
  - `Supporting visual` (photo, illustration, or branded graphic)

## Layout & Structure
- Section wrapper spans full width with generous vertical padding (96px desktop / 64px tablet / 48px mobile).
- Centralized max width container (`1200px` desktop, `90vw` mobile) with balanced whitespace.
- Top-aligned heading block:
  - `Eyebrow`: "How we work"
  - `Hero heading`: "A-List Search partners with you every step"
  - `Subheading`: One-sentence overview tying the four phases together.
- Tab control bar sits below subheading with equal-width tab buttons.
- Content panel below tab control:
  - Left column (60% desktop): textual content (step title chip, heading, paragraph, optional bullet list if we expand later).
  - Right column (40% desktop): image with rounded corners and subtle shadow.
- On tablet/mobile, columns stack (text first, image second) with controlled spacing (`24px`).

## Interaction & Behavior
- First tab (`Discovery Launch`) is active by default on initial render.
- Tab buttons use accessible `<button>` semantics with `aria-selected` and `role="tab"`; container uses `role="tablist"`.
- Clicking/keyboard activating a tab updates:
  - Active state styling (highlight color, subtle elevation, icon tint).
  - Content panel to display corresponding text and image.
  - Sets focus to the active tab while preserving tab order.
- Keyboard support: arrow keys cycle tabs, Home/End jump to first/last tab.
- Transition: 200ms fade/slide for content panel swap (opacity + translateY for text, crossfade for image) with `prefers-reduced-motion` honoring reduced animation.

## Visual Design
- Palette aligns with site brand (assume primary indigo `#4C3FFF`, secondary teal `#38B2AC`, neutral grays from current design system).
- Background: light gradient or subtle tint (#F7F9FF) to distinguish section.
- Active tab styling: gradient background (primary → secondary), white label text, 3px top highlight bar.
- Inactive tabs: white background, gray border (`#E2E8F0`), hover state lifts with soft shadow.
- Icons: 24px rounded line icons reflecting step themes; use existing icon set or custom vector.
- Typography:
  - Eyebrow: uppercase, letter-spaced, `12px`/`14px` line height.
  - Section heading: `36px` desktop, scale to `28px` mobile, bold weight.
  - Tab labels: `16px` medium weight.
  - Content heading: `24px` bold.
  - Body copy: `16px` regular, 1.6 line height.
- Spacing:
  - Tabs: 16px gap between buttons; inside padding `16px 24px` desktop, `12px 16px` mobile.
  - Content columns: 40px gutter desktop, 24px tablet, 16px mobile.

## Imagery Guidelines
- Use photography featuring collaborative, professional settings or custom illustrations that match brand style.
- Maintain consistent aspect ratio (4:3 landscape) and size (min 320px width desktop).
- Apply 12px corner radius and soft drop shadow (0 12px 24px rgba(76, 63, 255, 0.1)).
- Provide alt text describing the scene and its relation to the phase.

## Responsive Behavior
- Desktop ≥1200px: horizontal layout, icon + label tabs on single row.
- Tablet 768–1199px: tabs may wrap to two rows if necessary; content columns shrink to 55/45 split.
- Mobile <768px: convert tab bar to horizontal scrollable pill list (snap points) or stacked accordion; default assumption is horizontal scroll with drag indicators.
- Ensure minimum touch target of 44px height.

## Accessibility
- WCAG 2.1 AA color contrast (4.5:1 for text, 3:1 for large text/icons).
- Keyboard navigation as described above.
- `aria-controls` linking tabs to panels; the active panel uses `role="tabpanel"` and is the only one not hidden.
- Motion reduced when `prefers-reduced-motion` is set.
- Provide descriptive headings and alt text for assistive tech users.

## Assumptions & Constraints
- Section will be implemented within the existing marketing site component library using React + Tailwind (assumption based on current stack; confirm).
- Iconography available from current brand assets; if not, we budget time for custom SVG creation.
- Copywriting team will supply final headings/paragraphs during content phase; placeholders acceptable for design prototype.
- Imagery either sourced from existing library or new commission; spec reserves 16:9 fallback crop option.
- Animations should avoid large JS dependencies; CSS transitions preferred.

## Open Questions
- Confirm whether mobile should use swipeable tabs or accordion for accessibility preference.
- Determine final imagery source (stock vs custom) and ownership considerations.
- Align on exact messaging tone (formal vs conversational) before content handoff.


