// ============================================
// EGAS NGO - Main JavaScript
// ============================================

// Navbar scroll effect
const navbar = document.getElementById('navbar');
if (navbar) {
    const updateNavbar = () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('transparent');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.add('transparent');
        }
    };
    window.addEventListener('scroll', updateNavbar);
    updateNavbar(); // Initial check
}

// Mobile menu toggle
const menuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });
}

// ============================================
// DARK MODE THEME TOGGLE
// ============================================
(function() {
    const STORAGE_KEY = 'egasTheme';
    const htmlEl = document.documentElement;

    // Apply saved theme on load
    const savedTheme = localStorage.getItem(STORAGE_KEY) || 'light';
    if (savedTheme === 'dark') {
        htmlEl.setAttribute('data-theme', 'dark');
    }

    // Inject toggle button into navbar
    function injectThemeBtn() {
        const nav = document.getElementById('navbar');
        if (!nav) return;

        const btn = document.createElement('button');
        btn.id = 'themeToggleBtn';
        btn.className = 'theme-toggle-btn';
        btn.setAttribute('aria-label', 'تغيير الوضع');
        btn.title = 'تبديل الوضع الداكن / الفاتح';

        const isDark = htmlEl.getAttribute('data-theme') === 'dark';
        btn.innerHTML = isDark
            ? '<i class="fas fa-sun"></i>'
            : '<i class="fas fa-moon"></i>';

        btn.addEventListener('click', () => {
            const currentTheme = htmlEl.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlEl.setAttribute('data-theme', newTheme);
            localStorage.setItem(STORAGE_KEY, newTheme);

            // Animate icon change
            btn.style.transform = 'rotate(360deg)';
            setTimeout(() => { btn.style.transform = ''; }, 400);

            btn.innerHTML = newTheme === 'dark'
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';
        });

        // Insert at the beginning of nav-container
        const navContainer = nav.querySelector('.nav-container');
        if (navContainer) {
            navContainer.prepend(btn);
        } else {
            nav.appendChild(btn);
        }
    }

    // Run after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
             injectThemeBtn();
             applySiteSettings();
        });
    } else {
        injectThemeBtn();
        applySiteSettings();
        syncEgasData(); // Background sync with Firebase
    }
})();

// ============================================
// FIREBASE SYNC (Background)
// ============================================
// ============================================
// STATIC DATA SYNC (Local Fetch)
// ============================================
function syncEgasData() {
    const dataPath = (window.location.pathname.includes('/ar/') || window.location.pathname.includes('/en/') || window.location.pathname.includes('/tmz/')) 
        ? '../content/data.json' 
        : './content/data.json';

    fetch(dataPath)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            // Update local storage for frontend pages
            localStorage.setItem('egasSettings', JSON.stringify(data.settings));
            localStorage.setItem('egasNews', JSON.stringify(data.news));
            localStorage.setItem('egasProjects', JSON.stringify(data.projects));
            localStorage.setItem('egasPartners', JSON.stringify(data.partners));
            localStorage.setItem('egasData', JSON.stringify(data));
            
            // Re-apply settings to show changes immediately
            applySiteSettings();
            
            // Dispatch event for pages that need to re-render (like news/projects)
            window.dispatchEvent(new CustomEvent('egasDataUpdated'));
            console.log("Site data synced from static file.");
        })
        .catch(err => {
            console.warn("Static data sync error (using local cache):", err);
            // Fallback: If fetch fails, we still try to apply whatever is in localStorage
            applySiteSettings();
        });
}

// ============================================
// DYNAMIC SITE SETTINGS
// ============================================
function applySiteSettings() {
    const settings = JSON.parse(localStorage.getItem('egasSettings'));
    if (!settings) return;

    // Determine current language from <html> lang attribute
    const lang = document.documentElement.lang || 'ar'; // ar, en, tmz
    const langData = settings[lang] || settings['ar'];
    const general = settings.general || {};

    // 1. Update general contact info (everywhere)
    const emailLinks = document.querySelectorAll('a[href^="mailto:"], .footer-contact-item span, .footer-contact-item a[href^="mailto:"]');
    emailLinks.forEach(el => {
        if (el.tagName === 'A' && el.href.includes('mailto:')) el.href = 'mailto:' + general.email;
        if (el.innerText.includes('@')) el.innerText = general.email;
    });

    const fbLinks = document.querySelectorAll('.footer-social-link[title="فيسبوك"], .footer-social-link i.fa-facebook-f');
    fbLinks.forEach(el => {
        const link = el.closest('a');
        if (link) link.href = general.facebook;
    });

    const igLinks = document.querySelectorAll('.footer-social-link[title="إنستغرام"], .footer-social-link i.fa-instagram');
    igLinks.forEach(el => {
        const link = el.closest('a');
        if (link) link.href = general.instagram;
    });

    // Update Developer name in footer
    const devName = document.querySelector('.footer-bottom strong');
    if (devName && general.developer) devName.innerText = general.developer;

    // 2. Update page content based on data-edit attributes
    document.querySelectorAll('[data-edit]').forEach(el => {
        const key = el.getAttribute('data-edit');
        if (langData[key]) {
            el.innerText = langData[key];
        }
    });

    // Special case for footer description (usually a paragraph)
    const footerDesc = document.querySelector('.footer-desc');
    if (footerDesc && langData.footer_desc) footerDesc.innerText = langData.footer_desc;
}

// ============================================
// SCROLL REVEAL ANIMATION
// ============================================
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.card, .project-card, .partner-card, .value-item, .about-feature').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});
