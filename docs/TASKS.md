# How We Work With You — Implementation Tasks

## Task 1: Section Scaffolding and Layout
- Confirm structural requirements in `docs/SPEC.md` and define responsive breakpoints (desktop/tablet/mobile).
- Implement section wrapper with max-width container, background treatment, and vertical rhythm (96/64/48px padding).
- Add eyebrow, hero heading, and subheading block with specified typography scale.
- Establish column grid (60/40 desktop, 55/45 tablet, stacked mobile) and spacing tokens.
- Write layout-focused tests to assert presence of key landmarks and responsive class application.

## Task 2: Tab Navigation Component
- Build accessible tablist using semantic `<button>` elements with `role="tab"` and `aria-controls` wiring.
- Implement active/inactive visual states including gradient background, top highlight bar, and hover shadow.
- Add keyboard interactions (ArrowLeft/Right/Up/Down, Home, End) plus focus management per spec.
- Ensure motion respects `prefers-reduced-motion` and surface state changes via ARIA attributes.
- Create interaction tests covering default active tab, click activation, and keyboard navigation flows.

## Task 3: Content Panel Rendering
- Structure content panel to render step chip, heading, body copy, and optional proof point list.
- Implement image container with 4:3 aspect ratio, 12px radius, and drop shadow; integrate ultra-realistic image assets.
- Wire data sourced from `docs/CONTENT_PLAN.md` ensuring copy fidelity and type safety.
- Add transition effects (opacity + translateY) with reduced-motion fallback.
- Write behaviour tests validating content swaps, image alt text, and state-driven rendering.

## Task 4: Data Modeling and State Management
- Define TypeScript schema for step data, enforcing required fields and optional proof points.
- Create immutable data source module exporting ordered step definitions used across component and tests.
- Implement state management (React state or context) for active tab tracking with pure update functions.
- Guard against undefined states and add logging or error boundaries for mismatched data.
- Add unit tests for data integrity and reducer/state transitions.

## Task 5: Quality Assurance and Accessibility
- Run automated accessibility audits (axe, Testing Library queries) verifying contrast, focus outlines, and ARIA roles.
- Perform responsive QA across viewport sizes, confirming layout shifts, tab wrapping, and touch targets ≥44px.
- Validate motion, ensuring animations disable under `prefers-reduced-motion` and remain performant.
- Capture visual regression snapshots or manual screenshots for stakeholder review.
- Document verification results and outstanding follow-ups in project tracking.


