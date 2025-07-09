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

function getOptimalSlidesPerView(totalSlides) {
    // For desktop view, determine optimal number of slides
    if (totalSlides <= 2) return totalSlides; // Show 1 or 2 slides
    if (totalSlides <= 4) return 3; // For 3-4 slides, show 3 at a time
    return 4; // Default to 4 columns for more slides
}

// Adjustable autoplay speed - controls how fast the carousel moves
// Higher values = slower movement (milliseconds per transition)
const carouselSpeed = 8000;

function initializeSwiper(totalSlides) {
    const desktopSlidesPerView = getOptimalSlidesPerView(totalSlides);

    return new Swiper('.company-placements', {
        slidesPerView: 1.75, // Show partial next slide on smallest screens
        spaceBetween: 16, // Reduced space between slides
        grabCursor: true,
        loop: true,
        loopedSlides: totalSlides * 2, // Ensure we have enough slides for smooth infinite looping

        // Autoplay configuration for continuous movement
        autoplay: {
            delay: 1,
            disableOnInteraction: false,
            pauseOnMouseEnter: false
        },

        // Speed of transition (higher = slower)
        speed: carouselSpeed,

        // Responsive breakpoints
        breakpoints: {
            // Small mobile (320px+)
            320: {
                slidesPerView: 1.75,
                spaceBetween: 16
            },
            // Medium mobile (480px+)
            480: {
                slidesPerView: 2,
                spaceBetween: 20
            },
            // Tablet
            768: {
                slidesPerView: 2.5,
                spaceBetween: 24
            },
            // Desktop
            1024: {
                slidesPerView: desktopSlidesPerView,
                spaceBetween: 32
            }
        },

        // Accessibility
        a11y: {
            prevSlideMessage: 'Previous slide',
            nextSlideMessage: 'Next slide',
            firstSlideMessage: 'This is the first slide',
            lastSlideMessage: 'This is the last slide',
        },

        // Events
        on: {
            init: function() {
                // Apply linear transition for smooth continuous scrolling
                const swiperWrapper = this.wrapperEl;
                swiperWrapper.style.transitionTimingFunction = 'linear';
            },
            beforeTransitionStart: function() {
                // Ensure linear timing function is maintained
                this.wrapperEl.style.transitionTimingFunction = 'linear';
            }
        }
    });
}

function renderCompanyPlacements(config) {
    const section = document.querySelector('.credibility--companies');
    const wrapper = document.querySelector('.swiper-wrapper');

    section.querySelector('.credibility__title').textContent = config.title;
    section.querySelector('.credibility__subtitle').textContent = config.subtitle;

    // Create one slide per placement
    let slides = [];

    // Use the new placements array structure
    config.placements.forEach(placement => {
        slides.push(`
            <div class="swiper-slide">
                <div class="placement-card">
                    <div class="placement-card__logo">
                        <img src="${placement.logo}" alt="Company logo" class="company-logo"${placement.size ? ` style="transform:scale(${placement.size})"` : ''}>
                    </div>
                    <div class="placement-card__role">${placement.title || ''}</div>
                </div>
            </div>
        `);
    });

    // Set the slides in the wrapper
    wrapper.innerHTML = slides.join('');

    // Initialize Swiper after content is rendered
    const swiper = initializeSwiper(slides.length);

    // Add CSS for truly continuous scrolling
    const style = document.createElement('style');
    style.textContent = `
        .swiper-wrapper {
            transition-timing-function: linear !important;
        }

        .company-placements .swiper-slide {
            transition: transform 0.1s linear;
        }
    `;
    document.head.appendChild(style);

    return swiper;
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

function initializePage(config) {
    // Initialize typing animation
    const roleTyper = new RoleTyper('role', config.roles);
    roleTyper.type();

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

    // Render all sections
    renderHeroSection(config);
    const swiper = renderCompanyPlacements(config.companyPlacements);
    renderTrustFeatures(config.trustFeatures);
    renderTestimonial(config);
    renderFinalCta(config);

    // Initialize CTA links
    initializeCtaLinks(config);
}

document.addEventListener('DOMContentLoaded', () => {
    initializePage(window.pageConfig);
});
