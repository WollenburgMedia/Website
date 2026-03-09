/* ======================================================
   WOLLENBURG MEDIA — Shared Module
   Lenis, Page Transitions, Lightbox + Gallery, 
   Contact Form, Mobile Menu, Scroll Animations
   ====================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;

    /* ==========================================================
       1. LENIS SMOOTH SCROLL
       ========================================================== */
    let lenis;
    if (!isMobile) {
        lenis = new Lenis({
            duration: 1.2,
            easing(t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
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
       2. SUBPAGE PRELOADER
       ========================================================== */
    const subpagePreloader = document.getElementById('subpage-preloader');
    if (subpagePreloader) {
        const preloaderTl = gsap.timeline({
            onComplete() {
                subpagePreloader.style.display = 'none';
                document.body.classList.remove('preloader-active');
            }
        });

        // Draw SVG logo
        const logoPaths = subpagePreloader.querySelectorAll('.logo-path');
        logoPaths.forEach(path => {
            const len = path.getTotalLength ? path.getTotalLength() : 400;
            path.style.strokeDasharray = len;
            path.style.strokeDashoffset = len;
        });

        preloaderTl
            .to(logoPaths, {
                strokeDashoffset: 0,
                duration: 0.6,
                stagger: 0.04,
                ease: 'power2.inOut'
            })
            .to('.subpage-preloader-text', {
                opacity: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            }, '-=0.2')
            .to(subpagePreloader, {
                opacity: 0,
                duration: 0.4,
                ease: 'power2.in',
                delay: 0.15
            });
    }

    /* ==========================================================
       3. PAGE TRANSITION — Enter animation
       ========================================================== */
    const pageTransitionOverlay = document.querySelector('.page-transition-overlay');
    if (pageTransitionOverlay) {
        pageTransitionOverlay.style.clipPath = 'inset(0 0 0 0)';
        gsap.to(pageTransitionOverlay, {
            clipPath: 'inset(0 100% 0 0)',
            duration: 0.7,
            ease: 'power4.inOut',
            delay: 0.1,
            onComplete() {
                pageTransitionOverlay.style.pointerEvents = 'none';
            }
        });
    }

    function navigateWithTransition(url) {
        if (!pageTransitionOverlay) { window.location.href = url; return; }
        const tl = gsap.timeline();
        tl.to('body', { opacity: 0.6, scale: 0.98, duration: 0.3, ease: 'power2.in' })
            .to(pageTransitionOverlay, {
                clipPath: 'inset(0 0 0 0)',
                duration: 0.7,
                ease: 'power4.inOut',
                onComplete() { window.location.href = url; }
            }, '-=0.1');
    }

    // Back-to-home and logo links use transition
    document.querySelectorAll('.service-back, .nav-logo').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateWithTransition(link.getAttribute('href'));
        });
    });

    /* ==========================================================
       4. MOBILE MENU
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
       5. LIGHTBOX — Photo, Video, YouTube + Gallery Mode
       ========================================================== */
    const lightbox = document.getElementById('portfolio-lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
    const lightboxVideo = lightbox ? lightbox.querySelector('.lightbox-video') : null;
    const lightboxIframeWrap = lightbox ? lightbox.querySelector('.lightbox-iframe-wrap') : null;
    const lightboxYoutube = lightbox ? lightbox.querySelector('.lightbox-youtube') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
    const lightboxBackdrop = lightbox ? lightbox.querySelector('.lightbox-backdrop') : null;
    const lightboxPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
    const lightboxNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
    const lightboxCounter = lightbox ? lightbox.querySelector('.lightbox-counter') : null;

    // Gallery state
    let galleryImages = [];
    let galleryIndex = 0;

    function showGalleryImage(index) {
        if (!galleryImages.length || !lightboxImg) return;
        galleryIndex = index;
        lightboxImg.src = galleryImages[galleryIndex];
        if (lightboxCounter) {
            lightboxCounter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
        }
    }

    function openLightbox(type, src, title, description, gallery) {
        if (!lightbox) return;

        // Hide all media types
        if (lightboxImg) lightboxImg.style.display = 'none';
        if (lightboxVideo) lightboxVideo.style.display = 'none';
        if (lightboxIframeWrap) lightboxIframeWrap.style.display = 'none';
        if (lightboxYoutube) lightboxYoutube.src = '';

        // Reset gallery
        galleryImages = [];
        galleryIndex = 0;
        if (lightboxPrev) lightboxPrev.style.display = 'none';
        if (lightboxNext) lightboxNext.style.display = 'none';
        if (lightboxCounter) lightboxCounter.style.display = 'none';

        // Update lightbox info panel
        const lightboxTitle = lightbox.querySelector('.lightbox-title');
        const lightboxDesc = lightbox.querySelector('.lightbox-desc');
        if (lightboxTitle) lightboxTitle.textContent = title || '';
        if (lightboxDesc) lightboxDesc.textContent = description || '';
        const infoPanel = lightbox.querySelector('.lightbox-info');
        if (infoPanel) infoPanel.style.display = (title || description) ? 'flex' : 'none';

        if (type === 'youtube') {
            const ytSrc = src + (src.includes('?') ? '&' : '?') + 'autoplay=1&rel=0&modestbranding=1';
            if (lightboxYoutube) lightboxYoutube.src = ytSrc;
            if (lightboxIframeWrap) lightboxIframeWrap.style.display = 'block';
            // Remove gallery class
            lightbox.classList.remove('lightbox--gallery');
        } else if (type === 'video') {
            lightboxVideo.src = src;
            lightboxVideo.style.display = 'block';
            lightboxVideo.play();
            lightbox.classList.remove('lightbox--gallery');
        } else if (type === 'gallery' && gallery && gallery.length) {
            // Gallery mode
            galleryImages = gallery;
            lightboxImg.style.display = 'block';
            showGalleryImage(0);
            if (lightboxPrev) lightboxPrev.style.display = 'flex';
            if (lightboxNext) lightboxNext.style.display = 'flex';
            if (lightboxCounter) lightboxCounter.style.display = 'block';
            lightbox.classList.add('lightbox--gallery');
        } else {
            lightboxImg.src = src;
            lightboxImg.style.display = 'block';
            lightbox.classList.remove('lightbox--gallery');
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
        if (lightboxVideo) { lightboxVideo.pause(); lightboxVideo.src = ''; }
        if (lightboxYoutube) { lightboxYoutube.src = ''; }
        galleryImages = [];
    }

    // Gallery navigation
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            if (galleryImages.length) {
                showGalleryImage((galleryIndex - 1 + galleryImages.length) % galleryImages.length);
            }
        });
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', (e) => {
            e.stopPropagation();
            if (galleryImages.length) {
                showGalleryImage((galleryIndex + 1) % galleryImages.length);
            }
        });
    }

    // Click on portfolio items (main page)
    document.querySelectorAll('.portfolio-item[data-type]').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.getAttribute('data-type');
            const src = item.getAttribute('data-media-src');
            const title = item.getAttribute('data-title') || item.querySelector('.portfolio-title')?.textContent || '';
            const description = item.getAttribute('data-description') || item.querySelector('.portfolio-excerpt')?.textContent || '';

            // Check for gallery data
            const galleryAttr = item.getAttribute('data-gallery');
            if (galleryAttr) {
                const gallery = galleryAttr.split(',').map(s => s.trim());
                openLightbox('gallery', src, title, description, gallery);
            } else if (type && src) {
                openLightbox(type, src, title, description);
            }
        });
    });

    // Click on service-page project items
    document.querySelectorAll('.service-project[data-type]').forEach(item => {
        item.addEventListener('click', () => {
            const type = item.getAttribute('data-type');
            const src = item.getAttribute('data-media-src');
            const title = item.getAttribute('data-title') || '';
            const description = item.getAttribute('data-description') || '';
            if (type && src) openLightbox(type, src, title, description);
        });
    });

    // Close lightbox
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && galleryImages.length) {
            showGalleryImage((galleryIndex - 1 + galleryImages.length) % galleryImages.length);
        }
        if (e.key === 'ArrowRight' && galleryImages.length) {
            showGalleryImage((galleryIndex + 1) % galleryImages.length);
        }
    });

    /* ==========================================================
       6. CONTACT FORM — Google Sheets Submission
       ========================================================== */
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyy8ZI3rItBS8wOVDvkwslXWVh4YitCvwYvtHpgbWqNBvaFFg_kbrtRVQSwXETnInBQqA/exec';
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (form) {
        const selectEl = document.getElementById('form-service');
        if (selectEl) {
            // Pre-selected values
            if (selectEl.value) selectEl.classList.add('has-value');
            selectEl.addEventListener('change', () => {
                if (selectEl.value) selectEl.classList.add('has-value');
                else selectEl.classList.remove('has-value');
            });
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const honeypot = form.querySelector('[name="honeypot"]');
            if (honeypot && honeypot.value) return;

            const btn = form.querySelector('.form-submit span');
            const submitBtn = form.querySelector('.form-submit');
            const originalText = btn.textContent;

            const formData = {
                name: form.querySelector('[name="name"]').value.trim(),
                email: form.querySelector('[name="email"]').value.trim(),
                service: form.querySelector('[name="service"]').value,
                message: form.querySelector('[name="message"]').value.trim()
            };

            if (!formData.name || !formData.email || !formData.service || !formData.message) {
                formStatus.textContent = 'Please fill in all fields.';
                formStatus.className = 'form-status error';
                return;
            }

            btn.textContent = 'Sending...';
            submitBtn.disabled = true;
            formStatus.textContent = 'Submitting your message...';
            formStatus.className = 'form-status loading';

            try {
                const submitData = new URLSearchParams();
                submitData.append('name', formData.name);
                submitData.append('email', formData.email);
                submitData.append('service', formData.service);
                submitData.append('message', formData.message);

                await fetch(GOOGLE_SCRIPT_URL, {
                    method: 'POST', mode: 'no-cors',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: submitData.toString()
                });

                btn.textContent = 'Sent!';
                formStatus.textContent = "Message sent successfully! We'll be in touch soon.";
                formStatus.className = 'form-status success';
                form.reset();
                if (selectEl) selectEl.classList.remove('has-value');
            } catch (err) {
                btn.textContent = 'Error';
                formStatus.textContent = 'Something went wrong. Please try again or email us directly.';
                formStatus.className = 'form-status error';
            }

            setTimeout(() => {
                btn.textContent = originalText;
                submitBtn.disabled = false;
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 4000);
        });
    }

    /* ==========================================================
       7. SMOOTH SCROLL — Anchor links
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
       8. SCROLL-TRIGGERED REVEALS FOR SUB-PAGES
       ========================================================== */
    // Animate elements with data-reveal attribute
    document.querySelectorAll('[data-reveal]').forEach(el => {
        gsap.to(el, {
            opacity: 1, y: 0,
            duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
        });
    });

    // Animate process steps
    gsap.utils.toArray('.process-step').forEach((step, i) => {
        gsap.fromTo(step,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0,
                duration: 0.7, delay: i * 0.1, ease: 'power2.out',
                scrollTrigger: { trigger: step, start: 'top 88%', toggleActions: 'play none none none' }
            }
        );
    });

    // Animate service project cards
    gsap.utils.toArray('.service-project').forEach((project, i) => {
        gsap.fromTo(project,
            { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0,
                duration: 0.8, delay: i * 0.12, ease: 'power3.out',
                scrollTrigger: { trigger: project, start: 'top 88%', toggleActions: 'play none none none' }
            }
        );
    });

    // Animate service-about sections
    gsap.utils.toArray('.service-about-text, .service-about-visual').forEach(el => {
        gsap.fromTo(el,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0,
                duration: 0.8, ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
            }
        );
    });

    // Animate section headers on sub-pages
    gsap.utils.toArray('.service-section .section-header').forEach(header => {
        gsap.fromTo(header,
            { opacity: 0, y: 30 },
            {
                opacity: 1, y: 0,
                duration: 0.7, ease: 'power2.out',
                scrollTrigger: { trigger: header, start: 'top 88%', toggleActions: 'play none none none' }
            }
        );
    });

    // Animate video showcase
    const videoShowcase = document.querySelector('.video-showcase-player');
    if (videoShowcase) {
        gsap.fromTo(videoShowcase,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0,
                duration: 0.8, ease: 'power2.out',
                scrollTrigger: { trigger: videoShowcase, start: 'top 88%', toggleActions: 'play none none none' }
            }
        );
    }

    // Animate hero content on sub-pages
    const heroContent = document.querySelector('.service-page-hero-content');
    if (heroContent) {
        gsap.fromTo(heroContent,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.3 }
        );
    }
});
