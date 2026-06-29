"use strict";
// ── Types ──────────────────────────────────────────────────────────────
// ── Constants ──────────────────────────────────────────────────────────
const WEB3FORMS_KEY = '55758ca9-3c2f-41a1-bd81-b4c312d81d56';
const SCROLL_THRESHOLD = 80;
const NAV_OFFSET = 80;
// ── Navbar scroll ──────────────────────────────────────────────────────
function initNavbar() {
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
        updateActiveNav();
    }, { passive: true });
}
// ── Active nav link ────────────────────────────────────────────────────
const sectionIds = ['work', 'experience', 'contact'];
const navMap = {
    work: document.getElementById('nav-work'),
    experience: document.getElementById('nav-about'),
    contact: document.getElementById('nav-contact'),
};
function updateActiveNav() {
    let current;
    sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120)
            current = id;
    });
    Object.values(navMap).forEach((a) => a?.classList.remove('active'));
    if (current !== undefined) {
        const activeLink = navMap[current];
        if (activeLink)
            activeLink.classList.add('active');
    }
}
// ── Intersection Observer — fade-up ────────────────────────────────────
function initFadeObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
    document
        .querySelectorAll('.fade-up')
        .forEach((el) => observer.observe(el));
}
// ── Smooth scroll ──────────────────────────────────────────────────────
function initSmoothScroll() {
    document
        .querySelectorAll('a[href^="#"]')
        .forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#')
                return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                window.scrollTo({
                    top: target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET,
                    behavior: 'smooth',
                });
            }
        });
    });
}
// ── Contact form — Web3Forms ───────────────────────────────────────────
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form)
        return;
    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const nameEl = document.getElementById('form-name');
        const emailEl = document.getElementById('form-email');
        const messageEl = document.getElementById('form-message');
        const success = document.getElementById('form-success');
        const submitBtn = this.querySelector('button[type="submit"]');
        const fields = this.querySelectorAll('input, textarea, button');
        const name = nameEl.value.trim();
        const email = emailEl.value.trim();
        const message = messageEl.value.trim();
        if (!name || !email || !message)
            return;
        // Disable all fields & show loading
        fields.forEach((el) => (el.disabled = true));
        submitBtn.textContent = 'Sending...';
        const payload = {
            access_key: WEB3FORMS_KEY,
            subject: `New message from ${name} — Portfolio`,
            from_name: 'Portfolio Contact Form',
            name,
            email,
            message,
        };
        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (data.success) {
                success.textContent = "// Message sent. I'll get back to you soon.";
                success.style.color = 'var(--accent)';
                success.style.display = 'block';
                this.reset();
                setTimeout(() => {
                    success.style.display = 'none';
                }, 6000);
            }
            else {
                throw new Error(data.message ?? 'Submission failed');
            }
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : 'Something went wrong. Try emailing directly.';
            success.textContent = `// Error: ${msg}`;
            success.style.color = '#ff4444';
            success.style.display = 'block';
        }
        finally {
            fields.forEach((el) => (el.disabled = false));
            submitBtn.textContent = 'Send Message';
        }
    });
}
// ── Bootstrap ──────────────────────────────────────────────────────────
initNavbar();
initFadeObserver();
initSmoothScroll();
initContactForm();
