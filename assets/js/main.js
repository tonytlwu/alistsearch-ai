class MetricsAnimator {
    constructor() {
        this.metricsSection = document.getElementById('metrics-section');
        this.observer = null;
        this.init();
    }

    init() {
        if (!this.metricsSection) return;

        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.1, rootMargin: '0px 0px -10px 0px' }
        );

        this.observer.observe(this.metricsSection);
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                this.animateMetrics();
                entry.target.classList.add('animated');
                this.observer.unobserve(entry.target);
            }
        });
    }

    animateMetrics() {
        this.metricsSection.classList.add('animate');
        const cards = this.metricsSection.querySelectorAll('.metric-card');

        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
                this.animateNumber(card);
            }, index * 150);
        });
    }

    animateNumber(card) {
        const numberElement = card.querySelector('.metric-card__number');
        const targetValue = numberElement.getAttribute('data-target');
        const duration = 2000;
        const startTime = performance.now();

        // Check if it's a range (contains hyphen) or a single number
        const isRange = targetValue.includes('-');

        if (isRange) {
            const [minVal, maxVal] = targetValue.split('-').map(val => parseInt(val.trim()));

            const updateNumber = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);

                // Animate both numbers independently
                const currentMin = Math.floor(easeProgress * minVal);
                const currentMax = Math.floor(easeProgress * maxVal);

                numberElement.textContent = `${currentMin}-${currentMax}`;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    numberElement.textContent = targetValue;
                }
            };

            requestAnimationFrame(updateNumber);
        } else {
            // Original logic for single numbers
            const target = parseInt(targetValue) || 0;

            const updateNumber = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3);
                const current = Math.floor(easeProgress * target);

                numberElement.textContent = current;

                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                } else {
                    numberElement.textContent = target;
                }
            };

            requestAnimationFrame(updateNumber);
        }
    }

    destroy() {
        this.observer?.disconnect();
    }
}

class RoleTyper {
    constructor(elementId, roles) {
        this.element = document.getElementById(elementId);
        this.roles = roles;
        this.currentRole = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.timeoutId = null;
    }

    type() {
        const role = this.roles[this.currentRole];
        const typingSpeed = this.isDeleting ? 50 : 100;

        this.currentText = this.isDeleting
            ? role.substring(0, this.currentText.length - 1)
            : role.substring(0, this.currentText.length + 1);

        this.element.textContent = this.currentText;

        let delay = typingSpeed;
        if (!this.isDeleting && this.currentText === role) {
            this.isDeleting = true;
            delay = 2000;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentRole = (this.currentRole + 1) % this.roles.length;
            delay = 500;
        }

        this.timeoutId = setTimeout(() => this.type(), delay);
    }

    destroy() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
}

class InfiniteCarousel {
    constructor(container, items) {
        this.container = container;
        this.track = container.querySelector('.carousel-track');
        this.items = items;
        this.init();
    }

    init() {
        this.createCarouselItems();
        this.setupInfiniteLoop();
    }

    createCarouselItems() {
        const itemsHTML = this.items.map(item => this.createItemHTML(item)).join('');
        this.track.innerHTML = itemsHTML + itemsHTML;
    }

    createItemHTML(item) {
        const scaleStyle = item.size ? ` background-size: ${item.size * 100}%;` : '';
        return `
            <div class="placement-card">
                <div class="placement-card__logo" style="background-image: url('${item.logo}');${scaleStyle}">
                </div>
            </div>
        `;
    }

    setupInfiniteLoop() {
        const itemWidth = 284;
        const totalWidth = this.items.length * itemWidth;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes infiniteScroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-${totalWidth}px); }
            }
        `;
        document.head.appendChild(style);
    }
}

function renderCompanyPlacements(config) {
    const section = document.querySelector('.credibility--companies');
    const container = document.querySelector('.company-placements');

    section.querySelector('.credibility__title').textContent = config.title;
    section.querySelector('.credibility__subtitle').textContent = config.subtitle;

    return new InfiniteCarousel(container, config.placements);
}

function renderTrustFeatures(config) {
    const container = document.querySelector('.trust-features');
    container.querySelector('.trust-features__title').textContent = config.title;
    container.querySelector('.grid').innerHTML = config.features.map(feature => `
        <div class="card">
            <div class="card__icon">
                <img src="${feature.icon}" alt="${feature.title} icon" width="40" height="40">
            </div>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
        </div>
    `).join('');
}

function renderTestimonial(config) {
    const testimonial = document.querySelector('.testimonial');
    testimonial.querySelector('blockquote').textContent = config.testimonial.quote;
    testimonial.querySelector('.testimonial__author-name').textContent = config.testimonial.author.name;
    testimonial.querySelector('.testimonial__author-title').textContent = config.testimonial.author.title;
}

function renderContent(config) {
    document.querySelector('.hero__description').textContent = config.hero.description;

    const finalCta = document.querySelector('.final-cta');
    finalCta.querySelector('h2').textContent = config.finalCta.title;
    finalCta.querySelector('p').textContent = config.finalCta.description;
}

function getMetricIcon(iconName) {
    const icons = {
        target: '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
        zap: '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"></polygon></svg>',
        clock: '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline></svg>',
        users: '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>'
    };
    return icons[iconName] || '';
}

function renderMetrics(config) {
    if (!config.metrics?.data) return;

    const metricsGrid = document.querySelector('.metrics-grid');
    if (!metricsGrid) return;

    const metricsData = config.metrics.data;
    metricsGrid.setAttribute('data-count', metricsData.length);
    metricsGrid.innerHTML = metricsData.map(metric => `
        <div class="metric-card" data-metric="${metric.id}">
            ${metric.icon ? `<div class="metric-card__icon">${getMetricIcon(metric.icon)}</div>` : ''}
            <div class="metric-card__label">${metric.label}</div>
            <div class="metric-card__value">
                <div class="metric-card__number" data-target="${metric.value}">0</div>
                <div class="metric-card__unit">${metric.unit || '&nbsp;'}</div>
            </div>
            <div class="metric-card__description">${metric.description}</div>
        </div>
    `).join('');
}

function addAutoplayToYouTubeUrl(url, autoplay = false) {
    if (!url.includes('youtube.com/embed/')) return url;

    const urlObj = new URL(url);
    if (autoplay) {
        urlObj.searchParams.set('autoplay', '1');
    }
    return urlObj.toString();
}

// Case Studies Section Rendering
function renderCaseStudiesSection(config) {
    const section = document.querySelector('.case-studies');
    if (!section) return;

    // Support both caseStudies and videos config for backward compatibility
    const caseStudies = config.caseStudies || [];

    if (!caseStudies.length) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';

    // Render content (always use tabs)
    renderCaseStudyContent(section, caseStudies[0]);

    // Render thumbnails
    renderCaseStudyThumbnails(section, caseStudies);

    // Initialize interactivity
    initializeCaseStudySwitcher(section, caseStudies);
}

function renderCaseStudyContent(section, caseStudy) {
    const contentArea = section.querySelector('.case-studies__content-area');
    const videoIframe = section.querySelector('.case-studies__video iframe');

    // Update video
    if (caseStudy.video) {
        videoIframe.src = caseStudy.video.url;
        videoIframe.title = caseStudy.video.title;
    }

    // Always render tabs and panels
    renderCaseStudyTabsAndPanels(contentArea, caseStudy);
}

function renderCaseStudyCards(container, caseStudy) {
    const cardsHTML = `
        <div class="case-studies__cards">
            ${renderOverviewCard(caseStudy.overview)}
            ${renderChallengeCard(caseStudy.challenge)}
            ${renderSolutionCard(caseStudy.solution)}
            ${renderResultsCard(caseStudy.results)}
            ${caseStudy.quote ? renderQuoteCard(caseStudy.quote) : ''}
        </div>
    `;
    container.innerHTML = cardsHTML;
}

function renderCaseStudyTabsAndPanels(container, caseStudy) {
    const tabsHTML = `
        <div class="case-studies__tabs">
            <button class="case-studies__tab active" data-tab="overview">Overview</button>
            <button class="case-studies__tab" data-tab="challenge">Challenge</button>
            <button class="case-studies__tab" data-tab="solution">Solution</button>
            <button class="case-studies__tab" data-tab="results">Results</button>
        </div>
    `;

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
                ${caseStudy.quote ? renderQuoteContent(caseStudy.quote) : ''}
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

function renderOverviewContent(overview) {
    if (!overview) return '';
    return `
        <div class="case-study-overview">
            ${Object.entries(overview).map(([key, value]) => `
                <div class="case-study-overview__item">
                    <div class="case-study-overview__label">${formatLabel(key)}</div>
                    <div class="case-study-overview__value">${value}</div>
                </div>
            `).join('')}
        </div>
    `;
}


function renderChallengeContent(challenge) {
    if (!challenge) return '';
    return `
        <div class="case-study-content__description">${challenge.description}</div>
        ${challenge.points ? `
            <div class="case-study-content__subheading">Why it was challenging:</div>
            <ul class="case-study-content__list">
                ${challenge.points.map(point => `<li>${point}</li>`).join('')}
            </ul>
        ` : ''}
    `;
}


function renderSolutionContent(solution) {
    if (!solution) return '';
    return `
        <div class="case-study-content__description">${solution.description}</div>
        ${solution.highlights ? `
            <div class="case-study-content__subheading">Execution Highlights:</div>
            <ul class="case-study-content__list">
                ${solution.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
            </ul>
        ` : ''}
    `;
}


function renderResultsContent(results) {
    if (!results || !results.length) return '';
    return `
        <ul class="case-study-results">
            ${results.map(result => `<li>${result}</li>`).join('')}
        </ul>
    `;
}


function renderQuoteContent(quote) {
    if (!quote) return '';
    return `
        <div class="case-study-quote">
            <div class="case-study-quote__text">${quote.text}</div>
            <div class="case-study-quote__author">${quote.author}</div>
            ${quote.title ? `<div class="case-study-quote__title">${quote.title}</div>` : ''}
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

function renderCaseStudyThumbnails(section, caseStudies) {
    const thumbnailsContainer = section.querySelector('.case-studies__thumbnails');

    if (caseStudies.length <= 1) {
        thumbnailsContainer.style.display = 'none';
        return;
    }

    thumbnailsContainer.style.display = 'flex';
    thumbnailsContainer.innerHTML = caseStudies.map((caseStudy, index) => `
        <div class="video-thumbnail ${index === 0 ? 'active' : ''}" data-case-study-index="${index}">
            <img src="${caseStudy.video.thumbnail}" alt="${caseStudy.video.title}" loading="lazy">
            <div class="video-thumbnail__title">${caseStudy.video.title}</div>
        </div>
    `).join('');
}

function initializeCaseStudySwitcher(section, caseStudies) {
    const thumbnailsContainer = section.querySelector('.case-studies__thumbnails');

    thumbnailsContainer.addEventListener('click', (e) => {
        const thumbnail = e.target.closest('.video-thumbnail');
        if (!thumbnail) return;

        const index = parseInt(thumbnail.getAttribute('data-case-study-index'));
        const selectedCaseStudy = caseStudies[index];

        if (selectedCaseStudy) {
            // Update active state
            thumbnailsContainer.querySelectorAll('.video-thumbnail').forEach(thumb =>
                thumb.classList.remove('active')
            );
            thumbnail.classList.add('active');

            // Switch case study content and video
            const videoIframe = section.querySelector('.case-studies__video iframe');
            videoIframe.src = addAutoplayToYouTubeUrl(selectedCaseStudy.video.url, true);
            videoIframe.title = selectedCaseStudy.video.title;

            // Re-render content
            renderCaseStudyContent(section, selectedCaseStudy);
        }
    });
}

function initializeCtaLinks(config) {
    document.querySelectorAll('.js-cta-link').forEach(link => {
        link.textContent = config.cta.label;
        link.href = config.cta.url;
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}

class ScrollController {
    constructor() {
        this.ticking = false;
        this.init();
    }

    init() {
        this.setupScrollIndicator();
        this.setupRevealAnimations();
        this.setupScrollBounceHint();

        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
            // Reset the bounce hint timer when user scrolls
            this.resetScrollBounceTimer();
        });
    }

    setupScrollIndicator() {
        const indicator = document.querySelector('.scroll-indicator');
        const hero = document.querySelector('.hero');

        if (!indicator || !hero) return;

        indicator.addEventListener('click', () => {
            document.querySelector('.how-we-work')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    setupRevealAnimations() {
        const elements = document.querySelectorAll('.card');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.setAttribute('data-reveal', 'true');
            element.setAttribute('data-delay', index * 100);
        });
    }

    handleScroll() {
        this.updateScrollIndicator();
        this.updateRevealElements();
    }

    updateScrollIndicator() {
        const indicator = document.querySelector('.scroll-indicator');
        const hero = document.querySelector('.hero');

        if (!indicator || !hero) return;

        const heroRect = hero.getBoundingClientRect();
        const isHidden = heroRect.bottom < window.innerHeight * 0.3;

        indicator.style.opacity = isHidden ? '0' : '';
        indicator.style.pointerEvents = isHidden ? 'none' : '';
    }

    updateRevealElements() {
        document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.8) {
                const delay = parseInt(element.getAttribute('data-delay')) || 0;
                setTimeout(() => {
                    element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    element.classList.add('revealed');
                }, delay);
            }
        });
    }

    setupScrollBounceHint() {
        // Only show bounce hint on the hero section and not on very short screens
        if (window.innerHeight < 600) return;

        // Start the timer for the bounce hint after 5 seconds of inactivity
        this.bounceHintTimer = setTimeout(() => this.triggerScrollBounce(), 5000);
    }

    resetScrollBounceTimer() {
        // Clear the existing timer if it exists
        if (this.bounceHintTimer) {
            clearTimeout(this.bounceHintTimer);
        }

        // Only reset if user is still in the hero section
        const hero = document.querySelector('.hero');
        if (hero && hero.getBoundingClientRect().bottom > 0) {
            // Reset the timer for another 5 seconds
            this.bounceHintTimer = setTimeout(() => this.triggerScrollBounce(), 5000);
        }
    }

    triggerScrollBounce() {
        // Check if user is still in the hero section and hasn't scrolled
        const hero = document.querySelector('.hero');
        if (!hero || hero.getBoundingClientRect().bottom <= 0) return;

        // Only trigger if page hasn't been scrolled
        if (window.scrollY > 20) return;

        // Scroll down 80px smoothly
        window.scrollBy({
            top: 80,
            behavior: 'smooth'
        });

        // After 600ms, scroll back up to original position
        setTimeout(() => {
            window.scrollBy({
                top: -80,
                behavior: 'smooth'
            });
        }, 600);
    }
}

function initializePage(config) {
    const roleTyper = new RoleTyper('role', config.roles);
    roleTyper.type();

    renderContent(config);
    renderMetrics(config);
    renderCompanyPlacements(config.companyPlacements);
    renderTrustFeatures(config.trustFeatures);
    renderTestimonial(config);

    new MetricsAnimator();

    renderCaseStudiesSection(config);

    initializeCtaLinks(config);

    setTimeout(() => new ScrollController(), 100);

    initializeHowWeWorkSection(config);
    initializePricingSection(config);
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.pageConfig) {
        initializePage(window.pageConfig);
    }
});

function initializeHowWeWorkSection(config) {
    const container = document.querySelector('.how-we-work');
    const tabList = container?.querySelector('.how-we-work__tabs');
    const panelsContainer = container?.querySelector('.how-we-work__panels');
    const introEyebrow = container?.querySelector('.how-we-work__eyebrow');
    const introHeading = container?.querySelector('.how-we-work__heading');
    const introSubheading = container?.querySelector('.how-we-work__subheading');
    const howWeWorkConfig = config.howWeWork;

    if (!container || !tabList || !panelsContainer || !howWeWorkConfig || !Array.isArray(howWeWorkConfig.steps) || howWeWorkConfig.steps.length === 0) {
        return;
    }

    if (introEyebrow) {
        introEyebrow.textContent = howWeWorkConfig.eyebrow ?? introEyebrow.textContent ?? '';
    }

    if (introHeading) {
        introHeading.textContent = howWeWorkConfig.heading ?? introHeading.textContent ?? '';
    }

    if (introSubheading) {
        introSubheading.textContent = howWeWorkConfig.subheading ?? introSubheading.textContent ?? '';
    }

    tabList.innerHTML = '';
    panelsContainer.innerHTML = '';

    const steps = howWeWorkConfig.steps;

    const deriveLabel = (step, index) => {
        if (typeof step.tabLabel === 'string' && step.tabLabel.trim().length > 0) {
            return step.tabLabel.trim();
        }

        if (typeof step.chip === 'string') {
            const chipParts = step.chip.split('·');
            if (chipParts.length > 1) {
                return chipParts[1].trim();
            }
            return step.chip.trim();
        }

        if (typeof step.headline === 'string') {
            return step.headline.trim();
        }

        return `Step ${index + 1}`;
    };

    const tabs = steps.map((step, index) => {
        const tab = document.createElement('button');
        tab.className = 'how-we-work__tab';
        tab.id = `how-we-work-tab-${index}`;
        tab.type = 'button';
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', `how-we-work-panel-${index}`);
        tab.setAttribute('data-step', String(index));
        const iconMarkup = typeof step.icon === 'string' ? step.icon : '';
        const label = deriveLabel(step, index);
        tab.innerHTML = `
          <span class="how-we-work__tab-icon" aria-hidden="true">
            ${iconMarkup}
          </span>
          <span>${label}</span>
        `;
        tabList.appendChild(tab);
        return tab;
    });

    const panels = steps.map((step, index) => {
        const panel = document.createElement('div');
        panel.className = 'how-we-work__panel';
        panel.id = `how-we-work-panel-${index}`;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', `how-we-work-tab-${index}`);
        panel.setAttribute('tabindex', '-1');
        panel.innerHTML = `
          <div class="how-we-work__content">
            <div class="how-we-work__text">
              <span class="how-we-work__chip">${step.chip}</span>
              <h3 class="how-we-work__headline">${step.headline}</h3>
              <p class="how-we-work__body">${step.body}</p>
            </div>
            <div class="how-we-work__image-wrapper">
              <div class="how-we-work__image-frame">
                <img src="${step.image?.src ?? ''}" alt="${step.image?.alt ?? ''}">
              </div>
            </div>
          </div>
        `;
        panelsContainer.appendChild(panel);
        return panel;
    });

    let activeIndex = 0;

    const setActive = (index, focus = false) => {
        if (index < 0 || index >= tabs.length) {
            return;
        }

        tabs.forEach((tab, tabIndex) => {
            const isActive = tabIndex === index;
            tab.setAttribute('aria-selected', String(isActive));
            tab.setAttribute('tabindex', isActive ? '0' : '-1');
            tab.classList.toggle('is-active', isActive);
        });

        panels.forEach((panel, panelIndex) => {
            const isActive = panelIndex === index;
            panel.classList.toggle('is-active', isActive);
            panel.toggleAttribute('hidden', !isActive);
            if (isActive) {
                panel.setAttribute('tabindex', '0');
            } else {
                panel.setAttribute('tabindex', '-1');
            }
        });

        activeIndex = index;

        if (focus) {
            tabs[index].focus();
        }
    };

    const handleKeyDown = (event) => {
        const { key } = event;
        const navigationKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End'];

        if (!navigationKeys.includes(key)) {
            if (key === 'Enter' || key === ' ') {
                event.preventDefault();
                setActive(activeIndex, true);
            }
            return;
        }

        event.preventDefault();
        const totalTabs = tabs.length;
        let targetIndex = activeIndex;

        switch (key) {
            case 'ArrowRight':
            case 'ArrowDown':
                targetIndex = (activeIndex + 1) % totalTabs;
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                targetIndex = (activeIndex - 1 + totalTabs) % totalTabs;
                break;
            case 'Home':
                targetIndex = 0;
                break;
            case 'End':
                targetIndex = totalTabs - 1;
                break;
            default:
                break;
        }

        setActive(targetIndex, true);
    };

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => setActive(index, true));
        tab.addEventListener('keydown', handleKeyDown);
    });

    setActive(0);
}

function initializePricingSection(config) {
    const container = document.querySelector('.pricing');
    const eyebrowElement = container?.querySelector('.pricing__eyebrow');
    const headingElement = container?.querySelector('.pricing__heading');
    const subheadingElement = container?.querySelector('.pricing__subheading');
    const timelineElement = container?.querySelector('.pricing__timeline');
    const guaranteeElement = container?.querySelector('.pricing__guarantee');
    const pricingConfig = config.pricing;

    if (!container || !pricingConfig) {
        return;
    }

    // Populate intro text
    if (eyebrowElement && pricingConfig.eyebrow) {
        eyebrowElement.textContent = pricingConfig.eyebrow;
    }

    if (headingElement && pricingConfig.heading) {
        headingElement.textContent = pricingConfig.heading;
    }

    if (subheadingElement && pricingConfig.subheading) {
        subheadingElement.textContent = pricingConfig.subheading;
    }

    // Populate timeline steps
    if (timelineElement && Array.isArray(pricingConfig.steps)) {
        timelineElement.innerHTML = '';

        pricingConfig.steps.forEach(step => {
            const stepElement = document.createElement('div');
            stepElement.className = 'pricing__step';
            stepElement.innerHTML = `
                <div class="pricing__step-icon">${step.icon || ''}</div>
                <h3 class="pricing__step-title">${step.title || ''}</h3>
                <p class="pricing__step-description">${step.description || ''}</p>
                <div class="pricing__step-fee">${step.fee || ''}</div>
            `;
            timelineElement.appendChild(stepElement);
        });
    }

    // Populate guarantee box
    if (guaranteeElement && pricingConfig.guarantee) {
        guaranteeElement.innerHTML = `
            <div class="pricing__guarantee-icon">${pricingConfig.guarantee.icon || ''}</div>
            <div class="pricing__guarantee-content">
                <h4 class="pricing__guarantee-title">${pricingConfig.guarantee.title || ''}</h4>
                <p class="pricing__guarantee-description">${pricingConfig.guarantee.description || ''}</p>
            </div>
        `;
    }
}
