/* ========================================
   SCRIPT.JS — Samscape's Solutions
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ---- STICKY NAVBAR ---- */
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        header?.classList.toggle('scrolled', window.scrollY > 60);
        document.getElementById('back-to-top')?.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    /* ---- HAMBURGER MENU ---- */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    hamburger?.addEventListener('click', () => {
        const open = navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', open);
        // Animate bars
        const bars = hamburger.querySelectorAll('span');
        if (open) {
            bars[0].style.transform = 'translateY(7px) rotate(45deg)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
        } else {
            bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
        }
    });
    // Close menu on link click
    navLinks?.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger?.setAttribute('aria-expanded', false);
            hamburger?.querySelectorAll('span').forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
        });
    });

    /* ---- SCROLL REVEAL ---- */
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Check for staggered delay
                const delay = entry.target.style.animationDelay || '0s';
                const ms = parseFloat(delay) * 1000;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, ms);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        revealObserver.observe(el);
    });

    /* ---- ANIMATED COUNTERS ---- */
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                animateCounter(el, target);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        const suffix = el.getAttribute('data-suffix') || '';
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            el.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    /* ---- BACK TO TOP ---- */
    document.getElementById('back-to-top')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---- ACTIVE NAV LINK ---- */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    /* ---- SMOOTH PARALLAX HERO ---- */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            heroBg.style.transform = `scale(1.05) translateY(${y * 0.3}px)`;
        }, { passive: true });
    }

    /* ---- GALLERY LIGHTBOX ---- */
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length) {
        // Create lightbox
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.innerHTML = `
            <div class="lb-overlay"></div>
            <div class="lb-content">
                <button class="lb-close" aria-label="Close"><i class="fas fa-times"></i></button>
                <button class="lb-prev" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>
                <img class="lb-img" src="" alt="Gallery image">
                <button class="lb-next" aria-label="Next"><i class="fas fa-chevron-right"></i></button>
            </div>
        `;
        document.body.appendChild(lightbox);

        const lbImg = lightbox.querySelector('.lb-img');
        let imgs = [];
        let current = 0;

        galleryItems.forEach((item, i) => {
            const img = item.querySelector('img');
            imgs.push({ src: img?.src, alt: img?.alt });
            item.addEventListener('click', () => openLightbox(i));
        });

        function openLightbox(idx) {
            current = idx;
            lbImg.src = imgs[idx].src;
            lbImg.alt = imgs[idx].alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
        function showPrev() { current = (current - 1 + imgs.length) % imgs.length; lbImg.src = imgs[current].src; }
        function showNext() { current = (current + 1) % imgs.length; lbImg.src = imgs[current].src; }

        lightbox.querySelector('.lb-close').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lb-overlay').addEventListener('click', closeLightbox);
        lightbox.querySelector('.lb-prev').addEventListener('click', showPrev);
        lightbox.querySelector('.lb-next').addEventListener('click', showNext);
        document.addEventListener('keydown', e => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        });
    }

    /* ---- CONTACT FORM VALIDATION ---- */
    const contactForm = document.getElementById('contact-form');
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sending...';
        btn.disabled = true;
        setTimeout(() => {
            showNotification('✓ Message sent! We\'ll be in touch within 24 hours.', 'success');
            contactForm.reset();
            btn.textContent = originalText;
            btn.disabled = false;
        }, 1500);
    });

    function showNotification(msg, type) {
        const note = document.createElement('div');
        note.className = `notification notification-${type}`;
        note.textContent = msg;
        document.body.appendChild(note);
        setTimeout(() => note.classList.add('show'), 100);
        setTimeout(() => { note.classList.remove('show'); setTimeout(() => note.remove(), 400); }, 4000);
    }

});

/* ---- LIGHTBOX + NOTIFICATION STYLES (injected) ---- */
const style = document.createElement('style');
style.textContent = `
#lightbox {
    position: fixed; inset: 0; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    opacity: 0; pointer-events: none; transition: opacity 0.3s;
}
#lightbox.active { opacity: 1; pointer-events: all; }
.lb-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.93); }
.lb-content { position: relative; max-width: 90vw; max-height: 90vh; display: flex; align-items: center; gap: 1rem; }
.lb-img { max-width: 80vw; max-height: 85vh; object-fit: contain; border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
.lb-close, .lb-prev, .lb-next {
    position: absolute; background: rgba(255,255,255,0.1); border: 1.5px solid rgba(255,255,255,0.2);
    color: white; border-radius: 50%; width: 44px; height: 44px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.3s; font-size: 0.9rem;
}
.lb-close { top: -52px; right: 0; }
.lb-prev { left: -56px; top: 50%; transform: translateY(-50%); }
.lb-next { right: -56px; top: 50%; transform: translateY(-50%); }
.lb-close:hover, .lb-prev:hover, .lb-next:hover { background: #c8a45a; border-color: #c8a45a; color: #0a2215; }
.notification {
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(20px);
    background: #1e5c38; color: white; padding: 1rem 2rem; border-radius: 100px;
    font-size: 0.9rem; font-weight: 500; z-index: 9999; opacity: 0; transition: all 0.4s;
    box-shadow: 0 8px 30px rgba(0,0,0,0.2); white-space: nowrap;
}
.notification.show { opacity: 1; transform: translateX(-50%) translateY(0); }
.notification-success { background: #1e5c38; }
`;
document.head.appendChild(style);
