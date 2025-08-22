class MetricsAnimator {
    constructor(config = null) {
        this.metricsSection = document.getElementById('metrics-section');
        this.metricCards = document.querySelectorAll('.metric-card');
        this.isAnimated = false;
        this.observer = null;
        this.config = config;
        this.staggerDelay = 150; // Delay between card animations

        this.init();
    }

        init() {
        if (!this.metricsSection) return;

        // Refresh metric cards after dynamic rendering
        this.refreshMetricCards();

        // Set up intersection observer for individual metric cards
        this.observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -10px 0px'
            }
        );

        // Observe each metric card individually
        this.metricCards.forEach(card => {
            this.observer.observe(card);
        });
    }

    refreshMetricCards() {
        this.metricCards = document.querySelectorAll('.metric-card');
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;

                // Check if this card has already been animated
                if (!card.classList.contains('animated')) {
                    this.animateCard(card);
                    card.classList.add('animated');
                }

                // Stop observing this card once it's animated
                this.observer.unobserve(card);
            }
        });
    }

    animateCard(card) {
        // Fade in the metrics section if it hasn't been done yet
        if (!this.metricsSection.classList.contains('animate')) {
            this.metricsSection.classList.add('animate');
        }

        // Get the card index for staggered animation
        const cardIndex = Array.from(this.metricCards).indexOf(card);
        
        // Apply staggered animation delay
        setTimeout(() => {
            card.classList.add('animate-in');
            this.animateNumber(card);
        }, cardIndex * this.staggerDelay);
    }

    animateMetrics() {
        // Fade in the entire metrics section
        this.metricsSection.classList.add('animate');

        // Animate each card with staggered timing
        this.metricCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
                this.animateNumber(card);
            }, index * 200);
        });
    }

    animateNumber(card) {
        const numberElement = card.querySelector('.metric-card__number');
        const target = parseInt(numberElement.getAttribute('data-target'));
        const duration = 2500; // Slightly longer for more dramatic effect
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Enhanced easing with bounce effect at the end
            let easeProgress;
            if (progress < 0.8) {
                // Smooth acceleration for first 80%
                easeProgress = 1 - Math.pow(1 - (progress / 0.8), 3);
            } else {
                // Slight bounce for the last 20%
                const bounceProgress = (progress - 0.8) / 0.2;
                easeProgress = 1 + (Math.sin(bounceProgress * Math.PI * 2) * 0.1 * (1 - bounceProgress));
            }
            
            const current = Math.floor(easeProgress * target);
            numberElement.textContent = Math.max(0, Math.min(current, target));

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                numberElement.textContent = target;
                // Add a subtle celebration effect
                card.style.transform = 'scale(1.02)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 200);
            }
        };

        requestAnimationFrame(updateNumber);
    }

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

class RoleTyper {
    constructor(elementId, roles) {
        this.element = document.getElementById(elementId);
        this.roles = roles;
        this.currentRole = 0;
        this.currentText = '';
        this.isDeleting = false;
    }

    type() {
        const role = this.roles[this.currentRole];
        const typingSpeed = this.isDeleting ? 50 : 150;

        if (this.isDeleting) {
            this.currentText = role.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = role.substring(0, this.currentText.length + 1);
        }

        this.element.textContent = this.currentText;

        if (!this.isDeleting && this.currentText === role) {
            this.isDeleting = true;
            setTimeout(() => this.type(), 2000);
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentRole = (this.currentRole + 1) % this.roles.length;
            setTimeout(() => this.type(), 500);
        } else {
            setTimeout(() => this.type(), typingSpeed);
        }
    }
}

// Custom Infinite Scroll Carousel Controller
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
        this.addInteractionHandlers();
    }

    createCarouselItems() {
        // Create items twice for seamless infinite loop
        const itemsHTML = this.items.map(item => this.createItemHTML(item)).join('');
        this.track.innerHTML = itemsHTML + itemsHTML; // Duplicate for infinite loop
    }

    createItemHTML(item) {
        return `
            <div class="placement-card">
                <div class="placement-card__logo">
                    <img src="${item.logo}" alt="Company logo" class="company-logo"${item.size ? ` style="transform:scale(${item.size})"` : ''}>
                </div>
            </div>
        `;
    }

    setupInfiniteLoop() {
        // Calculate total width for animation
        const itemWidth = 260 + 24; // card width + margin
        const totalWidth = this.items.length * itemWidth;
        
        // Set CSS custom property for animation distance
        this.track.style.setProperty('--scroll-distance', `-${totalWidth}px`);
        
        // Update animation with calculated distance
        const style = document.createElement('style');
        style.textContent = `
            @keyframes infiniteScroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(${-totalWidth}px); }
            }
        `;
        document.head.appendChild(style);
    }

    addInteractionHandlers() {
        // Enhanced hover effects with staggered animations
        const cards = this.track.querySelectorAll('.placement-card');
        
        cards.forEach((card, index) => {
            card.addEventListener('mouseenter', () => {
                this.addHoverEffect(card, index);
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeHoverEffect(card);
            });
        });
    }

    addHoverEffect(card, index) {
        // Add ripple effect to neighboring cards
        const cards = Array.from(this.track.querySelectorAll('.placement-card'));
        const neighbors = [
            cards[index - 1],
            cards[index + 1],
            cards[index - 1 + this.items.length], // Duplicate set
            cards[index + 1 + this.items.length]  // Duplicate set
        ].filter(Boolean);
        
        neighbors.forEach(neighbor => {
            if (neighbor) {
                neighbor.style.transform = 'translateY(-4px) scale(1.02)';
                neighbor.style.transition = 'all 0.3s ease-out';
            }
        });
    }

    removeHoverEffect(card) {
        // Reset neighboring cards
        const cards = this.track.querySelectorAll('.placement-card');
        cards.forEach(neighborCard => {
            if (neighborCard !== card) {
                neighborCard.style.transform = '';
            }
        });
    }
}

function renderCompanyPlacements(config) {
    const section = document.querySelector('.credibility--companies');
    const container = document.querySelector('.company-placements');

    // Set section content
    section.querySelector('.credibility__title').textContent = config.title;
    section.querySelector('.credibility__subtitle').textContent = config.subtitle;

    // Initialize custom carousel
    const carousel = new InfiniteCarousel(container, config.placements);
    
    return carousel;
}

function renderTrustFeatures(config) {
    const container = document.querySelector('.trust-features');
    const title = container.querySelector('.trust-features__title');
    const grid = container.querySelector('.grid');

    title.textContent = config.title;

    grid.innerHTML = config.features.map(feature => `
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
    const testimonialSection = document.querySelector('.testimonial');
    testimonialSection.querySelector('blockquote').textContent = config.testimonial.quote;
    testimonialSection.querySelector('.testimonial__author-name').textContent = config.testimonial.author.name;
    testimonialSection.querySelector('.testimonial__author-title').textContent = config.testimonial.author.title;
}

function renderHeroSection(config) {
    const description = document.querySelector('.hero__description');
    description.textContent = config.hero.description;
}

function renderFinalCta(config) {
    const finalCta = document.querySelector('.final-cta');
    finalCta.querySelector('h2').textContent = config.finalCta.title;
    finalCta.querySelector('p').textContent = config.finalCta.description;
}

function renderMetrics(config) {
    if (!config.metrics || !config.metrics.data) return;

    const metricsGrid = document.querySelector('.metrics-grid');
    if (!metricsGrid) return;

    const metricsData = config.metrics.data;
    const metricCount = metricsData.length;

    // Set the data-count attribute for flexible grid styling
    metricsGrid.setAttribute('data-count', metricCount);

    // Generate HTML for each metric
    const metricsHTML = metricsData.map(metric => `
        <div class="metric-card" data-metric="${metric.id}">
            <div class="metric-card__label">${metric.label}</div>
            <div class="metric-card__number" data-target="${metric.value}">0</div>
            <div class="metric-card__unit">${metric.unit}</div>
            <div class="metric-card__description">${metric.description}</div>
        </div>
    `).join('');

    // Update the grid HTML
    metricsGrid.innerHTML = metricsHTML;

    return metricCount;
}

function initializeCtaLinks(config) {
    const ctaLinks = document.querySelectorAll('.js-cta-link');

    ctaLinks.forEach(link => {
        // Update the button text from config
        link.textContent = config.cta.label;

        // Set the href attribute and target="_blank" for opening in new tab
        link.href = config.cta.url;
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
}

// Enhanced scroll-based animations and interactions
class ScrollAnimationController {
    constructor() {
        this.animatedElements = new Set();
        this.scrollPosition = 0;
        this.ticking = false;
        
        this.init();
    }

    init() {
        // Throttled scroll handler for performance
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });

        // Initialize reveal animations
        this.initializeRevealElements();
        
        // Check initial visibility on load (important for page refreshes)
        setTimeout(() => {
            this.updateRevealElements();
        }, 100);
    }

    handleScroll() {
        this.scrollPosition = window.pageYOffset;
        this.updateRevealElements();
    }

    initializeRevealElements() {
        // Add reveal animation to cards and sections
        const cards = document.querySelectorAll('.card, .placement-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.setAttribute('data-reveal', 'true');
            card.setAttribute('data-delay', index * 100);
        });

        // Add reveal to section titles
        const titles = document.querySelectorAll('.credibility__title, .trust-features__title, .final-cta h2');
        titles.forEach(title => {
            title.style.opacity = '0';
            title.style.transform = 'translateY(20px)';
            title.setAttribute('data-reveal', 'true');
        });
    }

    updateRevealElements() {
        const revealElements = document.querySelectorAll('[data-reveal]:not(.revealed)');
        revealElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.8;
            
            if (isVisible) {
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


// Scroll Indicator Controller
class ScrollIndicatorController {
    constructor() {
        this.indicator = document.querySelector('.scroll-indicator');
        this.hero = document.querySelector('.hero');
        this.init();
    }

    init() {
        if (!this.indicator) return;

        // Add click handler for smooth scrolling
        this.indicator.addEventListener('click', () => {
            const nextSection = document.querySelector('.credibility');
            if (nextSection) {
                nextSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        // Hide indicator when user scrolls past hero section
        this.setupScrollListener();
    }

    setupScrollListener() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateIndicatorVisibility();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    updateIndicatorVisibility() {
        if (!this.hero || !this.indicator) return;

        const heroRect = this.hero.getBoundingClientRect();
        const heroBottom = heroRect.bottom;
        
        // Hide indicator when hero section is mostly out of view
        if (heroBottom < window.innerHeight * 0.3) {
            this.indicator.style.opacity = '0';
            this.indicator.style.pointerEvents = 'none';
        } else {
            this.indicator.style.opacity = '';
            this.indicator.style.pointerEvents = '';
        }
    }
}

// Enhanced performance monitoring
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Add will-change property to animated elements on scroll start
        let scrollTimer = null;
        window.addEventListener('scroll', () => {
            if (scrollTimer !== null) {
                clearTimeout(scrollTimer);
            }

            // Add will-change during scroll
            document.body.style.willChange = 'transform';

            scrollTimer = setTimeout(() => {
                // Remove will-change after scrolling stops
                document.body.style.willChange = 'auto';
            }, 150);
        });

        // Preload critical images
        this.preloadCriticalImages();
    }

    preloadCriticalImages() {
        const criticalImages = document.querySelectorAll('img[data-critical]');
        criticalImages.forEach(img => {
            const preloadLink = document.createElement('link');
            preloadLink.rel = 'preload';
            preloadLink.as = 'image';
            preloadLink.href = img.src;
            document.head.appendChild(preloadLink);
        });
    }
}

function initializePage(config) {
    // Initialize typing animation
    const roleTyper = new RoleTyper('role', config.roles);
    roleTyper.type();

    // Render all sections
    renderHeroSection(config);
    renderMetrics(config); // Render metrics before initializing animation
    const swiper = renderCompanyPlacements(config.companyPlacements);
    renderTrustFeatures(config.trustFeatures);
    renderTestimonial(config);
    renderFinalCta(config);

    // Initialize metrics animation after metrics are rendered
    const metricsAnimator = new MetricsAnimator(config);

    // Update video section only if video URL is provided
    const videoSection = document.querySelector('.video-section');
    if (config.video?.url) {
        const videoIframe = videoSection.querySelector('iframe');
        videoIframe.src = config.video.url;
        videoIframe.title = config.video.title;
        videoSection.style.display = 'block';
    } else {
        videoSection.style.display = 'none';
    }

    // Initialize CTA links
    initializeCtaLinks(config);

    // Initialize enhanced interactions and animations
    setTimeout(() => {
        new ScrollAnimationController();
        new ScrollIndicatorController();
        new PerformanceOptimizer();
    }, 100); // Small delay to ensure DOM is fully ready
}

document.addEventListener('DOMContentLoaded', () => {
    initializePage(window.pageConfig);
});
