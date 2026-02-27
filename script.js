/* ======================================================
   WFILMS — Advanced Animations & Interactions
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- GSAP Setup ---------- */
    gsap.registerPlugin(ScrollTrigger);

    /* ---------- DOM References ---------- */
    const preloader     = document.getElementById('preloader');
    const navbar        = document.getElementById('navbar');
    const navToggle     = document.getElementById('nav-toggle');
    const navMenu       = document.getElementById('nav-menu');
    const lightbox      = document.getElementById('lightbox');
    const lightboxImg   = lightbox.querySelector('.lightbox-img');
    const backToTop     = document.getElementById('back-to-top');

    /* ==========================================================
       PRELOADER — Logo draw-on + bar fill + dissolve
       ========================================================== */
    const preloaderTl = gsap.timeline({
        onComplete: () => {
            preloader.style.pointerEvents = 'none';
            initScrollAnimations();
        }
    });

    // Calculate stroke dash lengths for each SVG path
    document.querySelectorAll('#preloader .logo-path').forEach(path => {
        const len = path.getTotalLength ? path.getTotalLength() : 400;
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
    });

    preloaderTl
        .to('#preloader .logo-path', {
            strokeDashoffset: 0,
            duration: 1.2,
            stagger: 0.15,
            ease: 'power2.inOut'
        })
        .to('.preloader-bar', { opacity: 1, duration: 0.3 }, '-=0.6')
        .to('.preloader-bar-fill', { width: '100%', duration: 0.8, ease: 'power1.inOut' }, '-=0.4')
        .to('.preloader-text', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.6')
        .to('.preloader-inner', { scale: 0.9, opacity: 0, duration: 0.6, ease: 'power2.in' }, '+=0.3')
        .to(preloader, { opacity: 0, duration: 0.4 }, '-=0.2')
        .set(preloader, { display: 'none' });

    /* ==========================================================
       HERO ENTRANCE
       ========================================================== */
    const heroTl = gsap.timeline({ delay: 2.8 });

    heroTl
        .from('.hero-title', {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        })
        .from('.tagline-line', {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power2.out'
        }, '-=0.5')
        .from('.hero-cta', {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out'
        }, '-=0.3')
        .from('.scroll-indicator', {
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.3');

    /* ==========================================================
       SCROLL-TRIGGERED ANIMATIONS
       ========================================================== */
    function initScrollAnimations() {

        /* --- Section Headers --- */
        gsap.utils.toArray('.section-header').forEach(header => {
            const label = header.querySelector('.section-label');
            const title = header.querySelector('.section-title');

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: header,
                    start: 'top 80%',
                    end: 'bottom 60%',
                    toggleActions: 'play none none none'
                }
            });

            if (label) tl.from(label, { x: -30, opacity: 0, duration: 0.6, ease: 'power2.out' });
            if (title) tl.from(title, { y: 50, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3');
        });

        /* --- Service Cards --- */
        gsap.utils.toArray('.service-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 80,
                opacity: 0,
                duration: 0.9,
                delay: i * 0.15,
                ease: 'power3.out'
            });
        });

        /* --- Portfolio Items --- */
        gsap.utils.toArray('.portfolio-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 60,
                opacity: 0,
                scale: 0.96,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'power3.out'
            });
        });

        /* --- About Section --- */
        const aboutText = document.querySelector('.about-text-col');
        const aboutStats = document.querySelector('.about-stats-col');

        if (aboutText) {
            gsap.from(aboutText.children, {
                scrollTrigger: {
                    trigger: aboutText,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                y: 40,
                opacity: 0,
                duration: 0.7,
                stagger: 0.15,
                ease: 'power2.out'
            });
        }

        if (aboutStats) {
            gsap.from('.stat-item', {
                scrollTrigger: {
                    trigger: aboutStats,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                    onEnter: animateCounters
                },
                x: 40,
                opacity: 0,
                duration: 0.7,
                stagger: 0.2,
                ease: 'power2.out'
            });
        }

        /* --- Contact Section --- */
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            gsap.from('.contact-text-col', {
                scrollTrigger: {
                    trigger: '#contact',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                x: -40,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out'
            });

            gsap.from('.form-group', {
                scrollTrigger: {
                    trigger: contactForm,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.12,
                ease: 'power2.out'
            });

            gsap.from('.form-submit', {
                scrollTrigger: {
                    trigger: contactForm,
                    start: 'top 70%',
                    toggleActions: 'play none none none'
                },
                y: 20,
                opacity: 0,
                duration: 0.6,
                delay: 0.5,
                ease: 'power2.out'
            });
        }

        /* --- Parallax Hero Logo --- */
        gsap.to('.hero-logo-wrap', {
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: 100,
            scale: 1.15,
            ease: 'none'
        });

        /* --- Parallax Hero Content --- */
        gsap.to('.hero-content', {
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: 80,
            opacity: 0.3,
            ease: 'none'
        });

        /* --- Footer --- */
        gsap.from('.footer-top', {
            scrollTrigger: {
                trigger: '#footer',
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.out'
        });
    }

    /* ==========================================================
       COUNTER ANIMATION
       ========================================================== */
    let countersAnimated = false;

    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;

        document.querySelectorAll('.stat-number').forEach(el => {
            const target = parseInt(el.dataset.count, 10);
            const obj = { val: 0 };

            gsap.to(obj, {
                val: target,
                duration: 2,
                ease: 'power1.out',
                onUpdate: () => {
                    el.textContent = Math.round(obj.val);
                }
            });
        });
    }

    /* ==========================================================
       NAVBAR — Background on scroll + active tracking
       ========================================================== */
    function handleNavScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
        backToTop.classList.toggle('visible', window.scrollY > 600);
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    /* ==========================================================
       MOBILE MENU
       ========================================================== */
    navToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', false);
            document.body.style.overflow = '';
        });
    });

    /* ==========================================================
       PORTFOLIO LIGHTBOX
       ========================================================== */
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (!img) return;
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    /* ==========================================================
       BACK TO TOP
       ========================================================== */
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ==========================================================
       SMOOTH SCROLL for anchor links
       ========================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = navbar.offsetHeight + 20;
            const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ==========================================================
       CONTACT FORM — Basic submission feedback
       ========================================================== */
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.form-submit span');
            const originalText = btn.textContent;
            btn.textContent = 'Message Sent!';
            form.reset();
            
            setTimeout(() => {
                btn.textContent = originalText;
            }, 3000);
        });
    }

    /* ==========================================================
       MAGNETIC HOVER EFFECT on CTA buttons
       ========================================================== */
    document.querySelectorAll('.hero-cta, .form-submit').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, {
                x: x * 0.15,
                y: y * 0.15,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
        });
    });

});
