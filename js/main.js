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
    const portfolioHideTimers = new WeakMap();

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
                    // Annule un masquage en attente si l'état change avant la fin du délai
                    // (évite qu'un clic rapide sur un autre filtre ne cache une carte qui doit rester visible)
                    const pendingTimer = portfolioHideTimers.get(el);
                    if (pendingTimer) {
                        clearTimeout(pendingTimer);
                        portfolioHideTimers.delete(el);
                    }

                    if (visible) {
                        el.classList.remove('hidden');
                        // Force le reflow avant de retirer la classe pour garantir la transition
                        requestAnimationFrame(() => el.classList.remove('filtering-out'));
                    } else {
                        el.classList.add('filtering-out');
                        const timer = setTimeout(() => {
                            el.classList.add('hidden');
                            portfolioHideTimers.delete(el);
                        }, 400);
                        portfolioHideTimers.set(el, timer);
                    }
                });
            });
        });
    }


// ============================================
// TESTIMONIALS CAROUSEL - OPTIMISÉ
// ============================================
// ============================================
// TESTIMONIALS CAROUSEL — SWIPE + LIRE LA SUITE
// ============================================
const carouselTrack = document.getElementById('carouselTrack');
const carouselWrapper = document.getElementById('carouselWrapper');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');
const carouselDots = document.querySelectorAll('.carousel-dot');

if (carouselTrack && prevBtn && nextBtn && carouselWrapper) {
    let currentSlide = 0;
    const cards = Array.from(carouselTrack.querySelectorAll('.testimonial-card'));
    let cardsPerView = 3;
    let cardWidth = 0;

    // ---- Lire la suite ----
    // Troncature calculée mot par mot (jamais -webkit-line-clamp, qui peut
    // couper un mot en plein milieu) : on cherche par dichotomie le nombre
    // maximum de mots entiers qui tient dans la hauteur de 5 lignes.
    cards.forEach(card => {
        const text = card.querySelector('.testimonial-text');
        const btn = card.querySelector('.read-more-btn');
        if (!text || !btn) return;

        const fullText = text.textContent.trim();

        requestAnimationFrame(() => {
            // Texte déjà assez court : pas besoin de troncature
            if (text.scrollHeight <= text.clientHeight + 2) {
                btn.classList.add('hidden');
                text.classList.remove('truncated');
                return;
            }

            const words = fullText.split(/\s+/);
            let low = 0;
            let high = words.length;

            while (low < high) {
                const mid = Math.ceil((low + high) / 2);
                text.textContent = words.slice(0, mid).join(' ') + '…';
                if (text.scrollHeight <= text.clientHeight + 2) {
                    low = mid;
                } else {
                    high = mid - 1;
                }
            }

            text.textContent = words.slice(0, low).join(' ') + '…';
            text.dataset.truncatedText = text.textContent;
        });

        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // ne pas interférer avec le drag
            const isExpanded = text.classList.contains('expanded');
            text.textContent = isExpanded ? text.dataset.truncatedText : fullText;
            text.classList.toggle('expanded', !isExpanded);
            text.classList.toggle('truncated', isExpanded);
            btn.setAttribute('aria-expanded', String(!isExpanded));
            btn.innerHTML = isExpanded
                ? 'Lire la suite <span aria-hidden="true">↓</span>'
                : 'Réduire <span aria-hidden="true">↑</span>';
        });
    });

    // ---- Carousel ----
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

    // ResizeObserver — pas de offsetWidth
    if ('ResizeObserver' in window && cards.length > 0) {
        const ro = new ResizeObserver(entries => {
            const entry = entries[0];
            // contentRect exclut le padding/la bordure : on utilise borderBoxSize
            // (largeur réellement occupée dans la mise en page) pour éviter un
            // décalage cumulatif du carousel qui finit par rogner la dernière carte
            const width = (entry.borderBoxSize && entry.borderBoxSize.length)
                ? entry.borderBoxSize[0].inlineSize
                : entry.target.getBoundingClientRect().width;
            const newCardsPerView = getCardsPerView();
            cardWidth = width + 24;
            cardsPerView = newCardsPerView;
            goTo(Math.min(currentSlide, getTotalSlides()));
        });
        ro.observe(cards[0]);
    }

    // Boucle sur la première/dernière carte quand on dépasse une extrémité
    nextBtn.addEventListener('click', () => {
        goTo(currentSlide >= getTotalSlides() ? 0 : currentSlide + 1);
    });
    prevBtn.addEventListener('click', () => {
        goTo(currentSlide <= 0 ? getTotalSlides() : currentSlide - 1);
    });
    carouselDots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

    // ---- Drag / Swipe (mouse + touch) ----
    let dragStartX = 0;
    let dragCurrentX = 0;
    let isDragging = false;
    const DRAG_THRESHOLD = 50; // px minimum pour changer de slide

    function onDragStart(x) {
        isDragging = true;
        dragStartX = x;
        dragCurrentX = x;
        carouselWrapper.classList.add('is-dragging');
    }

    function onDragMove(x) {
        if (!isDragging) return;
        dragCurrentX = x;
    }

    function onDragEnd() {
        if (!isDragging) return;
        isDragging = false;
        carouselWrapper.classList.remove('is-dragging');

        const delta = dragStartX - dragCurrentX;

        if (Math.abs(delta) >= DRAG_THRESHOLD) {
            if (delta > 0) {
                goTo(currentSlide + 1); // swipe gauche → suivant
            } else {
                goTo(currentSlide - 1); // swipe droite → précédent
            }
        }
    }

    // Mouse events
    carouselWrapper.addEventListener('mousedown', (e) => onDragStart(e.clientX));
    carouselWrapper.addEventListener('mousemove', (e) => onDragMove(e.clientX));
    carouselWrapper.addEventListener('mouseup', onDragEnd);
    carouselWrapper.addEventListener('mouseleave', onDragEnd);

    // Touch events
    carouselWrapper.addEventListener('touchstart', (e) => onDragStart(e.touches[0].clientX), { passive: true });
    carouselWrapper.addEventListener('touchmove', (e) => onDragMove(e.touches[0].clientX), { passive: true });
    carouselWrapper.addEventListener('touchend', onDragEnd);
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
let navHeight = 0; // pas de lecture DOM ici

if (nav && 'ResizeObserver' in window) {
    const navRo = new ResizeObserver(entries => {
        navHeight = entries[0].contentRect.height;
    });
    navRo.observe(nav);
} else if (nav) {
    // Fallback si ResizeObserver non supporté
    navHeight = nav.getBoundingClientRect().height;
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
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