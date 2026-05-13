document.addEventListener('DOMContentLoaded', () => {

    // // DOM refs
    const nav         = document.getElementById('mainNav');
    const menuToggle  = document.getElementById('menuToggle');
    const navDropdown = document.getElementById('navDropdown');
    const navOverlay  = document.getElementById('navOverlay');

    // // Menu helpers
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

    // // Hamburger toggle
    menuToggle.addEventListener('click', () => {
        navDropdown.classList.contains('open') ? closeMenu() : openMenu();
    });

    // // Overlay sluit menu
    navOverlay.addEventListener('click', closeMenu);

    // // Nav-links sluiten menu
    navDropdown.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // // Escape sluit menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });

    // // Scroll: nav transparant → opaque via requestAnimationFrame
    // Voorkomt "forced synchronous layout" — lees scrollY pas inside RAF,
    // nooit direct in de event-callback (dat blokkeert de main thread).
    let rafPending = false;
    let lastScrollY = window.scrollY;

    function onScrollRAF() {
        // // Lees layout-waarden hier, niet in de event listener
        const scrolled = lastScrollY > 60;
        nav.classList.toggle('scrolled', scrolled);

        if (navDropdown.classList.contains('open')) {
            navDropdown.style.top = nav.getBoundingClientRect().bottom + 'px';
        }

        rafPending = false;
    }

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;   // goedkoop: geen forced layout
        if (!rafPending) {
            rafPending = true;
            requestAnimationFrame(onScrollRAF);
        }
    }, { passive: true });

    // // Scroll-reveal via IntersectionObserver
    const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));

    // // Formulier afhandeling
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

        btn.textContent      = 'Aanvraag ontvangen ◇';
        btn.style.background = 'linear-gradient(135deg, #4a7c59, #2d5a3d)';
        btn.disabled         = true;

        setTimeout(() => {
            luxeForm.reset();
            btn.textContent      = originalText;
            btn.style.background = '';
            btn.disabled         = false;
        }, 3500);
    });

});

