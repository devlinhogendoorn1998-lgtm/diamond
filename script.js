document.addEventListener('DOMContentLoaded', () => {

    const nav         = document.getElementById('mainNav');
    const menuToggle  = document.getElementById('menuToggle');
    const navDropdown = document.getElementById('navDropdown');
    const navOverlay  = document.getElementById('navOverlay');

    // ── Helpers ──────────────────────────────────────────────
    function openMenu() {
        navDropdown.style.top = nav.getBoundingClientRect().bottom + 'px';
        navDropdown.classList.add('open');
        navOverlay.classList.add('active');
        menuToggle.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        navDropdown.classList.remove('open');
        navOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    // ── Hamburger toggle ──────────────────────────────────────
    menuToggle.addEventListener('click', () => {
        navDropdown.classList.contains('open') ? closeMenu() : openMenu();
    });

    // ── Klik op overlay sluit menu ────────────────────────────
    navOverlay.addEventListener('click', closeMenu);

    // ── Klik op een nav-link sluit menu ──────────────────────
    navDropdown.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // ── Nav: transparant → opaque bij scrollen ────────────────
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
        // Houd dropdown uitgelijnd als hij open is
        if (navDropdown.classList.contains('open')) {
            navDropdown.style.top = nav.getBoundingClientRect().bottom + 'px';
        }
    }, { passive: true });

    // ── Escape-toets sluit menu ───────────────────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // ── Scroll-reveal via IntersectionObserver ────────────────
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    const observer  = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));

    // ── Formulier afhandeling ─────────────────────────────────
    const luxeForm = document.getElementById('luxeForm');
    luxeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const service = document.getElementById('service-select').value;
        if (!service) {
            alert('Maak een keuze uit het dropdown menu.');
            return;
        }

        const btn          = luxeForm.querySelector('.btn-submit');
        const originalText = btn.textContent;

        btn.textContent    = 'Aanvraag ontvangen ◇';
        btn.style.background = 'linear-gradient(135deg, #4a7c59, #2d5a3d)';
        btn.disabled       = true;

        setTimeout(() => {
            luxeForm.reset();
            btn.textContent  = originalText;
            btn.style.background = '';
            btn.disabled     = false;
        }, 3500);
    });

});

