/* ======================================================
   WOLLENBURG MEDIA — Animation Engine v2.2
   Particle Canvas, Parallax 3D Camera, Lenis Smooth Scroll,
   GSAP ScrollTrigger, Crosshair Cursor
   ====================================================== */

document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);

    const isMobile = window.innerWidth < 768;
    const preloader = document.getElementById('preloader');
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    /* ==========================================================
       1. LENIS SMOOTH SCROLL
       ========================================================== */
    let lenis;
    if (!isMobile) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
    }

    /* ==========================================================
       2. SPLIT TEXT ENGINE
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

    const splitElements = document.querySelectorAll('[data-split-text]');
    const splitData = [];
    splitElements.forEach(el => {
        const chars = splitTextIntoChars(el);
        splitData.push({ el, chars });
    });

    /* ==========================================================
       3. PRELOADER — SVG Draw + Character Stagger + Glitch
       ========================================================== */
    document.querySelectorAll('#preloader .logo-path').forEach(path => {
        const len = path.getTotalLength ? path.getTotalLength() : 400;
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
    });

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

    preloaderTl
        // Draw the SVG logo
        .to('#preloader .logo-path', {
            strokeDashoffset: 0,
            duration: 1.2,
            stagger: 0.08,
            ease: 'power2.inOut'
        })
        // Then flash the logo briefly to accent color
        .to('#preloader .logo-path', {
            stroke: '#C41E3A',
            duration: 0.15,
            ease: 'none'
        })
        .to('#preloader .logo-path', {
            stroke: '#ffffff',
            duration: 0.15,
            ease: 'none'
        })
        // All text appears at once
        .to('.preloader-text-char', {
            opacity: 1,
            y: '0%',
            rotateX: 0,
            duration: 0.6,
            stagger: 0,
            ease: 'back.out(1.7)'
        }, '-=0.1')
        // "MEDIA" subtitle appears simultaneously
        .to('.preloader-sub', {
            opacity: 1,
            y: 0,
            scaleX: 1,
            duration: 0.5,
            ease: 'power2.out'
        }, '<')
        // Bar
        .to('.preloader-bar', {
            opacity: 1,
            duration: 0.2
        }, '-=0.1')
        .to('.preloader-bar-fill', {
            width: '100%',
            duration: 0.8,
            ease: 'power1.inOut'
        })
        // Fade out
        .to('.preloader-inner', {
            opacity: 0,
            scale: 0.9,
            duration: 0.4,
            ease: 'power2.in'
        });

    /* ==========================================================
       4. HERO PARTICLE CANVAS — Floating connected particles
       ========================================================== */
    function initHeroParticles() {
        const canvas = document.getElementById('hero-particles');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let w, h;
        let particles = [];
        const particleCount = isMobile ? 40 : 80;
        const connectionDistance = isMobile ? 100 : 150;
        let mouseParticle = { x: -1000, y: -1000 };

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // Track mouse for interaction
        if (!isMobile) {
            document.getElementById('hero').addEventListener('mousemove', (e) => {
                mouseParticle.x = e.clientX;
                mouseParticle.y = e.clientY;
            });
        }

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.4 + 0.1
            });
        }

        function animate() {
            ctx.clearRect(0, 0, w, h);

            // Update and draw particles
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;

                // Mouse repulsion
                if (!isMobile) {
                    const dx = p.x - mouseParticle.x;
                    const dy = p.y - mouseParticle.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        const force = (120 - dist) / 120;
                        p.vx += (dx / dist) * force * 0.3;
                        p.vy += (dy / dist) * force * 0.3;
                    }
                }

                // Damping
                p.vx *= 0.99;
                p.vy *= 0.99;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(196, 30, 58, ${p.opacity})`;
                ctx.fill();

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const alpha = (1 - dist / connectionDistance) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(196, 30, 58, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }

                // Mouse connections
                if (!isMobile) {
                    const mdx = p.x - mouseParticle.x;
                    const mdy = p.y - mouseParticle.y;
                    const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (mdist < 200) {
                        const alpha = (1 - mdist / 200) * 0.2;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mouseParticle.x, mouseParticle.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }
        animate();
    }

    initHeroParticles();

    /* ==========================================================
       5. HERO — 3D PARALLAX CAMERA (AE-style scroll depth)
       ========================================================== */
    function initHeroParallax() {
        const layers = document.querySelectorAll('.hero-depth-layer');

        layers.forEach(layer => {
            const depth = parseFloat(layer.getAttribute('data-depth')) || 0.5;
            const yAmount = depth * 300;
            const scaleEnd = 1 + depth * 0.15;

            gsap.to(layer, {
                y: -yAmount,
                scale: scaleEnd,
                opacity: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // Hero content parallax
        gsap.to('.hero-content', {
            y: -120,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: '15% top',
                end: '85% top',
                scrub: true
            }
        });

        // Watermark parallax
        gsap.to('.hero-watermark', {
            y: -80,
            scale: 0.85,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // Scroll indicator fade
        gsap.to('.scroll-indicator', {
            opacity: 0,
            y: -20,
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero',
                start: '5% top',
                end: '25% top',
                scrub: true
            }
        });

        // Mouse parallax for depth layers (desktop)
        if (!isMobile) {
            const heroSection = document.getElementById('hero');
            let targetMX = 0, targetMY = 0;
            let currentMX = 0, currentMY = 0;

            heroSection.addEventListener('mousemove', (e) => {
                targetMX = (e.clientX / window.innerWidth - 0.5) * 2;
                targetMY = (e.clientY / window.innerHeight - 0.5) * 2;
            });

            function updateMouseParallax() {
                currentMX += (targetMX - currentMX) * 0.05;
                currentMY += (targetMY - currentMY) * 0.05;

                layers.forEach(layer => {
                    const depth = parseFloat(layer.getAttribute('data-depth')) || 0.5;
                    const moveX = currentMX * depth * 25;
                    const moveY = currentMY * depth * 15;
                    layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });

                requestAnimationFrame(updateMouseParallax);
            }
            updateMouseParallax();
        }
    }

    /* ==========================================================
       6. PAGE ANIMATIONS — After preloader
       ========================================================== */
    function initPageAnimations() {
        // Hero label
        gsap.to('.hero-label', {
            opacity: 1, y: 0,
            duration: 0.8, ease: 'power2.out', delay: 0.1
        });

        // Hero title chars — animate like preloader (all at once, no stagger)
        const heroTitleData = splitData.find(d => d.el.classList.contains('hero-title'));
        if (heroTitleData) {
            gsap.to(heroTitleData.chars, {
                opacity: 1, y: 0, rotateX: 0,
                duration: 0.6, stagger: 0,
                ease: 'back.out(1.7)', delay: 0.2
            });
        }

        // "MEDIA" subtitle chars — same animation, all at once simultaneously
        const heroSubChars = document.querySelectorAll('.hero-sub-char');
        if (heroSubChars.length) {
            gsap.to(heroSubChars, {
                opacity: 1, y: 0, rotateX: 0,
                duration: 0.6, stagger: 0,
                ease: 'back.out(1.7)', delay: 0.2
            });
        }

        // Tagline
        gsap.to('.hero-tagline', {
            opacity: 1, y: 0,
            duration: 0.8, ease: 'power2.out', delay: 1.0
        });

        gsap.to('.tagline-word', {
            opacity: 1, y: 0,
            duration: 0.6, stagger: 0.1,
            ease: 'power2.out', delay: 1.1
        });

        // Description
        gsap.to('.hero-description', {
            opacity: 1, y: 0,
            duration: 0.7, ease: 'power2.out', delay: 1.3
        });

        // CTA
        gsap.to('.hero-cta', {
            opacity: 1, y: 0,
            duration: 0.7, ease: 'power2.out', delay: 1.5
        });

        // Scroll indicator
        gsap.to('.scroll-indicator', {
            opacity: 1,
            duration: 0.6, ease: 'power2.out', delay: 1.8
        });

        // Start scroll systems
        initHeroParallax();
        initScrollAnimations();
    }

    /* ==========================================================
       7. SCROLL-TRIGGERED ANIMATIONS
       ========================================================== */
    function initScrollAnimations() {
        // Section labels [data-reveal]
        document.querySelectorAll('[data-reveal]').forEach(el => {
            if (el.closest('#hero')) return;
            gsap.to(el, {
                opacity: 1, y: 0,
                duration: 0.8, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
            });
        });

        // Section title chars
        splitData.forEach(({ el, chars }) => {
            if (el.classList.contains('hero-title')) return;
            gsap.to(chars, {
                opacity: 1, y: 0, rotateX: 0,
                duration: 0.7, stagger: 0.03, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
            });
        });

        // Service cards
        gsap.utils.toArray('.service-card').forEach((card, i) => {
            gsap.to(card, {
                y: 0, opacity: 1,
                duration: 0.9, delay: i * 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }
            });
        });

        // Portfolio items
        gsap.utils.toArray('.portfolio-item').forEach(item => {
            gsap.to(item, {
                y: 0, opacity: 1,
                duration: 1, ease: 'power3.out',
                scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' }
            });
        });

        // About text
        gsap.utils.toArray('.about-lead, .about-body').forEach(el => {
            gsap.to(el, {
                opacity: 1, y: 0,
                duration: 0.8, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
            });
        });

        // Stats
        gsap.utils.toArray('.stat-item').forEach((el, i) => {
            gsap.to(el, {
                opacity: 1, x: 0,
                duration: 0.8, delay: i * 0.15, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
            });
        });

        // Contact lead
        gsap.to('.contact-lead', {
            opacity: 1, y: 0,
            duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: '.contact-lead', start: 'top 85%', toggleActions: 'play none none none' }
        });

        // Showreel section
        gsap.to('.showreel-label', {
            opacity: 1, y: 0,
            duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: '#showreel', start: 'top 60%', toggleActions: 'play none none none' }
        });

        gsap.to('.showreel-sub', {
            opacity: 1, y: 0,
            duration: 0.8, ease: 'power2.out', delay: 0.2,
            scrollTrigger: { trigger: '#showreel', start: 'top 60%', toggleActions: 'play none none none' }
        });

        gsap.to('.showreel-play-btn', {
            opacity: 1, y: 0,
            duration: 0.8, ease: 'power2.out', delay: 0.4,
            scrollTrigger: { trigger: '#showreel', start: 'top 60%', toggleActions: 'play none none none' }
        });

        initCounters();
    }

    /* ==========================================================
       8. COUNTER ANIMATION
       ========================================================== */
    function initCounters() {
        document.querySelectorAll('[data-count]').forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const obj = { val: 0 };
            gsap.to(obj, {
                val: target, duration: 2.5, ease: 'power2.out',
                scrollTrigger: { trigger: counter, start: 'top 85%', toggleActions: 'play none none none' },
                onUpdate() { counter.textContent = Math.round(obj.val); }
            });
        });
    }

    /* ==========================================================
       9. CUSTOM CURSOR — Crosshair
       ========================================================== */
    if (!isMobile) {
        const cursor = document.querySelector('.cursor-crosshair');
        let cursorX = 0, cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
        });

        // Use event delegation so ALL interactive elements get hover effect
        const hoverSelectors = 'a, button, [data-magnetic], input, select, textarea, .service-card, .portfolio-item, .service-project, .lightbox-close, [data-href]';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverSelectors)) {
                cursor.classList.add('hovering');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverSelectors)) {
                cursor.classList.remove('hovering');
            }
        });
    }

    /* ==========================================================
       SERVICE CARD FULL-CLICK NAVIGATION — Smooth page transition
       ========================================================== */
    const pageTransitionOverlay = document.querySelector('.page-transition-overlay');

    function navigateWithTransition(url) {
        if (!pageTransitionOverlay) {
            window.location.href = url;
            return;
        }
        // Animate the wipe overlay in
        gsap.to(pageTransitionOverlay, {
            clipPath: 'inset(0 0 0 0)',
            duration: 0.6,
            ease: 'power3.inOut',
            onComplete() {
                window.location.href = url;
            }
        });
    }

    document.querySelectorAll('.service-card[data-href]').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't double-navigate if they clicked the inner <a> link
            if (e.target.closest('a')) return;
            e.preventDefault();
            navigateWithTransition(card.getAttribute('data-href'));
        });
    });

    /* ==========================================================
       10. MAGNETIC HOVER — Nav links only (NOT submit button)
       ========================================================== */
    if (!isMobile) {
        document.querySelectorAll('[data-magnetic]').forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
            });

            el.addEventListener('mouseleave', () => {
                gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
            });
        });
    }

    /* ==========================================================
       11. SERVICE CARD HOVER — Radial spotlight
       ========================================================== */
    if (!isMobile) {
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                card.style.setProperty('--mouse-x', `${x * 100}%`);
                card.style.setProperty('--mouse-y', `${y * 100}%`);
            });
        });
    }

    /* ==========================================================
       12. NAVBAR
       ========================================================== */
    let lastScrollY = 0;
    function handleNavScroll() {
        const currentY = window.scrollY;
        if (currentY > 50) { navbar.classList.add('scrolled'); }
        else { navbar.classList.remove('scrolled'); }
        if (currentY > lastScrollY && currentY > 80) { navbar.classList.add('hidden'); }
        else { navbar.classList.remove('hidden'); }
        lastScrollY = currentY;
    }
    window.addEventListener('scroll', handleNavScroll, { passive: true });

    /* ==========================================================
       13. MOBILE MENU
       ========================================================== */
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('open');
            document.body.classList.toggle('menu-open');
            navToggle.setAttribute('aria-expanded',
                navToggle.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('open');
                document.body.classList.remove('menu-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ==========================================================
       14. BACK TO TOP
       ========================================================== */
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) { backToTop.classList.add('visible'); }
        else { backToTop.classList.remove('visible'); }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        if (lenis) { lenis.scrollTo(0, { duration: 2 }); }
        else { window.scrollTo({ top: 0, behavior: 'smooth' }); }
    });

    /* ==========================================================
       15. SMOOTH SCROLL — Anchor links
       ========================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const offset = 80;
                if (lenis) { lenis.scrollTo(target, { offset: -offset, duration: 1.5 }); }
                else {
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    });

    /* ==========================================================
       16. CONTACT FORM — Google Sheets Submission
       ========================================================== */
    // Replace this URL with your deployed Google Apps Script Web App URL
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyy8ZI3rItBS8wOVDvkwslXWVh4YitCvwYvtHpgbWqNBvaFFg_kbrtRVQSwXETnInBQqA/exec';

    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (form) {
        // Select element: add has-value class when a real option is selected
        const selectEl = document.getElementById('form-service');
        if (selectEl) {
            selectEl.addEventListener('change', () => {
                if (selectEl.value) {
                    selectEl.classList.add('has-value');
                } else {
                    selectEl.classList.remove('has-value');
                }
            });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Honeypot check
            const honeypot = form.querySelector('[name="honeypot"]');
            if (honeypot && honeypot.value) return;

            const btn = form.querySelector('.form-submit span');
            const submitBtn = form.querySelector('.form-submit');
            const originalText = btn.textContent;

            // Collect form data
            const formData = {
                name: form.querySelector('[name="name"]').value.trim(),
                email: form.querySelector('[name="email"]').value.trim(),
                service: form.querySelector('[name="service"]').value,
                message: form.querySelector('[name="message"]').value.trim()
            };

            // Basic validation
            if (!formData.name || !formData.email || !formData.service || !formData.message) {
                formStatus.textContent = 'Please fill in all fields.';
                formStatus.className = 'form-status error';
                return;
            }

            // Loading state
            btn.textContent = 'Sending...';
            submitBtn.disabled = true;
            formStatus.textContent = 'Submitting your message...';
            formStatus.className = 'form-status loading';

            // If Google Script URL is configured, POST to it
            if (GOOGLE_SCRIPT_URL) {
                try {
                    // Use URLSearchParams — reliable format for Apps Script's e.parameter
                    const submitData = new URLSearchParams();
                    submitData.append('name', formData.name);
                    submitData.append('email', formData.email);
                    submitData.append('service', formData.service);
                    submitData.append('message', formData.message);

                    const response = await fetch(GOOGLE_SCRIPT_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: submitData.toString()
                    });

                    // no-cors mode returns opaque response, so we assume success
                    btn.textContent = 'Sent!';
                    gsap.to(submitBtn, { borderColor: '#2ecc71', duration: 0.3 });
                    gsap.to(btn, { color: '#2ecc71', duration: 0.3 });
                    formStatus.textContent = 'Message sent successfully! We\'ll be in touch soon.';
                    formStatus.className = 'form-status success';
                    form.reset();
                    if (selectEl) selectEl.classList.remove('has-value');
                } catch (err) {
                    btn.textContent = 'Error';
                    gsap.to(submitBtn, { borderColor: '#C41E3A', duration: 0.3 });
                    gsap.to(btn, { color: '#C41E3A', duration: 0.3 });
                    formStatus.textContent = 'Something went wrong. Please try again or email us directly.';
                    formStatus.className = 'form-status error';
                }
            } else {
                // Fallback: open mailto link with form data
                const subject = encodeURIComponent(`New inquiry from ${formData.name} — ${formData.service}`);
                const body = encodeURIComponent(
                    `Name: ${formData.name}\nEmail: ${formData.email}\nService: ${formData.service}\n\nMessage:\n${formData.message}`
                );
                window.location.href = `mailto:wollenburgfilms@gmail.com?subject=${subject}&body=${body}`;

                btn.textContent = 'Sent!';
                gsap.to(submitBtn, { borderColor: '#2ecc71', duration: 0.3 });
                gsap.to(btn, { color: '#2ecc71', duration: 0.3 });
                formStatus.textContent = 'Opening your email client...';
                formStatus.className = 'form-status success';
                form.reset();
                if (selectEl) selectEl.classList.remove('has-value');
            }

            // Reset button after delay
            setTimeout(() => {
                btn.textContent = originalText;
                gsap.to(btn, { color: '', duration: 0.3 });
                gsap.to(submitBtn, { borderColor: '', duration: 0.3 });
                submitBtn.disabled = false;
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 4000);
        });
    }

    /* ==========================================================
       17. GRAIN INTENSITY
       ========================================================== */
    const grainOverlay = document.querySelector('.grain-overlay');
    let grainScrollPos = 0;

    function updateGrain() {
        const currentPos = window.scrollY;
        const velocity = Math.abs(currentPos - grainScrollPos);
        grainScrollPos = currentPos;
        const intensity = Math.min(0.035 + velocity * 0.003, 0.12);
        if (grainOverlay) grainOverlay.style.opacity = intensity;
        requestAnimationFrame(updateGrain);
    }
    updateGrain();

    /* ==========================================================
       18. MARQUEE — GSAP-driven (no CSS animation stutter)
       ========================================================== */
    document.querySelectorAll('.marquee-track').forEach(track => {
        track.style.animation = 'none';

        const isReverse = track.closest('.marquee-reverse');
        const speed = 80;
        const items = track.innerHTML;
        track.innerHTML = items + items;
        const totalWidth = track.scrollWidth / 2;

        if (isReverse) {
            gsap.set(track, { x: -totalWidth });
            gsap.to(track, { x: 0, duration: totalWidth / speed, ease: 'none', repeat: -1 });
        } else {
            gsap.to(track, { x: -totalWidth, duration: totalWidth / speed, ease: 'none', repeat: -1 });
        }
    });

    /* ==========================================================
       19. PORTFOLIO HOVER PARALLAX
       ========================================================== */
    if (!isMobile) {
        document.querySelectorAll('.portfolio-item').forEach(item => {
            const img = item.querySelector('.portfolio-item-img img');
            if (!img) return;

            item.addEventListener('mousemove', (e) => {
                const rect = item.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                gsap.to(img, { x: x * 20, y: y * 20, duration: 0.6, ease: 'power2.out' });
            });

            item.addEventListener('mouseleave', () => {
                gsap.to(img, { x: 0, y: 0, duration: 0.8, ease: 'power2.out' });
            });
        });
    }

    /* ==========================================================
       20. PORTFOLIO LIGHTBOX
       ========================================================== */
    const lightbox = document.getElementById('portfolio-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
    const lightboxVideo = lightbox ? lightbox.querySelector('.lightbox-video') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const lightboxBackdrop = lightbox ? lightbox.querySelector('.lightbox-backdrop') : null;

    function openLightbox(type, src, title, description) {
        if (!lightbox) return;

        // Hide both, then show the right one
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'none';

        // Update lightbox info panel
        const lightboxTitle = lightbox.querySelector('.lightbox-title');
        const lightboxDesc = lightbox.querySelector('.lightbox-desc');
        if (lightboxTitle) lightboxTitle.textContent = title || '';
        if (lightboxDesc) lightboxDesc.textContent = description || '';
        const infoPanel = lightbox.querySelector('.lightbox-info');
        if (infoPanel) infoPanel.style.display = (title || description) ? 'block' : 'none';

        if (type === 'video') {
            lightboxVideo.src = src;
            lightboxVideo.style.display = 'block';
            lightboxVideo.play();
        } else {
            lightboxImg.src = src;
            lightboxImg.style.display = 'block';
        }

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;

        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Stop video if playing
        if (lightboxVideo) {
            lightboxVideo.pause();
            lightboxVideo.src = '';
        }
    }

    // Click on portfolio items to open lightbox
    document.querySelectorAll('.portfolio-item[data-type]').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.getAttribute('data-type');
            const src = item.getAttribute('data-media-src');
            const title = item.getAttribute('data-title') || item.querySelector('.portfolio-title')?.textContent || '';
            const description = item.getAttribute('data-description') || item.querySelector('.portfolio-excerpt')?.textContent || '';
            if (type && src) openLightbox(type, src, title, description);
        });
    });

    // Close lightbox
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    /* ==========================================================
       21. SHOWREEL PLAY BUTTON
       ========================================================== */
    const showreelPlayBtn = document.getElementById('showreel-play');
    const showreelVideo = document.querySelector('.showreel-video');
    const showreelOverlay = document.querySelector('.showreel-overlay');
    const showreelContent = document.querySelector('.showreel-content');

    if (showreelPlayBtn && showreelVideo) {
        showreelPlayBtn.addEventListener('click', () => {
            // Unmute and play
            showreelVideo.muted = false;
            showreelVideo.currentTime = 0;
            showreelVideo.play();

            // Fade out the black tint overlay and content
            if (showreelOverlay) {
                gsap.to(showreelOverlay, { opacity: 0, duration: 0.6, ease: 'power2.out' });
            }
            if (showreelContent) {
                gsap.to(showreelContent, { opacity: 0, duration: 0.4, ease: 'power2.out', pointerEvents: 'none' });
            }
            // Remove the darkening filter from the video
            gsap.to(showreelVideo, { filter: 'brightness(1) contrast(1)', duration: 0.6, ease: 'power2.out' });

            // Request fullscreen
            if (showreelVideo.requestFullscreen) {
                showreelVideo.requestFullscreen();
            } else if (showreelVideo.webkitRequestFullscreen) {
                showreelVideo.webkitRequestFullscreen();
            } else if (showreelVideo.webkitEnterFullScreen) {
                showreelVideo.webkitEnterFullScreen();
            }
        });

        // Re-mute and restore tint when exiting fullscreen
        function restoreShowreel() {
            showreelVideo.muted = true;
            if (showreelOverlay) {
                gsap.to(showreelOverlay, { opacity: 1, duration: 0.5, ease: 'power2.inOut' });
            }
            if (showreelContent) {
                gsap.to(showreelContent, { opacity: 1, duration: 0.5, ease: 'power2.inOut', pointerEvents: 'auto' });
            }
            gsap.to(showreelVideo, { filter: 'brightness(0.5) contrast(1.15)', duration: 0.5, ease: 'power2.inOut' });
        }
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) restoreShowreel();
        });
        document.addEventListener('webkitfullscreenchange', () => {
            if (!document.webkitFullscreenElement) restoreShowreel();
        });
    }

    /* ==========================================================
       22. SHOWREEL AUTOPLAY ON SCROLL — first pixel visible
       ========================================================== */
    if (showreelVideo) {
        const showreelSection = document.getElementById('showreel');
        if (showreelSection) {
            const showreelObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        showreelVideo.play().catch(() => { });
                    } else {
                        showreelVideo.pause();
                    }
                });
            }, { threshold: 0 });
            showreelObserver.observe(showreelSection);
        }
    }

});
