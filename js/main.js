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
        document.addEventListener('DOMContentLoaded', injectThemeBtn);
    } else {
        injectThemeBtn();
    }
})();

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
