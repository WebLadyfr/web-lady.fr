/* ============================================
   WEB-LADY - JAVASCRIPT PRINCIPAL
   Version 3.0 - Optimisé performances
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============================================
    // SCROLL REVEAL - INTERSECTION OBSERVER
    // Exclut #hero-title (élément LCP) de l'animation
    // ============================================
    function initScrollReveal() {
        // ⚠️ On exclut volontairement #hero-title pour ne pas bloquer le LCP
        const revealElements = document.querySelectorAll('.scroll-reveal:not(#hero-title)');

        if (revealElements.length === 0) return;

        // Fallback navigateurs anciens
        if (!('IntersectionObserver' in window)) {
            revealElements.forEach(el => el.classList.add('revealed'));
            return;
        }

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.getAttribute('data-delay')) || 0;
                    if (delay > 0) {
                        setTimeout(() => entry.target.classList.add('revealed'), delay);
                    } else {
                        entry.target.classList.add('revealed');
                    }
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // S'assurer que le #hero-title est visible immédiatement (LCP)
    const heroTitle = document.getElementById('hero-title');
    if (heroTitle) {
        heroTitle.classList.add('revealed');
    }

    initScrollReveal();


    // ============================================
    // NAVIGATION - SCROLL EFFECT
    // { passive: true } pour ne pas bloquer le scroll
    // ============================================
    const nav = document.querySelector('.nav');

    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.pageYOffset > 50);
        }, { passive: true });
    }


    // ============================================
    // NAVIGATION - HAMBURGER MENU
    // ============================================
    const hamburger = document.querySelector('.nav-hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }


    // ============================================
    // NAVIGATION - ACTIVE LINK ON SCROLL
    // Via IntersectionObserver, pas de scroll event
    // ============================================
    const sections = document.querySelectorAll('section[id]');

    if (sections.length > 0 && navLinks.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px 0px 0px'
        });

        sections.forEach(section => sectionObserver.observe(section));
    }


    // ============================================
    // HERO - TYPING EFFECT
    // ============================================
    const typingElement = document.querySelector('.typing-text');

    if (typingElement) {
        const text = typingElement.getAttribute('data-text') || typingElement.textContent;
        typingElement.textContent = '';
        typingElement.style.opacity = '1';
        let charIndex = 0;

        function typeChar() {
            if (charIndex < text.length) {
                typingElement.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeChar, 50);
            }
        }

        setTimeout(typeChar, 800);
    }


    // ============================================
    // PARALLAX EFFECT - OPTIMISÉ
    // Lecture et écriture séparées pour éviter les reflows forcés
    // Désactivé sur mobile et si prefers-reduced-motion
    // ============================================
    const parallaxLayers = document.querySelectorAll('[data-parallax-speed]');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (parallaxLayers.length > 0 && !prefersReducedMotion && !isMobile) {
        let ticking = false;
        // Pré-calcul des vitesses (lecture DOM une seule fois)
        const layers = Array.from(parallaxLayers).map(layer => ({
            el: layer,
            speed: parseFloat(layer.getAttribute('data-parallax-speed')) || 0.1
        }));

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset;

                    // Toutes les lectures d'abord
                    const offsets = layers.map(({ el, speed }) => {
                        const parentTop = el.parentElement.getBoundingClientRect().top;
                        return scrollY * speed - (parentTop + scrollY) * speed;
                    });

                    // Toutes les écritures ensuite (zéro reflow forcé)
                    layers.forEach(({ el }, i) => {
                        el.style.transform = `translateY(${offsets[i]}px)`;
                    });

                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }


    // ============================================
    // COUNTER ANIMATION
    // ============================================
    const counters = document.querySelectorAll('[data-target]');

    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const progress = Math.min((currentTime - startTime) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        counter.textContent = Math.floor(eased * target);

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }


    // ============================================
    // PORTFOLIO FILTERS - OPTIMISÉ
    // Lecture/écriture séparées, transitions CSS uniquement
    // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterBtns.length > 0 && portfolioCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                // Toutes les lectures d'abord
                const cardStates = Array.from(portfolioCards).map(card => ({
                    el: card,
                    visible: filter === 'all'
                        || card.getAttribute('data-category') === filter
                        || card.getAttribute('data-category2') === filter
                }));

                // Toutes les écritures ensuite
                cardStates.forEach(({ el, visible }) => {
                    if (visible) {
                        el.classList.remove('hidden');
                        // Laisse le CSS gérer la transition via opacity/transform
                        requestAnimationFrame(() => el.classList.add('visible'));
                    } else {
                        el.classList.remove('visible');
                        // Attendre la fin de la transition CSS avant de cacher
                        el.addEventListener('transitionend', () => el.classList.add('hidden'), { once: true });
                    }
                });
            });
        });
    }


    // ============================================
    // TESTIMONIALS CAROUSEL - OPTIMISÉ
    // offsetWidth lu une seule fois au bon moment
    // ============================================
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const carouselDots = document.querySelectorAll('.carousel-dot');

    if (carouselTrack && prevBtn && nextBtn) {
    let currentSlide = 0;
    const cards = Array.from(carouselTrack.querySelectorAll('.testimonial-card'));
    let cardsPerView = getCardsPerView();
    let cardWidth = 0;

    function getCardsPerView() {
        if (window.innerWidth <= 640) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    function getTotalSlides() {
        return Math.max(0, cards.length - cardsPerView);
    }

    function updateCarousel() {
        if (cards.length === 0 || cardWidth === 0) return;
        carouselTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
        carouselDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function goTo(index) {
        currentSlide = Math.max(0, Math.min(index, getTotalSlides()));
        updateCarousel();
    }

    const ro = new ResizeObserver(entries => {
    // Toutes les lectures EN PREMIER
    const width = entries[0].contentRect.width;
    const newCardsPerView = getCardsPerView();
    
    // Toutes les écritures ENSUITE
    cardWidth = width + 24;
    cardsPerView = newCardsPerView;
    goTo(Math.min(currentSlide, getTotalSlides()));
});

    // ✅ ResizeObserver — pas de offsetWidth, zéro reflow forcé
    if ('ResizeObserver' in window && cards.length > 0) {
        const ro = new ResizeObserver(entries => {
            cardWidth = entries[0].contentRect.width + 24;
            cardsPerView = getCardsPerView();
            goTo(Math.min(currentSlide, getTotalSlides()));
        });
        ro.observe(cards[0]);
    }

    nextBtn.addEventListener('click', () => goTo(currentSlide + 1));
    prevBtn.addEventListener('click', () => goTo(currentSlide - 1));

    carouselDots.forEach((dot, i) => {
        dot.addEventListener('click', () => goTo(i));
    });

    let autoPlay = setInterval(() => {
        goTo(currentSlide < getTotalSlides() ? currentSlide + 1 : 0);
    }, 5000);

    carouselTrack.addEventListener('mouseenter', () => clearInterval(autoPlay));
    carouselTrack.addEventListener('mouseleave', () => {
        autoPlay = setInterval(() => {
            goTo(currentSlide < getTotalSlides() ? currentSlide + 1 : 0);
        }, 5000);
    });
}


    // ============================================
    // FAQ ACCORDION
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question && answer) {
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Ferme tout
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                i.querySelector('.faq-answer').hidden = true;
            });

            // Ouvre si ce n'était pas déjà actif
            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
                answer.hidden = false;
            }
        });
    }
});
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPos = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        });
    });


    // ============================================
    // RIPPLE EFFECT ON BUTTONS
    // ============================================
    document.querySelectorAll('.btn, .ripple').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${e.clientX - rect.left - size / 2}px;
                top: ${e.clientY - rect.top - size / 2}px;
            `;

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });


    // ============================================
    // SKILL BARS ANIMATION
    // ============================================
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    if (skillBars.length > 0) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.getAttribute('data-width') || '80%';
                    setTimeout(() => {
                        bar.style.width = width;
                        bar.classList.add('animated');
                    }, 200);
                    skillObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => skillObserver.observe(bar));
    }


    // ============================================
    // BACK TO TOP
    // ============================================
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.pageYOffset > 600);
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});