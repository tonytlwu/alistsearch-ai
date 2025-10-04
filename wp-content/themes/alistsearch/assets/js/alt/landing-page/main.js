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

function renderVideoSection(config) {
    const videoSection = document.querySelector('.video-section');
    const videosConfig = config.videos || (config.video ? [config.video] : []);

    if (!videosConfig.length) {
        videoSection.style.display = 'none';
        return;
    }

    videoSection.style.display = 'block';

    const thumbnailsContainer = videoSection.querySelector('.video-thumbnails');
    const videoIframe = videoSection.querySelector('iframe');

    // If only one video, hide thumbnails and show video directly
    if (videosConfig.length === 1) {
        thumbnailsContainer.style.display = 'none';
        const video = videosConfig[0];
        videoIframe.src = video.url;
        videoIframe.title = video.title;
        return;
    }

    // Multiple videos: show thumbnails
    thumbnailsContainer.style.display = 'flex';
    thumbnailsContainer.innerHTML = videosConfig.map((video, index) => `
        <div class="video-thumbnail ${index === 0 ? 'active' : ''}" data-video-id="${video.id || index}">
            <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
            <div class="video-thumbnail__title">${video.title}</div>
        </div>
    `).join('');

    // Initialize with first video
    const firstVideo = videosConfig[0];
    videoIframe.src = firstVideo.url;
    videoIframe.title = firstVideo.title;

    // Add click handlers for thumbnails
    thumbnailsContainer.addEventListener('click', (e) => {
        const thumbnail = e.target.closest('.video-thumbnail');
        if (!thumbnail) return;

        const videoId = thumbnail.getAttribute('data-video-id');
        const selectedVideo = videosConfig.find(v => (v.id || videosConfig.indexOf(v).toString()) === videoId);

        if (selectedVideo) {
            // Update active state
            thumbnailsContainer.querySelectorAll('.video-thumbnail').forEach(thumb =>
                thumb.classList.remove('active')
            );
            thumbnail.classList.add('active');

            // Switch video with autoplay
            videoIframe.src = addAutoplayToYouTubeUrl(selectedVideo.url, true);
            videoIframe.title = selectedVideo.title;
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

        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }

    setupScrollIndicator() {
        const indicator = document.querySelector('.scroll-indicator');
        const hero = document.querySelector('.hero');

        if (!indicator || !hero) return;

        indicator.addEventListener('click', () => {
            document.querySelector('.credibility')?.scrollIntoView({
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

    renderVideoSection(config);

    initializeCtaLinks(config);

    setTimeout(() => new ScrollController(), 100);

    initializeHowWeWorkSection(config);
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.pageConfig) {
        initializePage(window.pageConfig);
    }
});

function initializeHowWeWorkSection(config) {
    const { howWeWork } = config;
    const tabList = document.querySelector('.how-we-work__tabs');
    const panel = document.getElementById('how-we-work-panel');

    if (!tabList || !panel || !howWeWork || !Array.isArray(howWeWork.steps)) {
        return;
    }

    const steps = howWeWork.steps;
    if (steps.length === 0) {
        return;
    }

    const tabs = Array.from(tabList.querySelectorAll('[role="tab"]'));
    const textContainer = panel.querySelector('[data-content="text"]');
    const imageContainer = panel.querySelector('[data-content="image"]');
    const chipEl = panel.querySelector('[data-field="chip"]');
    const headlineEl = panel.querySelector('[data-field="headline"]');
    const bodyEl = panel.querySelector('[data-field="body"]');
    const bulletsEl = panel.querySelector('[data-field="bullets"]');
    const imageEl = panel.querySelector('[data-field="image"]');

    if (!tabs.length || !textContainer || !imageContainer || !chipEl || !headlineEl || !bodyEl || !bulletsEl || !imageEl) {
        return;
    }

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const transitionDuration = reduceMotionQuery.matches ? 0 : 160;
    let activeIndex = -1;

    const updatePanelContent = (step, index) => {
        if (!step) {
            return;
        }

        const applyContent = () => {
            chipEl.textContent = step.chip;
            headlineEl.textContent = step.headline;
            bodyEl.textContent = step.body;

            bulletsEl.innerHTML = '';
            const hasBullets = Array.isArray(step.bullets) && step.bullets.length > 0;
            if (hasBullets) {
                step.bullets.forEach((item) => {
                    if (typeof item === 'string' && item.trim().length > 0) {
                        const listItem = document.createElement('li');
                        listItem.textContent = item;
                        bulletsEl.appendChild(listItem);
                    }
                });
                bulletsEl.hidden = false;
            } else {
                bulletsEl.hidden = true;
            }

            const imageSrc = step.image?.src ?? '';
            const imageAlt = step.image?.alt ?? '';
            imageEl.setAttribute('src', imageSrc);
            imageEl.setAttribute('alt', imageAlt);
            panel.setAttribute('aria-labelledby', `how-we-work-tab-${index}`);
        };

        if (transitionDuration === 0) {
            applyContent();
            return;
        }

        textContainer.classList.add('is-transitioning');
        imageContainer.classList.add('is-transitioning');

        window.setTimeout(() => {
            applyContent();
            textContainer.classList.remove('is-transitioning');
            imageContainer.classList.remove('is-transitioning');
        }, transitionDuration);
    };

    const setActiveTab = (index, options = {}) => {
        const { shouldFocus = false, force = false } = options;

        if (index < 0 || index >= tabs.length) {
            return;
        }

        if (index === activeIndex && !force) {
            if (shouldFocus) {
                tabs[index].focus();
            }
            return;
        }

        activeIndex = index;

        tabs.forEach((tab, tabIndex) => {
            const isActive = tabIndex === index;
            tab.setAttribute('aria-selected', String(isActive));
            tab.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        updatePanelContent(steps[index], index);

        if (shouldFocus) {
            tabs[index].focus();
        }
    };

    const handleKeyDown = (event) => {
        const { key } = event;

        const navigationKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Enter', ' '];
        if (!navigationKeys.includes(key)) {
            return;
        }

        const totalTabs = tabs.length;
        let targetIndex = activeIndex;

        switch (key) {
            case 'ArrowRight':
            case 'ArrowDown':
                targetIndex = (activeIndex + 1 + totalTabs) % totalTabs;
                event.preventDefault();
                break;
            case 'ArrowLeft':
            case 'ArrowUp':
                targetIndex = (activeIndex - 1 + totalTabs) % totalTabs;
                event.preventDefault();
                break;
            case 'Home':
                targetIndex = 0;
                event.preventDefault();
                break;
            case 'End':
                targetIndex = totalTabs - 1;
                event.preventDefault();
                break;
            case 'Enter':
            case ' ': {
                event.preventDefault();
                setActiveTab(activeIndex, { shouldFocus: true, force: true });
                return;
            }
            default:
                break;
        }

        setActiveTab(targetIndex, { shouldFocus: true });
    };

    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => setActiveTab(index, { shouldFocus: true }));
        tab.addEventListener('keydown', handleKeyDown);
    });

    setActiveTab(0, { force: true });
}
