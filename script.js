/* ======================================================
   WFILMS — Advanced Animations & Interactions Engine
   Custom Cursor, Split Text, 3D Tilt, Horizontal Scroll,
   Particles, Magnetic Hover, Parallax, ScrollTrigger
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;
    const preloader = document.getElementById('preloader');
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    /* ==========================================================
       1. SPLIT TEXT ENGINE
       Wraps each character in a <span class="char">
       ========================================================== */
    function splitTextIntoChars(element) {
        const text = element.textContent;
        element.innerHTML = '';
        element.setAttribute('aria-label', text);

        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.classList.add('char');
            if (text[i] === ' ') {
                span.innerHTML = '&nbsp;';
            } else {
                span.textContent = text[i];
            }
            span.style.setProperty('--i', i);
            element.appendChild(span);
        }

        return element.querySelectorAll('.char');
    }

    // Split all elements with data-split-text
    const splitElements = document.querySelectorAll('[data-split-text]');
    const splitData = [];
    splitElements.forEach(el => {
        const chars = splitTextIntoChars(el);
        splitData.push({ el, chars });
    });

    /* ==========================================================
       2. PRELOADER — SVG Draw + Glitch + Bar + Wipe
       ========================================================== */
    const preloaderTl = gsap.timeline({
        onComplete() {
            gsap.to(preloader, {
                clipPath: 'inset(0 0 100% 0)',
                duration: 0.8,
                ease: 'power3.inOut',
                onComplete() {
                    preloader.style.display = 'none';
                    initPageAnimations();
                }
            });
        }
    });

    // Animate SVG paths drawing on
    document.querySelectorAll('#preloader .logo-path').forEach(path => {
        const len = path.getTotalLength ? path.getTotalLength() : 400;
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
    });

    preloaderTl
        .to('#preloader .logo-path', {
            strokeDashoffset: 0,
            duration: 1.5,
            stagger: 0.1,
            ease: 'power2.inOut'
        })
        .to('.preloader-text', {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        }, '-=0.5')
        .to('.preloader-bar', {
            opacity: 1,
            duration: 0.3
        }, '-=0.2')
        .to('.preloader-bar-fill', {
            width: '100%',
            duration: 1,
            ease: 'power1.inOut'
        })
        .to('.preloader-inner', {
            opacity: 0,
            scale: 0.9,
            duration: 0.4,
            ease: 'power2.in'
        });

    /* ==========================================================
       3. PAGE ANIMATIONS — Called after preloader
       ========================================================== */
    function initPageAnimations() {
        // Hero title chars
        const heroTitleData = splitData.find(d => d.el.classList.contains('hero-title'));
        if (heroTitleData) {
            gsap.to(heroTitleData.chars, {
                opacity: 1,
                y: 0,
                rotateX: 0,
                duration: 1,
                stagger: 0.05,
                ease: 'power3.out',
                delay: 0.1
            });
        }

        // Hero subtitle
        const heroSubData = splitData.find(d => d.el.classList.contains('hero-subtitle'));
        if (heroSubData) {
            gsap.to(heroSubData.chars, {
                opacity: 1,
                duration: 0.6,
                stagger: 0.02,
                ease: 'power2.out',
                delay: 0.6
            });
        }

        // Tagline
        gsap.to('.hero-tagline', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 1
        });

        // CTA
        gsap.to('.hero-cta', {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power2.out',
            delay: 1.2
        });

        // Scroll indicator
        gsap.to('.scroll-indicator', {
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            delay: 1.5
        });

        // Initialize all scroll-based animations
        initScrollAnimations();
    }

    /* ==========================================================
       4. SCROLL-TRIGGERED ANIMATIONS
       ========================================================== */
    function initScrollAnimations() {
        // Section labels [data-reveal]
        document.querySelectorAll('[data-reveal]').forEach(el => {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Section title chars (not hero)
        splitData.forEach(({ el, chars }) => {
            if (el.classList.contains('hero-title') || el.classList.contains('hero-subtitle')) return;

            gsap.to(chars, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.03,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Service cards stagger
        gsap.from('.service-card', {
            y: 80,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.services-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            }
        });

        // About paragraphs
        gsap.utils.toArray('.about-lead, .about-body').forEach(el => {
            gsap.to(el, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Stat items
        gsap.utils.toArray('.stat-item').forEach((el, i) => {
            gsap.to(el, {
                opacity: 1,
                x: 0,
                duration: 0.7,
                delay: i * 0.15,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
        });

        // Contact lead
        gsap.to('.contact-lead', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.contact-lead',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });

        // Horizontal scroll portfolio
        initHorizontalScroll();

        // Counter animation
        initCounters();
    }

    /* ==========================================================
       5. HORIZONTAL SCROLL PORTFOLIO
       ========================================================== */
    function initHorizontalScroll() {
        const track = document.querySelector('.portfolio-track');
        const wrap = document.querySelector('.portfolio-horizontal-wrap');
        const progressBar = document.querySelector('.portfolio-progress-bar');

        if (!track || !wrap) return;

        const cards = track.querySelectorAll('.portfolio-card');
        const totalScrollWidth = track.scrollWidth - wrap.offsetWidth;

        gsap.to(track, {
            x: -totalScrollWidth,
            ease: 'none',
            scrollTrigger: {
                trigger: '#work',
                start: 'top 15%',
                end: () => `+=${totalScrollWidth}`,
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                onUpdate: (self) => {
                    if (progressBar) {
                        progressBar.style.width = `${self.progress * 100}%`;
                    }
                }
            }
        });

        // Stagger card entrance
        cards.forEach((card, i) => {
            gsap.from(card, {
                opacity: 0,
                x: 100,
                rotation: 3,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: card,
                    containerAnimation: gsap.to(track, { x: -totalScrollWidth }),
                    start: 'left 80%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    /* ==========================================================
       6. COUNTER ANIMATION
       ========================================================== */
    function initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const obj = { val: 0 };

            gsap.to(obj, {
                val: target,
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: counter,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                onUpdate() {
                    counter.textContent = Math.round(obj.val);
                }
            });
        });
    }

    /* ==========================================================
       7. CUSTOM CURSOR
       ========================================================== */
    if (!isMobile) {
        const dot = document.querySelector('.cursor-dot');
        const ring = document.querySelector('.cursor-ring');
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        const ringSpeed = 0.15;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            dot.style.left = mouseX + 'px';
            dot.style.top = mouseY + 'px';
        });

        function animateRing() {
            ringX += (mouseX - ringX) * ringSpeed;
            ringY += (mouseY - ringY) * ringSpeed;
            ring.style.left = ringX + 'px';
            ring.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effects on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, [data-magnetic], input, select, textarea');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => {
                dot.classList.add('hovering');
                ring.classList.add('hovering');
            });
            target.addEventListener('mouseleave', () => {
                dot.classList.remove('hovering');
                ring.classList.remove('hovering');
            });
        });
    }

    /* ==========================================================
       8. MAGNETIC HOVER EFFECT
       ========================================================== */
    if (!isMobile) {
        document.querySelectorAll('[data-magnetic]').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const strength = 0.3;

                gsap.to(el, {
                    x: x * strength,
                    y: y * strength,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });

            el.addEventListener('mouseleave', () => {
                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.4)'
                });
            });
        });
    }

    /* ==========================================================
       9. 3D TILT CARDS
       ========================================================== */
    if (!isMobile) {
        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;

                const rotateX = (y - 0.5) * -12;
                const rotateY = (x - 0.5) * 12;

                // Set CSS variable for radial spotlight
                card.style.setProperty('--mouse-x', `${x * 100}%`);
                card.style.setProperty('--mouse-y', `${y * 100}%`);

                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    duration: 0.5,
                    ease: 'power2.out',
                    transformPerspective: 1200
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }

    /* ==========================================================
       10. PARTICLE SYSTEM
       ========================================================== */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = isMobile ? 30 : 70;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.fadeSpeed = Math.random() * 0.005 + 0.002;
                this.growing = Math.random() > 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.growing) {
                    this.opacity += this.fadeSpeed;
                    if (this.opacity >= 0.5) this.growing = false;
                } else {
                    this.opacity -= this.fadeSpeed;
                    if (this.opacity <= 0.05) this.growing = true;
                }

                // Wrap around
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(196, 30, 58, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw connections
            for (let a = 0; a < particles.length; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.strokeStyle = `rgba(196, 30, 58, ${0.05 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* ==========================================================
       11. HERO PARALLAX on Scroll
       ========================================================== */
    gsap.to('.hero-layer--shapes', {
        y: -150,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.to('.hero-logo-wrap', {
        y: -100,
        scale: 0.9,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.to('.hero-content', {
        y: -80,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
            trigger: '#hero',
            start: '30% top',
            end: 'bottom top',
            scrub: true
        }
    });

    /* ==========================================================
       12. MOUSE PARALLAX on Hero (Desktop only)
       ========================================================== */
    if (!isMobile) {
        const heroSection = document.getElementById('hero');
        const shapesLayer = document.querySelector('.hero-layer--shapes');
        const logoWrap = document.querySelector('.hero-logo-wrap');

        heroSection.addEventListener('mousemove', (e) => {
            const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
            const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

            gsap.to(shapesLayer, {
                x: xPercent * 30,
                y: yPercent * 20,
                duration: 1,
                ease: 'power2.out'
            });

            gsap.to(logoWrap, {
                x: xPercent * -15,
                y: yPercent * -10,
                duration: 1.2,
                ease: 'power2.out'
            });
        });
    }

    /* ==========================================================
       13. NAVBAR — Hide/Show on Scroll + Glassmorphism
       ========================================================== */
    let lastScrollY = 0;
    const scrollThreshold = 80;

    function handleNavScroll() {
        const currentY = window.scrollY;

        // Add glass effect
        if (currentY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show on scroll direction
        if (currentY > lastScrollY && currentY > scrollThreshold) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }

        lastScrollY = currentY;
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    /* ==========================================================
       14. MOBILE MENU
       ========================================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
            navToggle.setAttribute('aria-expanded',
                navToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ==========================================================
       15. BACK TO TOP
       ========================================================== */
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ==========================================================
       16. SMOOTH SCROLL for anchor links
       ========================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const offset = 80; // navbar height
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ==========================================================
       17. CONTACT FORM
       ========================================================== */
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.form-submit span');
            const originalText = btn.textContent;
            btn.textContent = 'Sent!';
            gsap.to(btn, {
                color: '#C41E3A',
                duration: 0.3
            });
            setTimeout(() => {
                btn.textContent = originalText;
                gsap.to(btn, { color: '', duration: 0.3 });
                form.reset();
            }, 2500);
        });
    }

    /* ==========================================================
       18. SCROLL VELOCITY — Grain Intensity
       ========================================================== */
    const grainOverlay = document.querySelector('.grain-overlay');
    let scrollVelocity = 0;
    let lastScrollPos = 0;

    function updateGrainIntensity() {
        const currentPos = window.scrollY;
        scrollVelocity = Math.abs(currentPos - lastScrollPos);
        lastScrollPos = currentPos;

        // Map velocity to opacity: base 0.035, max ~0.12
        const intensity = Math.min(0.035 + scrollVelocity * 0.003, 0.12);
        if (grainOverlay) {
            grainOverlay.style.opacity = intensity;
        }

        requestAnimationFrame(updateGrainIntensity);
    }
    updateGrainIntensity();

    /* ==========================================================
       19. MARQUEE SPEED on Scroll
       ========================================================== */
    const marquees = document.querySelectorAll('.marquee-track');
    window.addEventListener('scroll', () => {
        const velocity = Math.abs(window.scrollY - lastScrollPos);
        const speedBoost = Math.min(velocity * 0.5, 50);

        marquees.forEach(track => {
            track.style.animationDuration = Math.max(10, 25 - speedBoost) + 's';
        });
    }, { passive: true });

});
