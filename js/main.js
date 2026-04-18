/* ============================================
   WEB-LADY - JAVASCRIPT PRINCIPAL
   Version 2.0
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

// ============================================
// SCROLL REVEAL - VERSION ROBUSTE
// ============================================

function initScrollReveal() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    console.log('Scroll Reveal: ' + revealElements.length + ' éléments trouvés');

    if (revealElements.length === 0) return;

    // Vérifie si IntersectionObserver est supporté
    if (!('IntersectionObserver' in window)) {
        // Fallback : tout afficher direct
        revealElements.forEach(el => el.classList.add('revealed'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, parseInt(delay));
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px 0px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// Double sécurité pour le lancement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
} else {
    initScrollReveal();
}


    // ============================================
    // NAVIGATION - SCROLL EFFECT
    // ============================================
    const nav = document.querySelector('.nav');

    if (nav) {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
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
    // ============================================
    const sections = document.querySelectorAll('section[id]');

    if (sections.length > 0 && navLinks.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
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
    // PARALLAX EFFECT
    // ============================================
    const parallaxLayers = document.querySelectorAll('[data-parallax-speed]');

    if (parallaxLayers.length > 0 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset;

                    parallaxLayers.forEach(layer => {
                        const speed = parseFloat(layer.getAttribute('data-parallax-speed')) || 0.1;
                        const rect = layer.parentElement.getBoundingClientRect();
                        const offset = (rect.top + scrollY) * speed;
                        layer.style.transform = `translateY(${scrollY * speed - offset}px)`;
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
                    const start = 0;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        // Ease out cubic
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(eased * (target - start) + start);

                        counter.textContent = current;

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
    // PORTFOLIO FILTERS
    // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    if (filterBtns.length > 0 && portfolioCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                portfolioCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    const category2 = card.getAttribute('data-category2');

                    if (filter === 'all' || category === filter || category2 === filter) {
                        card.classList.remove('hidden');
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            card.style.transition = 'all 0.4s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.9)';
                        setTimeout(() => {
                            card.classList.add('hidden');
                        }, 400);
                    }
                });
            });
        });
    }

    // ============================================
    // TESTIMONIALS CAROUSEL
    // ============================================
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const carouselDots = document.querySelectorAll('.carousel-dot');

    if (carouselTrack && prevBtn && nextBtn) {
        let currentSlide = 0;
        const cards = carouselTrack.querySelectorAll('.testimonial-card');
        let cardsPerView = getCardsPerView();

        function getCardsPerView() {
            if (window.innerWidth <= 640) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        function getTotalSlides() {
            return Math.max(0, cards.length - cardsPerView);
        }

        function updateCarousel() {
            if (cards.length === 0) return;
            const cardWidth = cards[0].offsetWidth + 24; // 24 = gap
            carouselTrack.style.transform = `translateX(-${currentSlide * cardWidth}px)`;

            // Update dots
            carouselDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentSlide);
            });
        }

        nextBtn.addEventListener('click', () => {
            if (currentSlide < getTotalSlides()) {
                currentSlide++;
                updateCarousel();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateCarousel();
            }
        });

        carouselDots.forEach((dot, i) => {
            dot.addEventListener('click', () => {
                currentSlide = Math.min(i, getTotalSlides());
                updateCarousel();
            });
        });

        // Auto-play
        let autoPlay = setInterval(() => {
            if (currentSlide < getTotalSlides()) {
                currentSlide++;
            } else {
                currentSlide = 0;
            }
            updateCarousel();
        }, 5000);

        // Pause on hover
        carouselTrack.addEventListener('mouseenter', () => clearInterval(autoPlay));
        carouselTrack.addEventListener('mouseleave', () => {
            autoPlay = setInterval(() => {
                if (currentSlide < getTotalSlides()) {
                    currentSlide++;
                } else {
                    currentSlide = 0;
                }
                updateCarousel();
            }, 5000);
        });

        // Resize
        window.addEventListener('resize', () => {
            cardsPerView = getCardsPerView();
            currentSlide = Math.min(currentSlide, getTotalSlides());
            updateCarousel();
        });
    }

    // ============================================
    // FAQ ACCORDION
    // ============================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all
                faqItems.forEach(i => i.classList.remove('active'));

                // Open clicked if wasn't active
                if (!isActive) {
                    item.classList.add('active');
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

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
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
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

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
    // BACK TO TOP (optional)
    // ============================================
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});
