# Case Studies Section Implementation Plan

## Overview

Transform the current video section into a rich, interactive Case Studies section that displays video testimonials alongside detailed case study content. The design adapts intelligently across devices: tabbed navigation on desktop/tablet, continuous scrolling cards on mobile.

---

## References

```
Hetal Case Study Sample
- file: @docs/case-study-hetal.md
- description: Sample case study with Hetal
```

---

## Layout Strategy

### Desktop (≥1024px)
- Two-column layout: Content (45%) | Video (55%)
- Content on the left, video on the right
- Tabbed navigation for case study sections (Overview, Challenge, Solution, Results)
- Tabs positioned above the content area
- Active tab content displayed
- DOM order remains video-first for accessibility (CSS handles visual reordering)

### Tablet (768px-1023px)
- Stacked layout: Video on top, content below
- Keep tabbed navigation (tabs easily visible above fold)
- Tabs in horizontal row with touch-friendly sizing

### Mobile (<768px)
- Fully vertical stack layout
- **No tabs** - display all sections as sequential cards
- Each section (Overview, Challenge, Solution, Results, Quote) rendered as individual cards
- Natural scroll through all content
- Card-based visual separation with consistent spacing

---

## Key Features

1. **Section Heading** - "Case Studies" with descriptive subtitle
2. **Case Study Switcher** - Thumbnail carousel (matching current video thumbnails)
3. **Video Player** - YouTube embed with autoplay on switch
4. **Adaptive Content Display:**
   - Desktop/Tablet: Tab navigation system
   - Mobile: Stacked card layout
5. **Smooth Transitions** - Fade animations when switching case studies

---

## Files to Modify

1. **index.html** (lines 436-446) - Update section structure
2. **assets/css/components.css** (after line 1563) - Add `.case-studies` styles
3. **assets/js/main.js** (lines 263-320) - Update rendering logic

---

## Detailed Design Specifications

### Section Structure (All Devices)

```
┌─────────────────────────────────────┐
│   Case Studies (heading)            │
│   Real stories from our clients     │
├─────────────────────────────────────┤
│   [● ● ● ● ●] Thumbnail Carousel    │
├─────────────────────────────────────┤
│   [Main Content Area - varies]      │
└─────────────────────────────────────┘
```

### Desktop Layout (≥1024px)

```
┌──────────────────┬────────────────────┐
│  [Tabs Row]      │                    │
├──────────────────┤                    │
│                  │   Video Player     │
│  Content Panel   │   (16:9 ratio)     │
│                  │                    │
│                  │                    │
└──────────────────┴────────────────────┘
      45%                   55%
```

### Tablet Layout (768-1023px)

```
┌──────────────────────────────────┐
│        Video Player              │
│        (16:9 ratio)              │
├──────────────────────────────────┤
│  [Overview] [Challenge] [Soln]   │
├──────────────────────────────────┤
│                                  │
│      Content Panel               │
│                                  │
│                                  │
└──────────────────────────────────┘
```

### Mobile Layout (<768px)

```
┌──────────────────────────────────┐
│        Video Player              │
│        (16:9 ratio)              │
├──────────────────────────────────┤
│  ┌────────────────────────────┐  │
│  │  Company Overview          │  │
│  │  [content card]            │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │  The Challenge             │  │
│  │  [content card]            │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │  Our Solution              │  │
│  │  [content card]            │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │  Results                   │  │
│  │  [content card]            │  │
│  └────────────────────────────┘  │
│  ┌────────────────────────────┐  │
│  │  Client Quote              │  │
│  │  [content card]            │  │
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

---

## Content Rendering Details

### Company Overview Card
- 2-column grid layout (on desktop/tablet)
- Single column on mobile
- Labels with values (Name, Founded, Industry, etc.)
- Format:
  ```
  Name: Hetal
  Founded: 2023
  Industry: AI-Driven Retail Tech
  ...
  ```

### Challenge Card
- Introductory paragraph text
- "Why it was challenging:" subheading
- Bulleted list with custom styling (secondary color bullets)
- Key points highlighted

### Solution Card
- Descriptive paragraph intro
- "Execution Highlights:" subheading
- Bulleted highlights with checkmarks (✓)
- Secondary color accent for checkmarks

### Results Card
- Checklist style with ✓ icons
- Each result on separate line
- Secondary color accent for checkmarks
- Example:
  ```
  ✓ Search completed in under a month
  ✓ Smooth integration with placed candidate
  ✓ Code/Product is shipping on schedule
  ```

### Quote Card
- Large quote text with quotation marks
- Attribution (name, title, company)
- Distinct background treatment
- Centered or left-aligned based on design preference

---

## CSS Implementation Strategy

### Base Styles

```css
.case-studies {
  padding: 96px 0;
  background: linear-gradient(180deg, #000 0%, #1a1a2e 100%);
}

@media (max-width: 1199px) {
  .case-studies {
    padding: 64px 0;
  }
}

@media (max-width: 767px) {
  .case-studies {
    padding: 48px 0;
  }
}

.case-studies__header {
  text-align: center;
  margin-bottom: 48px;
}

.case-studies__title {
  font-size: var(--font-size-section-title);
  color: var(--color-primary-text);
  font-weight: var(--font-weight-extrabold);
  margin-bottom: 16px;
}

.case-studies__subtitle {
  font-size: var(--font-size-section-subtitle);
  color: rgba(255, 255, 255, 0.7);
  font-weight: var(--font-weight-normal);
}

.case-studies__content {
  display: grid;
  grid-template-columns: 45fr 55fr; /* Content left, Video right */
  gap: 48px;
  margin-bottom: 48px;
}

@media (max-width: 1023px) {
  .case-studies__content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

/* Video appears first in DOM for accessibility, but displayed on right on desktop */
.case-studies__video {
  order: 2; /* Moves video to the right on desktop */
}

.case-studies__content-area {
  order: 1; /* Keeps content on the left on desktop */
}

@media (max-width: 1023px) {
  .case-studies__video,
  .case-studies__content-area {
    order: unset; /* Reset order on tablet/mobile - video appears first naturally */
  }
}
```

### Video Container

```css
.case-studies__video {
  /* Reuse existing .video-wrapper styles */
}
```

### Tab System (Desktop/Tablet only)

```css
.case-studies__tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

@media (max-width: 767px) {
  .case-studies__tabs {
    display: none; /* Hide tabs on mobile */
  }
}

.case-studies__tab {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 12px 24px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 200ms ease;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.case-studies__tab:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(212, 165, 116, 0.3);
}

.case-studies__tab.active {
  background: var(--gradient-secondary);
  color: var(--color-primary-text);
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(212, 165, 116, 0.4);
}
```

### Panel System (Desktop/Tablet)

```css
.case-studies__panels {
  display: block;
}

@media (max-width: 767px) {
  .case-studies__panels {
    display: none; /* Hide panels on mobile, use cards instead */
  }
}

.case-studies__panel {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.3);
  display: none;
}

.case-studies__panel.active {
  display: block;
  animation: fadeIn 300ms ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Card System (Mobile only)

```css
.case-studies__cards {
  display: none; /* Hide on desktop/tablet */
}

@media (max-width: 767px) {
  .case-studies__cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

.case-study-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow-lg);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.case-study-card__title {
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(212, 165, 116, 0.3);
}
```

### Content Styling

```css
/* Company Overview Grid */
.case-study-overview {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 767px) {
  .case-study-overview {
    grid-template-columns: 1fr;
  }
}

.case-study-overview__item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.case-study-overview__label {
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-secondary);
}

.case-study-overview__value {
  font-size: 14px;
  color: var(--color-gray-900);
  line-height: 1.5;
}

/* Challenge, Solution Content */
.case-study-content__description {
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-gray-700);
  margin-bottom: 20px;
}

.case-study-content__subheading {
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  margin-bottom: 12px;
  margin-top: 20px;
}

.case-study-content__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.case-study-content__list li {
  padding-left: 28px;
  margin-bottom: 12px;
  position: relative;
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-gray-700);
}

.case-study-content__list li::before {
  content: '•';
  position: absolute;
  left: 8px;
  color: var(--color-secondary);
  font-size: 20px;
  line-height: 1;
}

/* Results with checkmarks */
.case-study-results {
  list-style: none;
  padding: 0;
  margin: 0;
}

.case-study-results li {
  padding-left: 32px;
  margin-bottom: 12px;
  position: relative;
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-gray-700);
}

.case-study-results li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-secondary);
  font-size: 18px;
  font-weight: bold;
}

/* Quote Styling */
.case-study-quote {
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.1), rgba(45, 53, 97, 0.05));
  border-left: 4px solid var(--color-secondary);
  padding: 24px;
  border-radius: 8px;
  margin-top: 24px;
}

.case-study-quote__text {
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-gray-900);
  font-style: italic;
  margin-bottom: 16px;
}

.case-study-quote__text::before {
  content: '"';
  font-size: 32px;
  color: var(--color-secondary);
  opacity: 0.5;
}

.case-study-quote__text::after {
  content: '"';
  font-size: 32px;
  color: var(--color-secondary);
  opacity: 0.5;
}

.case-study-quote__author {
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}

.case-study-quote__title {
  font-size: 13px;
  color: var(--color-gray-600);
  font-style: normal;
}
```

### Thumbnail Carousel

```css
/* Reuse existing .video-thumbnails styles */
.case-studies__thumbnails {
  /* Same as .video-thumbnails */
}
```

---

## JavaScript Logic Updates

### Function: `renderCaseStudiesSection(config)`

Replace the existing `renderVideoSection()` function with enhanced case studies rendering.

#### Key Logic Flow:

1. **Check if case studies exist** - Use `config.caseStudies` or fall back to `config.videos`
2. **Detect viewport size** - Use `window.matchMedia('(max-width: 767px)')`
3. **Render section header** - Title and subtitle
4. **Render main content area:**
   - Video player
   - Content area (tabs + panels OR cards based on viewport)
5. **Render thumbnail carousel**
6. **Add event listeners:**
   - Thumbnail clicks (switch case study)
   - Tab clicks (switch content panel - desktop/tablet only)
   - Window resize (re-render if breakpoint crossed)

#### Code Structure:

```javascript
function renderCaseStudiesSection(config) {
  const section = document.querySelector('.case-studies');
  if (!section) return;

  const caseStudies = config.caseStudies || [];
  if (!caseStudies.length) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';

  // Render header
  renderCaseStudiesHeader(section, config);

  // Detect mobile
  const isMobile = window.matchMedia('(max-width: 767px)').matches;

  // Render content
  renderCaseStudyContent(section, caseStudies[0], isMobile);

  // Render thumbnails
  renderCaseStudyThumbnails(section, caseStudies);

  // Initialize interactivity
  initializeCaseStudySwitcher(section, caseStudies, isMobile);

  // Handle responsive changes
  handleCaseStudyResize(section, caseStudies);
}

function renderCaseStudiesHeader(section, config) {
  const header = section.querySelector('.case-studies__header');
  header.innerHTML = `
    <h2 class="case-studies__title">Case Studies</h2>
    <p class="case-studies__subtitle">Real stories from our clients</p>
  `;
}

function renderCaseStudyContent(section, caseStudy, isMobile) {
  const contentArea = section.querySelector('.case-studies__content-area');

  if (isMobile) {
    renderCaseStudyCards(contentArea, caseStudy);
  } else {
    renderCaseStudyTabsAndPanels(contentArea, caseStudy);
  }
}

function renderCaseStudyCards(container, caseStudy) {
  // Render all sections as sequential cards
  const cardsHTML = `
    <div class="case-studies__cards">
      ${renderOverviewCard(caseStudy.overview)}
      ${renderChallengeCard(caseStudy.challenge)}
      ${renderSolutionCard(caseStudy.solution)}
      ${renderResultsCard(caseStudy.results)}
      ${renderQuoteCard(caseStudy.quote)}
    </div>
  `;
  container.innerHTML = cardsHTML;
}

function renderCaseStudyTabsAndPanels(container, caseStudy) {
  // Render tab navigation
  const tabsHTML = `
    <div class="case-studies__tabs">
      <button class="case-studies__tab active" data-tab="overview">Overview</button>
      <button class="case-studies__tab" data-tab="challenge">Challenge</button>
      <button class="case-studies__tab" data-tab="solution">Solution</button>
      <button class="case-studies__tab" data-tab="results">Results</button>
    </div>
  `;

  // Render panels
  const panelsHTML = `
    <div class="case-studies__panels">
      <div class="case-studies__panel active" data-panel="overview">
        ${renderOverviewContent(caseStudy.overview)}
      </div>
      <div class="case-studies__panel" data-panel="challenge">
        ${renderChallengeContent(caseStudy.challenge)}
      </div>
      <div class="case-studies__panel" data-panel="solution">
        ${renderSolutionContent(caseStudy.solution)}
      </div>
      <div class="case-studies__panel" data-panel="results">
        ${renderResultsContent(caseStudy.results)}
        ${renderQuoteContent(caseStudy.quote)}
      </div>
    </div>
  `;

  container.innerHTML = tabsHTML + panelsHTML;

  // Add tab click handlers
  container.querySelectorAll('.case-studies__tab').forEach(tab => {
    tab.addEventListener('click', () => handleTabClick(tab, container));
  });
}

function handleTabClick(clickedTab, container) {
  const tabName = clickedTab.getAttribute('data-tab');

  // Update tab active state
  container.querySelectorAll('.case-studies__tab').forEach(tab => {
    tab.classList.toggle('active', tab === clickedTab);
  });

  // Update panel active state
  container.querySelectorAll('.case-studies__panel').forEach(panel => {
    const isActive = panel.getAttribute('data-panel') === tabName;
    panel.classList.toggle('active', isActive);
  });
}

// Helper functions to render each section
function renderOverviewCard(overview) {
  return `
    <div class="case-study-card">
      <h3 class="case-study-card__title">Company Overview</h3>
      <div class="case-study-overview">
        ${Object.entries(overview).map(([key, value]) => `
          <div class="case-study-overview__item">
            <div class="case-study-overview__label">${formatLabel(key)}</div>
            <div class="case-study-overview__value">${value}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderChallengeCard(challenge) {
  return `
    <div class="case-study-card">
      <h3 class="case-study-card__title">The Challenge</h3>
      <div class="case-study-content__description">${challenge.description}</div>
      <div class="case-study-content__subheading">Why it was challenging:</div>
      <ul class="case-study-content__list">
        ${challenge.points.map(point => `<li>${point}</li>`).join('')}
      </ul>
    </div>
  `;
}

function renderSolutionCard(solution) {
  return `
    <div class="case-study-card">
      <h3 class="case-study-card__title">Our Solution</h3>
      <div class="case-study-content__description">${solution.description}</div>
      <div class="case-study-content__subheading">Execution Highlights:</div>
      <ul class="case-study-content__list">
        ${solution.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
      </ul>
    </div>
  `;
}

function renderResultsCard(results) {
  return `
    <div class="case-study-card">
      <h3 class="case-study-card__title">Results</h3>
      <ul class="case-study-results">
        ${results.map(result => `<li>${result}</li>`).join('')}
      </ul>
    </div>
  `;
}

function renderQuoteCard(quote) {
  return `
    <div class="case-study-card">
      <h3 class="case-study-card__title">Client Testimonial</h3>
      <div class="case-study-quote">
        <div class="case-study-quote__text">${quote.text}</div>
        <div class="case-study-quote__author">${quote.author}</div>
        <div class="case-study-quote__title">${quote.title}</div>
      </div>
    </div>
  `;
}

function formatLabel(key) {
  // Convert camelCase to Title Case
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
}

function handleCaseStudyResize(section, caseStudies) {
  let currentIsMobile = window.matchMedia('(max-width: 767px)').matches;

  window.addEventListener('resize', () => {
    const newIsMobile = window.matchMedia('(max-width: 767px)').matches;

    // Only re-render if breakpoint crossed
    if (currentIsMobile !== newIsMobile) {
      currentIsMobile = newIsMobile;
      const activeIndex = getActiveCaseStudyIndex(section);
      renderCaseStudyContent(section, caseStudies[activeIndex], newIsMobile);
    }
  });
}
```

---

## Configuration Structure

### Extend `window.pageConfig` with:

```javascript
caseStudies: [
  {
    id: 'hetal',
    company: 'Hetal',
    video: {
      url: 'https://www.youtube.com/embed/XZZsS2FRv1g',
      thumbnail: 'https://img.youtube.com/vi/XZZsS2FRv1g/maxresdefault.jpg',
      title: 'David Roger - Hetal (CEO)'
    },
    overview: {
      name: 'Hetal',
      founded: '2023',
      industry: 'AI-Driven Retail Tech',
      headquarters: 'New York City, NY',
      technology: 'Computer Vision + Generative AI',
      stage: 'Seed (Investors include: SuperAngel, NVP and Nomad Ventures)',
      teamSize: '≈15 employees'
    },
    challenge: {
      description: 'Hetal is reimagining how retailers analyze in-store behavior using computer vision and AI to optimize product placement and customer engagement. The founders needed to hire a Senior Computer Vision + AI Engineer capable of owning the full ML pipeline—from model design to deployment—while bridging computer vision and large language models to make sense of visual data.',
      points: [
        'Cross-disciplinary depth: Most computer vision engineers are narrowly specialized and lack exposure to LLMs or multimodal architectures that combine vision and language.',
        'Tight talent market: The few with this hybrid skill set were already in high demand.',
        'Early-stage dynamics: The role required a hands-on builder comfortable with ambiguity and startup speed.'
      ]
    },
    solution: {
      description: 'A-List partnered directly with CEO David Roger in a deeply collaborative, founder-to-founder search. A tight communication loop—texts, quick calls, weekend check-ins—allowing rapid iteration and immediate feedback.',
      highlights: [
        'Translated Hetal\'s technical roadmap into a precise candidate profile',
        'Engaged cross-disciplinary AI talent aligned with both the mission and the tech stack',
        'Delivered high-quality candidates extremely quickly, closing the search with a bull\'s-eye hire'
      ]
    },
    results: [
      'Search completed in under a month',
      'Smooth integration with placed candidate successfully establishing himself in the CVAI leadership role',
      'Code/Product is shipping on schedule',
      'New customers on-boarded - Hetal has officially launched (out of stealth mode)'
    ],
    quote: {
      text: 'Working with A-List gave us confidence the role would be filled fast with an exceptional hire. They understood our tech, our stage, and our urgency.',
      author: 'David Roger',
      title: 'CEO, Hetal'
    }
  }
  // Additional case studies can be added here
]
```

---

## HTML Structure

### Update index.html (lines 436-446)

Replace the current `.video-section` with:

```html
<!-- Case Studies Section -->
<section class="case-studies">
  <div class="container">
    <!-- Section Header -->
    <div class="case-studies__header">
      <h2 class="case-studies__title">Case Studies</h2>
      <p class="case-studies__subtitle">Real stories from our clients</p>
    </div>

    <!-- Main Content Area -->
    <div class="case-studies__content">
      <!--
        DOM Order: Video first for accessibility and mobile-first approach
        Visual Order (Desktop): Content left (order: 1) | Video right (order: 2)
        Visual Order (Tablet/Mobile): Video top, Content bottom (natural DOM order)
      -->

      <!-- Video Column (appears first in DOM, but on right on desktop via CSS order) -->
      <div class="case-studies__video">
        <div class="video-wrapper">
          <iframe
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen>
          </iframe>
        </div>
      </div>

      <!-- Content Column (appears second in DOM, but on left on desktop via CSS order) -->
      <div class="case-studies__content-area">
        <!-- Content will be dynamically rendered by JavaScript -->
        <!-- Desktop/Tablet: Tabs + Panels -->
        <!-- Mobile: Sequential Cards -->
      </div>
    </div>

    <!-- Thumbnail Carousel -->
    <div class="case-studies__thumbnails">
      <!-- Thumbnails will be populated by JavaScript -->
    </div>
  </div>
</section>
```

---

## Brand Consistency

### Design Tokens

- **Colors**:
  - Primary: Navy (#2D3561)
  - Secondary: Gold (#D4A574)
  - Text on dark: White (#FFFFFF)
  - Body text: Gray-700 (#374151)

- **Glass Morphism**:
  - Background: `rgba(255, 255, 255, 0.95)`
  - Backdrop filter: `blur(10px)`

- **Typography**:
  - Font family: Inter
  - Heading sizes: Use existing CSS variables
  - Line heights: `1.5` for body, `1.2` for headings

- **Spacing**:
  - Section padding: 96px (desktop), 64px (tablet), 48px (mobile)
  - Card gaps: 16px (mobile), 24px (tablet), 32px (desktop)
  - Internal padding: 24px (mobile), 32px (desktop)

- **Border Radius**:
  - Cards: 16px
  - Panels: 16px
  - Tabs: 12px

- **Shadows**:
  - Cards/Panels: `var(--shadow-lg)`
  - Hover states: `var(--shadow-xl)`
  - Active tabs: `0 4px 12px rgba(212, 165, 116, 0.4)`

- **Animations**:
  - Transition duration: 200-300ms
  - Easing: `ease` or `ease-out`
  - Fade in animation for panel switching

---

## Accessibility Features

### Semantic HTML
- Use `<section>` for main container
- Use `<h2>` for section title
- Use `<h3>` for card/panel titles
- Use proper `<ul>` and `<li>` for lists
- Use `<blockquote>` semantics for quotes

### ARIA Labels (Desktop/Tablet Tabs)
- Add `role="tablist"` to tabs container
- Add `role="tab"` to each tab button
- Add `role="tabpanel"` to each panel
- Add `aria-selected="true/false"` to tabs
- Add `aria-labelledby` to panels
- Add `aria-controls` to tabs

### Keyboard Navigation (Tabs)
- Arrow keys to navigate between tabs
- Enter/Space to activate tab
- Tab key to move focus to panel content

### Focus Indicators
- Visible focus outline on tabs
- Visible focus outline on thumbnails
- Color contrast meets WCAG AA standards

### Screen Reader Support
- Proper heading hierarchy
- Descriptive alt text for video thumbnails
- Hidden decorative elements with `aria-hidden="true"`

---

## Performance Considerations

### Optimization Strategies
1. **Lazy rendering**: Only render active panel content (non-mobile)
2. **Debounce resize events**: Limit re-rendering on window resize
3. **CSS containment**: Use `contain: layout style` on cards/panels
4. **Hardware acceleration**: Use `transform` for animations instead of position changes
5. **Minimize reflows**: Batch DOM updates

### Loading Strategy
- Load first case study content immediately
- Lazy load additional case study data on demand
- Use `loading="lazy"` on video thumbnail images

---

## Testing Checklist

### Functional Testing
- [ ] Case studies render correctly on desktop
- [ ] Case studies render correctly on tablet
- [ ] Case studies render correctly on mobile
- [ ] Tabs switch correctly (desktop/tablet)
- [ ] Cards display correctly (mobile)
- [ ] Video switches when thumbnail clicked
- [ ] Video autoplays when switching case studies
- [ ] Resize handling works correctly

### Visual Testing
- [ ] Layout matches design specifications
- [ ] Colors match brand palette
- [ ] Typography is consistent
- [ ] Spacing is correct across breakpoints
- [ ] Animations are smooth
- [ ] Hover states work correctly
- [ ] Active states are clearly visible

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader announces content correctly
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA
- [ ] Heading hierarchy is correct
- [ ] ARIA labels are properly set

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] iOS Safari
- [ ] Android Chrome

### Performance Testing
- [ ] Page load time acceptable
- [ ] Smooth scrolling performance
- [ ] No layout shifts
- [ ] Animations at 60fps
- [ ] Memory usage acceptable

---

## Migration Strategy

### Phase 1: Setup
1. Create new CSS section in components.css
2. Create new JavaScript functions in main.js
3. Test with single case study (Hetal)

### Phase 2: HTML Update
1. Update index.html structure
2. Keep backward compatibility with videos config

### Phase 3: Testing
1. Test on all devices and browsers
2. Verify accessibility
3. Performance audit

### Phase 4: Content Migration
1. Convert remaining video testimonials to case studies
2. Add case study content for each video
3. Update pageConfig

### Phase 5: Deployment
1. Deploy to staging
2. QA testing
3. Deploy to production

---

## Future Enhancements

### Potential Additions
- [ ] Filter case studies by industry/technology
- [ ] Search functionality
- [ ] Downloadable PDF case studies
- [ ] Share buttons for social media
- [ ] Print-friendly version
- [ ] Related case studies suggestions
- [ ] Metrics/stats animations
- [ ] Timeline visualization for project duration
- [ ] Before/after comparisons
- [ ] Integration with CMS for easier content management

---

## Notes

- This design maintains consistency with the existing "How We Work" tabbed section
- The mobile card approach improves UX by avoiding hidden content in tabs
- All styles reuse existing CSS variables for consistency
- The implementation is backward compatible with the current videos configuration
- Content can be easily extended to additional case studies
